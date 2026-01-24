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
      uploadFailed: 'Upload failed'
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
      selectFiles: 'Sélectionner fichiers',
      noFiles: 'Aucun fichier sélectionné',
      noFilesHelp: 'Cliquez sur "Sélectionner fichiers" pour choisir des fichiers',
      uploadButton: 'Uploader sur Internet Archive',
      uploading: 'Upload en cours...',
      uploadSuccess: 'Upload réussi',
      uploadFailed: 'Échec de l\'upload'
    },

    // Items Panel
    items: {
      title: 'Mes Items',
      subtitle: 'Parcourez et gérez vos items Internet Archive',
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
      deleteItem: 'Supprimer l\'Item Entier',
      deleteItemConfirm: 'Êtes-vous sûr de vouloir supprimer cet item entier et tous ses fichiers ? Cette action est irréversible !',
      deleteItemSuccess: 'Item supprimé avec succès',
      deleteItemFailed: 'Échec de la suppression de l\'item',
      deleting: 'Suppression...'
    },

    // Settings Panel
    settings: {
      title: 'Paramètres',
      subtitle: 'Configurez vos identifiants Internet Archive',
      howToGetKeys: 'Comment obtenir vos identifiants API',
      step1: 'Connectez-vous à votre compte Internet Archive',
      step2: 'Allez dans les paramètres de votre compte',
      step3: 'Trouvez la section "Clés API S3"',
      step4: 'Copiez votre Access Key et Secret Key',
      goToKeys: 'Aller à la page des clés API',
      userProfile: 'Profil Utilisateur',
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
      autoRefreshHelp: 'Actualise automatiquement à l\'ouverture de Mes Items',
      saveSettings: 'Sauvegarder les Paramètres',
      settingsSaved: 'Paramètres Sauvegardés !',
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
      linkDocs: 'Documentation API Internet Archive',
      linkGeneralFaq: 'FAQ Générale Internet Archive',
      madeBy: 'Créé par Snow • Version 1.0.0',
      questions: [
        {
          question: "Comment obtenir mes clés API Internet Archive ?",
          answer: "Allez sur https://archive.org/account/s3.php et connectez-vous avec votre compte Internet Archive. Vous trouverez votre Access Key et Secret Key. Copiez-les et collez-les dans le panneau Paramètres."
        },
        {
          question: "Qu'est-ce qu'un identifiant ?",
          answer: "Un identifiant est un nom unique pour votre item sur Internet Archive. Il doit être en minuscules, utiliser uniquement des lettres, chiffres, tirets et underscores. Exemple: ma-collection-retro-games"
        },
        {
          question: "Puis-je uploader plusieurs fichiers à la fois ?",
          answer: "Oui ! Cliquez sur 'Sélectionner Fichiers' et vous pouvez choisir plusieurs fichiers à uploader. Ils seront tous uploadés dans le même item."
        },
        {
          question: "Comment ajouter des fichiers à un item existant ?",
          answer: "Allez dans 'Mes Items', cliquez sur l'item auquel vous voulez ajouter des fichiers, puis cliquez sur le bouton '+ Add Files'. L'identifiant sera verrouillé et vos nouveaux fichiers seront ajoutés à cet item."
        },
        {
          question: "Pourquoi je ne vois pas mes items ?",
          answer: "Assurez-vous d'avoir entré vos clés API dans Paramètres et votre email Internet Archive dans le champ 'IA Email'. L'app recherche les items uploadés par votre compte."
        },
        {
          question: "Puis-je supprimer des items ?",
          answer: "Oui, mais Internet Archive conserve certains fichiers système (_meta.xml, etc.) qui ne peuvent pas être supprimés. Vos fichiers uploadés seront supprimés. Pour une suppression complète, utilisez le site Internet Archive."
        },
        {
          question: "Que sont les champs de métadonnées ?",
          answer: "Les métadonnées décrivent votre item : Title (nom d'affichage), Description (contenu), Subject (tags de recherche), Creator (auteur), et Media Type (software, movies, audio, etc.)."
        },
        {
          question: "Pourquoi mon upload prend du temps à apparaître ?",
          answer: "Après l'upload, Internet Archive traite les fichiers (crée des dérivés, miniatures, etc.). Cela peut prendre de quelques minutes à plusieurs heures selon la taille et la charge serveur."
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
      save: 'Sauvegarder',
      cancel: 'Annuler',
      close: 'Fermer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      file: 'Fichier',
      files: 'Fichiers'
    }
  },

  es: {
    // Sidebar
    sidebar: {
      title: 'IA Item Manager',
      subtitle: 'by Snow',
      myItems: 'Mis Items',
      upload: 'Subir',
      faq: 'FAQ',
      settings: 'Ajustes',
      version: 'Versión'
    },

    // Upload Panel
    upload: {
      title: 'Subir archivos a Internet Archive',
      subtitle: 'Sube tus archivos para preservarlos para siempre',
      itemInfo: 'Información del Item',
      identifier: 'Identificador (requerido)',
      identifierPlaceholder: 'mi-identificador-unico',
      identifierHelp: 'Debe ser único. Use solo minúsculas, números, guiones y guiones bajos.',
      title: 'Título',
      titlePlaceholder: 'Un título descriptivo para tu item',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe tu item...',
      filesToUpload: 'Archivos para subir',
      selectFiles: 'Seleccionar archivos',
      noFiles: 'Ningún archivo seleccionado',
      noFilesHelp: 'Haga clic en "Seleccionar archivos" para elegir archivos',
      uploadButton: 'Subir a Internet Archive',
      uploading: 'Subiendo...',
      uploadSuccess: 'Subido exitosamente',
      uploadFailed: 'Fallo al subir'
    },

    // Items Panel
    items: {
      title: 'Mis Items',
      subtitle: 'Explorar y gestionar tus items de Internet Archive',
      refresh: 'Actualizar',
      search: 'Buscar tus items...',
      searchButton: 'Buscar',
      noItems: 'No se encontraron items',
      noItemsHelp: 'Sube tu primer item o ajusta tu búsqueda',
      views: 'vistas',
      published: 'Publicado',
      credentialsError: 'Por favor configure sus credenciales en Ajustes primero'
    },

    // Item Details
    details: {
      back: 'Volver a Items',
      viewOnArchive: 'Ver en Archive.org',
      published: 'Publicado',
      views: 'Vistas',
      mediaType: 'Tipo de medio',
      description: 'Descripción',
      files: 'Archivos',
      noFiles: 'No se encontraron archivos',
      download: 'Descargar',
      delete: 'Eliminar',
      deleteConfirm: '¿Está seguro de que desea eliminar',
      deleteSuccess: 'Archivo eliminado exitosamente',
      deleteFailed: 'Error al eliminar archivo',
      deleteItem: 'Eliminar Item Completo',
      deleteItemConfirm: '¿Está seguro de que desea eliminar este item completo y todos sus archivos? ¡Esta acción no se puede deshacer!',
      deleteItemSuccess: 'Item eliminado exitosamente',
      deleteItemFailed: 'Error al eliminar item',
      deleting: 'Eliminando...'
    },

    // Settings Panel
    settings: {
      title: 'Ajustes',
      subtitle: 'Configure sus credenciales de Internet Archive',
      howToGetKeys: 'Cómo obtener sus credenciales API',
      step1: 'Inicie sesión en su cuenta de Internet Archive',
      step2: 'Vaya a la configuración de su cuenta',
      step3: 'Encuentre la sección "Claves API S3"',
      step4: 'Copie su Access Key y Secret Key',
      goToKeys: 'Ir a la página de claves API',
      userProfile: 'Perfil de Usuario',
      displayName: 'Nombre para mostrar (opcional)',
      displayNamePlaceholder: 'Su nombre',
      displayNameHelp: 'Esto es solo para su uso personal en la app',
      apiCredentials: 'Credenciales API de Internet Archive',
      accessKey: 'Clave de acceso',
      accessKeyPlaceholder: 'Ingrese su clave de acceso',
      secretKey: 'Clave secreta',
      secretKeyPlaceholder: 'Ingrese su clave secreta',
      languagePrefs: 'Idioma y Preferencias',
      language: 'Idioma',
      languageHelp: 'Idioma de la interfaz',
      autoRefresh: 'Actualización automática',
      autoRefreshHelp: 'Actualizar automáticamente al abrir Mis Items',
      saveSettings: 'Guardar Ajustes',
      settingsSaved: '¡Ajustes Guardados!',
      about: 'Acerca de IA Item Manager',
      version: 'Versión',
      author: 'Autor',
      authorText: 'Hecho con ❤️ para usuarios de Internet Archive',
      description: 'Descripción',
      descriptionText: 'Una hermosa aplicación de escritorio para gestionar tus archivos de Internet Archive',
      privacy: 'Privacidad',
      privacyText: 'Sus credenciales se almacenan localmente en su computadora y nunca se envían a servidores de terceros excepto la API oficial de Internet Archive.',
      portable: 'Portable',
      portableText: '¡Puedes compartir esta app con otros! Cada usuario tendrá su propia configuración y credenciales.'
    },

    // Common
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      file: 'Archivo',
      files: 'Archivos'
    }
  },

  de: {
    // Sidebar
    sidebar: {
      title: 'IA Item Manager',
      subtitle: 'by Snow',
      myItems: 'Meine Elemente',
      upload: 'Hochladen',
      faq: 'FAQ',
      settings: 'Einstellungen',
      version: 'Version'
    },

    // Upload Panel
    upload: {
      title: 'Dateien auf Internet Archive hochladen',
      subtitle: 'Laden Sie Ihre Dateien hoch, um sie für immer zu bewahren',
      itemInfo: 'Element-Informationen',
      identifier: 'Kennung (erforderlich)',
      identifierPlaceholder: 'meine-eindeutige-kennung',
      identifierHelp: 'Muss eindeutig sein. Verwenden Sie nur Kleinbuchstaben, Zahlen, Bindestriche und Unterstriche.',
      title: 'Titel',
      titlePlaceholder: 'Ein beschreibender Titel für Ihr Element',
      description: 'Beschreibung',
      descriptionPlaceholder: 'Beschreiben Sie Ihr Element...',
      filesToUpload: 'Hochzuladende Dateien',
      selectFiles: 'Dateien auswählen',
      noFiles: 'Keine Dateien ausgewählt',
      noFilesHelp: 'Klicken Sie auf "Dateien auswählen", um Dateien auszuwählen',
      uploadButton: 'Auf Internet Archive hochladen',
      uploading: 'Hochladen...',
      uploadSuccess: 'Erfolgreich hochgeladen',
      uploadFailed: 'Hochladen fehlgeschlagen'
    },

    // Items Panel
    items: {
      title: 'Meine Elemente',
      subtitle: 'Durchsuchen und verwalten Sie Ihre Internet Archive-Elemente',
      refresh: 'Aktualisieren',
      search: 'Ihre Elemente durchsuchen...',
      searchButton: 'Suchen',
      noItems: 'Keine Elemente gefunden',
      noItemsHelp: 'Laden Sie Ihr erstes Element hoch oder passen Sie Ihre Suche an',
      views: 'Aufrufe',
      published: 'Veröffentlicht',
      credentialsError: 'Bitte konfigurieren Sie zuerst Ihre Anmeldeinformationen in den Einstellungen'
    },

    // Item Details
    details: {
      back: 'Zurück zu Elementen',
      viewOnArchive: 'Auf Archive.org anzeigen',
      published: 'Veröffentlicht',
      views: 'Aufrufe',
      mediaType: 'Medientyp',
      description: 'Beschreibung',
      files: 'Dateien',
      noFiles: 'Keine Dateien gefunden',
      download: 'Herunterladen',
      delete: 'Löschen',
      deleteConfirm: 'Sind Sie sicher, dass Sie löschen möchten',
      deleteSuccess: 'Datei erfolgreich gelöscht',
      deleteFailed: 'Fehler beim Löschen der Datei',
      deleteItem: 'Gesamtes Element Löschen',
      deleteItemConfirm: 'Sind Sie sicher, dass Sie dieses gesamte Element und alle seine Dateien löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!',
      deleteItemSuccess: 'Element erfolgreich gelöscht',
      deleteItemFailed: 'Fehler beim Löschen des Elements',
      deleting: 'Löschen...'
    },

    // Settings Panel
    settings: {
      title: 'Einstellungen',
      subtitle: 'Konfigurieren Sie Ihre Internet Archive-Anmeldeinformationen',
      howToGetKeys: 'So erhalten Sie Ihre API-Anmeldeinformationen',
      step1: 'Melden Sie sich bei Ihrem Internet Archive-Konto an',
      step2: 'Gehen Sie zu Ihren Kontoeinstellungen',
      step3: 'Finden Sie den Abschnitt "S3 API-Schlüssel"',
      step4: 'Kopieren Sie Ihren Zugriffsschlüssel und geheimen Schlüssel',
      goToKeys: 'Zur API-Schlüsselseite gehen',
      userProfile: 'Benutzerprofil',
      displayName: 'Anzeigename (optional)',
      displayNamePlaceholder: 'Ihr Name',
      displayNameHelp: 'Dies ist nur für Ihre persönliche Nutzung in der App',
      apiCredentials: 'Internet Archive API-Anmeldeinformationen',
      accessKey: 'Zugriffsschlüssel',
      accessKeyPlaceholder: 'Geben Sie Ihren Zugriffsschlüssel ein',
      secretKey: 'Geheimer Schlüssel',
      secretKeyPlaceholder: 'Geben Sie Ihren geheimen Schlüssel ein',
      languagePrefs: 'Sprache & Einstellungen',
      language: 'Sprache',
      languageHelp: 'Sprache der Benutzeroberfläche',
      autoRefresh: 'Automatische Aktualisierung',
      autoRefreshHelp: 'Automatisch aktualisieren beim Öffnen von Meine Elemente',
      saveSettings: 'Einstellungen speichern',
      settingsSaved: 'Einstellungen gespeichert!',
      about: 'Über IA Item Manager',
      version: 'Version',
      author: 'Autor',
      authorText: 'Mit ❤️ für Internet Archive-Benutzer gemacht',
      description: 'Beschreibung',
      descriptionText: 'Eine schöne Desktop-Anwendung zur Verwaltung Ihrer Internet Archive-Dateien',
      privacy: 'Datenschutz',
      privacyText: 'Ihre Anmeldeinformationen werden lokal auf Ihrem Computer gespeichert und niemals an Drittserver gesendet, außer an die offizielle Internet Archive API.',
      portable: 'Portabel',
      portableText: 'Sie können diese App mit anderen teilen! Jeder Benutzer hat seine eigenen Einstellungen und Anmeldeinformationen.'
    },

    // Common
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schließen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      file: 'Datei',
      files: 'Dateien'
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
