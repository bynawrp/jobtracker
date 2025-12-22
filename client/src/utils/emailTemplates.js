// Email templates
export const emailTemplates = {
    motivation: {
        name: 'Motivation',
        subject: 'Candidature pour le poste de {{title}}',
        body: `Madame, Monsieur,

Je me permets de vous adresser ma candidature pour le poste de {{title}} au sein de {{company}}.

[Votre texte ici]

Je reste à votre disposition pour tout complément d'information et me tiens disponible pour un éventuel entretien.

Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

{{userFirstName}} {{userLastName}}
{{phoneNumber}}`
    },

    followUp: {
        name: 'Relance',
        subject: 'Relance - Candidature pour le poste de {{title}}',
        body: `Madame, Monsieur,

Je me permets de relancer ma candidature pour le poste de {{title}} au sein de {{company}}, pour laquelle j'ai postulé le {{dateApplied}}.

[Votre texte ici]

Je reste à votre disposition pour tout complément d'information.

Cordialement,

{{userFirstName}} {{userLastName}}
{{phoneNumber}}`
    },

    thankYou: {
        name: 'Remerciement',
        subject: 'Remerciement - Entretien pour le poste de {{title}}',
        body: `Madame, Monsieur,

Je tenais à vous remercier pour l'entretien que nous avons eu concernant le poste de {{title}} au sein de {{company}}.

[Votre texte ici]

Je reste à votre disposition pour tout complément d'information.

Cordialement,

{{userFirstName}} {{userLastName}}
{{phoneNumber}}`
    },

    inquiry: {
        name: 'Information',
        subject: 'Demande d\'information - Poste de {{title}}',
        body: `Madame, Monsieur,

Je me permets de vous contacter concernant le poste de {{title}} au sein de {{company}}.

[Votre texte ici]

Je vous remercie par avance pour votre retour.

Cordialement,

{{userFirstName}} {{userLastName}}
{{phoneNumber}}`
    },
    
    custom: {
        name: 'Personnalisé',
        subject: '',
        body: ''
    }
};

export const replacePlaceholders = (text, data) => {
    if (!text) return '';
    
    return text
        .replace(/\{\{title\}\}/g, data.title || '[Titre du poste]')
        .replace(/\{\{company\}\}/g, data.company || '[Nom de l\'entreprise]')
        .replace(/\{\{dateApplied\}\}/g, data.dateApplied ? new Date(data.dateApplied).toLocaleDateString('fr-FR') : '[Date]')
        .replace(/\{\{userFirstName\}\}/g, data.userFirstName || '[Prénom]')
        .replace(/\{\{userLastName\}\}/g, data.userLastName || '[Nom]')
        .replace(/\{\{link\}\}/g, data.link || '[Lien]')
        .replace(/\{\{phoneNumber\}\}/g, data.phoneNumber && data.phoneNumber.trim() ? data.phoneNumber : '');
};

