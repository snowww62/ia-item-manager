export const translations = {
  en: {
    // Sidebar
    sidebar: {
      title: 'IA Item Manager',
      subtitle: 'by Snow',
      myItems: 'My Items',
      upload: 'Upload',
      faq: 'FAQ',
      settings: 'Settings',
      version: 'Version'
    },

    // Upload Panel
    upload: {
      title: 'Upload Files to Internet Archive',
      subtitle: 'Upload your files to preserve them forever',
      itemInfo: 'Item Information',
      identifier: 'Identifier (required)',
      identifierPlaceholder: 'my-unique-item-identifier',
      identifierHelp: 'Must be unique. Use lowercase, numbers, hyphens and underscores only.',
      title: 'Title',
      titlePlaceholder: 'A descriptive title for your item',
      description: 'Description',
      descriptionPlaceholder: 'Describe your item...',
      filesToUpload: 'Files to Upload',
      selectFiles: 'Select Files',
      noFiles: 'No files selected',
      noFilesHelp: 'Click "Select Files" to choose files to upload',
      uploadButton: 'Upload to Internet Archive',
      uploading: 'Uploading...',
      uploadSuccess: 'Uploaded successfully',
      uploadFailed: 'Upload failed',
      fillRequired: 'Please select files and make sure an item is selected from the Items tab',
      existingItemOnly: 'Upload only works for existing items. Go to Items tab, select an item, then click "Add Files"'
    },

    // Items Panel
    items: {
      title: 'My Items',
      subtitle: 'Browse and manage your Internet Archive items',
      refresh: 'Refresh',
      search: 'Search your items...',
      searchButton: 'Search',
      noItems: 'No items found',
      noItemsHelp: 'Upload your first item or adjust your search',
      views: 'views',
      published: 'Published',
      credentialsError: 'Please configure your credentials in Settings first'
    },

    // Item Details
    details: {
      back: 'Back to Items',
      viewOnArchive: 'View on Archive.org',
      published: 'Published',
      views: 'Views',
      mediaType: 'Media Type',
      description: 'Description',
      files: 'Files',
      noFiles: 'No files found',
      download: 'Download',
      delete: 'Delete',
      deleteConfirm: 'Are you sure you want to delete',
      deleteSuccess: 'File deleted successfully',
      deleteFailed: 'Failed to delete file',
      deleteItem: 'Delete Entire Item',
      deleteItemConfirm: 'Are you sure you want to delete this entire item and all its files? This action cannot be undone!',
      deleteItemSuccess: 'Item deleted successfully',
      deleteItemFailed: 'Failed to delete item',
      deleting: 'Deleting...'
    },

    // Settings Panel
    settings: {
      title: 'Settings',
      subtitle: 'Configure your Internet Archive credentials',
      howToGetKeys: 'How to get your API credentials',
      step1: 'Log in to your Internet Archive account',
      step2: 'Go to your account settings',
      step3: 'Find the "S3 API Keys" section',
      step4: 'Copy your Access Key and Secret Key',
      goToKeys: 'Go to API Keys page',
      userProfile: 'User Profile',
      displayName: 'Display Name (optional)',
      displayNamePlaceholder: 'Your name',
      displayNameHelp: 'This is just for your personal use in the app',
      apiCredentials: 'Internet Archive API Credentials',
      accessKey: 'Access Key',
      accessKeyPlaceholder: 'Enter your Access Key',
      secretKey: 'Secret Key',
      secretKeyPlaceholder: 'Enter your Secret Key',
      languagePrefs: 'Language & Preferences',
      language: 'Language',
      languageHelp: 'Interface language',
      autoRefresh: 'Auto-refresh items list',
      autoRefreshHelp: 'Automatically refresh when opening My Items',
      saveSettings: 'Save All Settings',
      settingsSaved: 'Settings Saved!',
      about: 'About IA Item Manager',
      version: 'Version',
      author: 'Author',
      authorText: 'Made with ❤️ for Internet Archive users',
      description: 'Description',
      descriptionText: 'A beautiful desktop application to manage your Internet Archive files',
      privacy: 'Privacy',
      privacyText: 'Your credentials are stored locally on your computer and are never sent to any third-party servers except Internet Archive\'s official API.',
      portable: 'Portable',
      portableText: 'You can share this app with others! Each user will have their own settings and credentials.'
    },

    // FAQ
    faq: {
      title: 'Frequently Asked Questions',
      subtitle: 'Common questions about using IA Item Manager',
      links: 'Useful Links',
      linkApiKeys: 'Get API Keys',
      linkDocs: 'Internet Archive API Documentation',
      linkGeneralFaq: 'Internet Archive General FAQ',
      madeBy: 'Made by Snow • Version 1.0.0',
      questions: [
        {
          question: "How do I get my Internet Archive API keys?",
          answer: "Go to https://archive.org/account/s3.php and log in with your Internet Archive account. You'll find your Access Key and Secret Key there. Copy them and paste them in the Settings panel."
        },
        {
          question: "What is an identifier?",
          answer: "An identifier is a unique name for your item on Internet Archive. It must be lowercase, use only letters, numbers, hyphens, and underscores. Example: my-retro-games-collection"
        },
        {
          question: "Can I upload multiple files at once?",
          answer: "Yes! Click 'Select Files' and you can choose multiple files to upload. They will all be uploaded to the same item."
        },
        {
          question: "How do I add files to an existing item?",
          answer: "Go to 'My Items', click on the item you want to add files to, then click the '+ Add Files' button. The identifier will be locked and your new files will be added to that item."
        },
        {
          question: "Why can't I see my items?",
          answer: "Make sure you've entered your API keys in Settings and your Internet Archive email in the 'IA Email' field. The app searches for items uploaded by your account."
        },
        {
          question: "Can I delete items?",
          answer: "Yes, but Internet Archive keeps some system files (_meta.xml, etc.) that cannot be deleted. Your uploaded files will be removed. For complete deletion, you need to use the Internet Archive website."
        },
        {
          question: "What are metadata fields?",
          answer: "Metadata describes your item: Title (display name), Description (what it contains), Subject (tags for search), Creator (author), and Media Type (software, movies, audio, etc.)."
        },
        {
          question: "Why does my upload take time to appear?",
          answer: "After upload, Internet Archive processes files (creates derivatives, thumbnails, etc.). This can take from a few minutes to several hours depending on file size and server load."
        },
        {
          question: "What file types can I upload?",
          answer: "You can upload any file type. Common types: ZIP, ISO, PDF, MP4, MP3, JPG, PNG, TXT, etc. Internet Archive will process them automatically."
        },
        {
          question: "How do I download files?",
          answer: "In the item details, each file has a download button that opens the optimized download link on archive.org."
        },
        {
          question: "I get a '503 SlowDown' or 'spam' error when uploading. What should I do?",
          answer: "🚨 ACCOUNT TEMPORARILY BLOCKED - Your account is limited for creating NEW items (not for adding to existing items). ✅ IMMEDIATE SOLUTION: Go to 'My Items' → Click an existing item → 'Add Files' button → Upload there (it works!). 📧 TO UNBLOCK: Wait 24-48h without creating new items, then contact info@archive.org. Meanwhile, use ONLY existing items."
        },
        {
          question: "Why can I upload on the website but not in the app?",
          answer: "On the website, you are probably adding files to EXISTING items, which is allowed even if your account is limited. The app works the same way: use 'My Items' → Select an item → 'Add Files' instead of creating a new item."
        }
      ]
    },

    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      file: 'File',
      files: 'Files'
    }
  },

  fr: {
    // Sidebar
    sidebar: {
      title: 'IA Item Manager',
      subtitle: 'by Snow',
      myItems: 'Mes Items',
      upload: 'Upload',
      faq: 'FAQ',
      settings: 'Paramètres',
      version: 'Version'
    },

    // Upload Panel
    upload: {
      title: 'Uploader des fichiers sur Internet Archive',
      subtitle: 'Envoyez vos fichiers pour les préserver pour toujours',
      itemInfo: 'Informations de l\'item',
      identifier: 'Identifiant (requis)',
      identifierPlaceholder: 'mon-identifiant-unique',
      identifierHelp: 'Doit être unique. Utilisez uniquement des minuscules, chiffres, tirets et underscores.',
      title: 'Titre',
      titlePlaceholder: 'Un titre descriptif pour votre item',
      description: 'Description',
      descriptionPlaceholder: 'Décrivez votre item...',
      filesToUpload: 'Fichiers à uploader',
      selectFiles: 'Sélectionner des fichiers',
      noFiles: 'Aucun fichier sélectionné',
      noFilesHelp: 'Cliquez sur "Sélectionner des fichiers" pour choisir des fichiers à uploader',
      uploadButton: 'Upload vers Internet Archive',
      uploading: 'Upload en cours...',
      uploadSuccess: 'Upload réussi',
      uploadFailed: 'Échec de l\'upload',
      fillRequired: 'Veuillez sélectionner des fichiers et assurez-vous qu\'un item est sélectionné depuis l\'onglet Items',
      existingItemOnly: 'L\'upload ne fonctionne que pour les items existants. Allez dans l\'onglet Items, sélectionnez un item, puis cliquez sur "Add Files"'
    },

    // Items Panel
    items: {
      title: 'Mes Items',
      subtitle: 'Parcourir et gérer vos items Internet Archive',
      refresh: 'Actualiser',
      search: 'Rechercher vos items...',
      searchButton: 'Rechercher',
      noItems: 'Aucun item trouvé',
      noItemsHelp: 'Uploadez votre premier item ou ajustez votre recherche',
      views: 'vues',
      published: 'Publié',
      credentialsError: 'Veuillez configurer vos identifiants dans les Paramètres'
    },

    // Item Details
    details: {
      back: 'Retour aux Items',
      viewOnArchive: 'Voir sur Archive.org',
      published: 'Publié',
      views: 'Vues',
      mediaType: 'Type de média',
      description: 'Description',
      files: 'Fichiers',
      noFiles: 'Aucun fichier trouvé',
      download: 'Télécharger',
      delete: 'Supprimer',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
      deleteSuccess: 'Fichier supprimé avec succès',
      deleteFailed: 'Échec de la suppression du fichier',
      deleteItem: 'Supprimer l\'item entier',
      deleteItemConfirm: 'Êtes-vous sûr de vouloir supprimer cet item entier et tous ses fichiers ? Cette action ne peut pas être annulée !',
      deleteItemSuccess: 'Item supprimé avec succès',
      deleteItemFailed: 'Échec de la suppression de l\'item',
      deleting: 'Suppression...',
      addFiles: 'Ajouter des fichiers',
      editMetadata: 'Modifier les métadonnées',
      metadata: 'Métadonnées'
    },

    // Settings Panel
    settings: {
      title: 'Paramètres',
      subtitle: 'Configurez vos identifiants Internet Archive',
      howToGetKeys: 'Comment obtenir vos identifiants API',
      step1: 'Connectez-vous à votre compte Internet Archive',
      step2: 'Allez dans les paramètres de votre compte',
      step3: 'Trouvez la section "Clés API S3"',
      step4: 'Copiez votre Clé d\'accès et Clé secrète',
      goToKeys: 'Aller à la page des clés API',
      userProfile: 'Profil utilisateur',
      displayName: 'Nom d\'affichage (optionnel)',
      displayNamePlaceholder: 'Votre nom',
      displayNameHelp: 'C\'est juste pour votre usage personnel dans l\'app',
      apiCredentials: 'Identifiants API Internet Archive',
      accessKey: 'Clé d\'accès',
      accessKeyPlaceholder: 'Entrez votre clé d\'accès',
      secretKey: 'Clé secrète',
      secretKeyPlaceholder: 'Entrez votre clé secrète',
      languagePrefs: 'Langue & Préférences',
      language: 'Langue',
      languageHelp: 'Langue de l\'interface',
      autoRefresh: 'Actualisation automatique',
      autoRefreshHelp: 'Actualiser automatiquement lors de l\'ouverture de Mes Items',
      saveSettings: 'Enregistrer les paramètres',
      settingsSaved: 'Paramètres enregistrés !',
      about: 'À propos de IA Item Manager',
      version: 'Version',
      author: 'Auteur',
      authorText: 'Fait avec ❤️ pour les utilisateurs d\'Internet Archive',
      description: 'Description',
      descriptionText: 'Une belle application desktop pour gérer vos fichiers Internet Archive',
      privacy: 'Confidentialité',
      privacyText: 'Vos identifiants sont stockés localement sur votre ordinateur et ne sont jamais envoyés à des serveurs tiers sauf l\'API officielle d\'Internet Archive.',
      portable: 'Portable',
      portableText: 'Vous pouvez partager cette app avec d\'autres ! Chaque utilisateur aura ses propres paramètres et identifiants.'
    },

    // FAQ
    faq: {
      title: 'Questions Fréquentes',
      subtitle: 'Questions courantes sur l\'utilisation de IA Item Manager',
      links: 'Liens Utiles',
      linkApiKeys: 'Obtenir les clés API',
      linkDocs: 'Documentation de l\'API Internet Archive',
      linkGeneralFaq: 'FAQ générale d\'Internet Archive',
      madeBy: 'Créé par Snow • Version 1.0.0',
      questions: [
        {
          question: "Comment obtenir mes clés API Internet Archive ?",
          answer: "Allez sur https://archive.org/account/s3.php et connectez-vous avec votre compte Internet Archive. Vous y trouverez votre Access Key et Secret Key. Copiez-les et collez-les dans le panneau Paramètres."
        },
        {
          question: "Qu'est-ce qu'un identifiant ?",
          answer: "Un identifiant est un nom unique pour votre item sur Internet Archive. Il doit être en minuscules et utiliser uniquement des lettres, chiffres, tirets et underscores. Exemple : ma-collection-retro-games"
        },
        {
          question: "Comment créer mon premier item ?",
          answer: "Pour créer votre premier item, utilisez le site web Internet Archive sur https://archive.org/upload/. Une fois créé, utilisez cette app pour y ajouter des centaines de fichiers facilement !"
        },
        {
          question: "Puis-je uploader plusieurs fichiers à la fois ?",
          answer: "Oui ! Cliquez sur 'Sélectionner des fichiers' et vous pouvez choisir plusieurs fichiers à uploader. Ils seront tous uploadés vers le même item."
        },
        {
          question: "Comment ajouter des fichiers à un item existant ?",
          answer: "Allez dans 'Mes Items', cliquez sur l'item auquel vous voulez ajouter des fichiers, puis cliquez sur le bouton '+ Add Files'. L'identifiant sera verrouillé et vos nouveaux fichiers seront ajoutés à cet item."
        },
        {
          question: "Comment organiser mes fichiers en dossiers ?",
          answer: "Utilisez le champ 'Target Folder' lors de l'upload. Par exemple : 'roms/intellivision/' créera automatiquement les dossiers 'roms' et 'intellivision' dans votre item."
        },
        {
          question: "Pourquoi je ne vois pas mes items ?",
          answer: "Assurez-vous d'avoir entré vos clés API dans les Paramètres et votre email Internet Archive dans le champ 'IA Email'. L'app recherche les items uploadés par votre compte."
        },
        {
          question: "Puis-je supprimer des items ?",
          answer: "Oui, mais Internet Archive conserve certains fichiers système (_meta.xml, etc.) qui ne peuvent pas être supprimés. Vos fichiers uploadés seront retirés. Pour une suppression complète, utilisez le site web d'Internet Archive."
        },
        {
          question: "Que sont les champs de métadonnées ?",
          answer: "Les métadonnées décrivent votre item : Title (nom affiché), Description (contenu), Subject (tags de recherche), Creator (auteur) et Media Type (software, movies, audio, etc.)."
        },
        {
          question: "Pourquoi mon upload met du temps à apparaître ?",
          answer: "Après l'upload, Internet Archive traite les fichiers (crée des dérivés, miniatures, etc.). Cela peut prendre de quelques minutes à plusieurs heures selon la taille des fichiers et la charge du serveur."
        },
        {
          question: "Quels types de fichiers puis-je uploader ?",
          answer: "Vous pouvez uploader n'importe quel type de fichier. Types courants : ZIP, ISO, PDF, MP4, MP3, JPG, PNG, TXT, etc. Internet Archive les traitera automatiquement."
        },
        {
          question: "Comment télécharger des fichiers ?",
          answer: "Dans les détails de l'item, chaque fichier a un bouton de téléchargement qui ouvre le lien de téléchargement optimisé sur archive.org."
        }
      ]
    },

    // Common
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      file: 'Fichier',
      files: 'Fichiers'
    }
  }
};

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }
  
  return value;
};
