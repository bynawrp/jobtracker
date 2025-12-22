import { useState, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DocumentArrowDownIcon, DocumentTextIcon, TableCellsIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { parseStatus, getTodayDateString, formatDateForExport } from '../utils/formatters';

export default function FileExporter({ applications, filters = {} }) {
    const [isExporting, setIsExporting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);


    const generatePDF = async () => {
        try {
            setIsExporting(true);
            //setup the PDF document
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPos = margin;

            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Rapport de candidatures', margin, yPos);
            yPos += 10;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Le ${new Date().toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}`, margin, yPos);
            yPos += 10;

            if (Object.values(filters).some(v => v && v !== false)) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.text('Rapport filtré', margin, yPos);
                yPos += 8;
            }

            try {
                const chartElement = document.querySelector('.chart, .stats-chart, [data-chart]');
                if (chartElement) {
                    const canvas = await html2canvas(chartElement, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                        logging: false
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = pageWidth - (margin * 2);
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    if (yPos + imgHeight > pageHeight - 30) {
                        doc.addPage();
                        yPos = margin;
                    }
                    doc.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
                    yPos += imgHeight + 10;
                }
            } catch (chartError) {
                console.warn('Impossible de capturer le graphique:', chartError);
            }

            if (yPos > pageHeight - 50) {
                doc.addPage();
                yPos = margin;
            }

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Liste des candidatures', margin, yPos);
            yPos += 10;

            applications.forEach((app, index) => {
                if (yPos > pageHeight - 40) {
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`${index + 1}. ${app.title || 'Sans titre'}`, margin, yPos);
                yPos += 6;

                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                
                const details = [
                    app.company && `Entreprise: ${app.company}`,
                    app.status && `Statut: ${parseStatus(app.status)}`,
                    app.dateApplied && `Date de candidature: ${formatDateForExport(app.dateApplied)}`,
                    app.reminderDate && `Date de rappel: ${formatDateForExport(app.reminderDate)}`,
                    app.link && `Lien: ${app.link.length > 60 ? app.link.substring(0, 60) + '...' : app.link}`,
                    app.notes && `Notes: ${app.notes}`
                ].filter(Boolean);

                details.forEach(detail => {
                    if (detail.startsWith('Notes:')) {
                        const notes = doc.splitTextToSize(detail, pageWidth - (margin * 2) - 10);
                        doc.text(notes, margin + 5, yPos);
                        yPos += notes.length * 5;
                    } else {
                        doc.text(detail, margin + 5, yPos);
                        yPos += 5;
                    }
                });

                yPos += 8;
            });

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} sur ${pageCount}`, pageWidth - 30, pageHeight - 10);
            }

            doc.save(`candidatures_${getTodayDateString()}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Erreur lors de l\'export PDF. Veuillez réessayer.');
        } finally {
            setIsExporting(false);
        }
    };

    const generateCSV = () => {
        try {
            setIsExporting(true);

            const headers = ['Poste', 'Entreprise', 'Statut', 'Date de candidature', 'Date de rappel', 'Lien', 'Notes'];
            const rows = applications.map(app => [
                app.title || '',
                app.company || '',
                parseStatus(app.status) || '',
                app.dateApplied ? formatDateForExport(app.dateApplied) : '',
                app.reminderDate ? formatDateForExport(app.reminderDate) : '',
                app.link || '',
                app.notes ? app.notes.replace(/"/g, '""') : ''
            ]);

            const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
            // setup the CSV file
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `candidatures_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de la génération du CSV:', error);
            alert('Erreur lors de l\'export CSV. Veuillez réessayer.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExport = (format) => {
        setShowMenu(false);
        if (format === 'pdf') {
            generatePDF();
        } else if (format === 'csv') {
            generateCSV();
        }
    };

    if (applications.length === 0) return null;

    return (
        <div className="export-dropdown" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isExporting}
                className="btn"
                aria-label="Exporter"
                title="Exporter les candidatures"
            >
                <DocumentArrowDownIcon className="icon-sm" />
                <span className="btn-label">Exporter</span>
                <ChevronDownIcon className="icon-sm" />
            </button>
            {showMenu && (
                <div className="export-menu">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="export-menu-item"
                        disabled={isExporting}
                        aria-label="Exporter en PDF"
                        title="Exporter en PDF"
                    >
                        <DocumentTextIcon className="icon-sm export-icon-pdf" />
                        <span>PDF</span>
                    </button>
                    <button
                        onClick={() => handleExport('csv')}
                        className="export-menu-item"
                        disabled={isExporting}
                        aria-label="Exporter en CSV"
                        title="Exporter en CSV"
                    >
                        <TableCellsIcon className="icon-sm export-icon-csv" />
                        <span>CSV</span>
                    </button>
                </div>
            )}
        </div>
    );
}
