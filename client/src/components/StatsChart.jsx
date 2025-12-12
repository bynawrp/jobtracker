import { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { STATUS_OPTIONS } from '../utils/constants';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

export default function StatsChart({ applications }) {
    const chartData = useMemo(() => {
        const stats = {
            labels: [],
            data: [],
            colors: []
        };

        STATUS_OPTIONS.forEach(option => {
            const count = applications.filter(app => app.status === option.value).length;
            stats.labels.push(option.label);
            stats.data.push(count);
            stats.colors.push(option.color);
        });

        return stats;
    }, [applications]);

    const doughnutData = {
        labels: chartData.labels,
        datasets: [
            {
                data: chartData.data,
                backgroundColor: chartData.colors,
                borderColor: '#ffffff',
                borderWidth: 2
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        
        plugins: {
            legend: {
                position: 'bottom',
                display: true,
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    boxWidth: 10,
                    boxHeight: 10,
                    font: {
                        size: 11
                    },
                    borderWidth: 0,
                    pointStyle: 'circle'
                },
                align: 'center'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = chartData.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const total = chartData.data.reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        return null;
    }

    return (
        <div className="stats-chart-container" data-chart>
            <div className="stats-chart-header">
                <h3>Statistiques des candidatures</h3>
                <p className="muted">Total: {total} candidature{total > 1 ? 's' : ''}</p>
            </div>
            <div className="chart-wrapper">
                <div className="chart chart-doughnut">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
            </div>
        </div>
    );
}

