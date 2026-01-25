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
      spamErrorTitle: '🚨 SPAM DETECTION - ACCOUNT TEMPORARILY BLOCKED',
      spamErrorMessage: 'Your Internet Archive account is temporarily blocked for creating NEW items.\n\n✅ IMMEDIATE SOLUTION:\n1. Go to the "Items" tab\n2. Find an EXISTING item\n3. Click "Add Files" on that item\n4. Upload your files there (it works!)\n\n📧 TO UNBLOCK:\nContact info@archive.org and ask to remove the spam flag.\n\nMeanwhile, use ONLY existing items, not new items.',
      newItemWarningTitle: '⚠️ Creating a NEW item',
      newItemWarningText: 'If you get a "SlowDown" or "spam" error, your account is temporarily limited.',
      newItemWarningSolution: '💡 Solution: Upload to an EXISTING item via Items tab → Add Files',
      autoCollectionNote: 'ℹ️ Internet Archive will automatically assign your item to your account\'s collection. You can change the collection later via the web interface if needed.'
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
      selectFiles: 'Sélectionner fichiers',
      noFiles: 'Aucun fichier sélectionné',
      noFilesHelp: 'Cliquez sur "Sélectionner fichiers" pour choisir des fichiers',
      uploadButton: 'Uploader sur Internet Archive',
      uploading: 'Upload en cours...',
      uploadSuccess: 'Upload réussi',
      uploadFailed: 'Échec de l\'upload',
      spamErrorTitle: '🚨 SPAM DETECTION - ACCOUNT TEMPORAIREMENT BLOQUÉ',
      spamErrorMessage: 'Votre compte Internet Archive est temporairement bloqué pour la création de NOUVEAUX items.\n\n✅ SOLUTION IMMÉDIATE:\n1. Allez dans l\'onglet "Items"\n2. Trouvez un item EXISTANT\n3. Cliquez sur "Add Files" sur cet item\n4. Uploadez vos fichiers là-bas (ça fonctionne!)\n\n📧 POUR DÉBLOQUER:\nContactez info@archive.org et demandez à retirer le flag spam.\n\nEn attendant, utilisez UNIQUEMENT des items existants, pas de nouveaux items.',
      newItemWarningTitle: '⚠️ Création d\'un NOUVEL item',
      newItemWarningText: 'Si vous obtenez une erreur "SlowDown" ou "spam", votre compte est temporairement limité.',
      newItemWarningSolution: '💡 Solution: Uploadez sur un item EXISTANT via l\'onglet Items → Add Files',
      autoCollectionNote: 'ℹ️ Internet Archive assignera automatiquement votre item à la collection de votre compte. Vous pouvez changer la collection plus tard via l\'interface web si nécessaire.',
      lockedIdentifier: '🔒 Identifier verrouillé - Ajout de fichiers à un item existant',
      existingItemNote: 'ℹ️ Vous ajoutez des fichiers à un item existant. Les métadonnées de l\'item ne seront pas modifiées.'
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
        },
        {
          question: "J'ai une erreur '503 SlowDown' ou 'spam' lors de l'upload. Que faire ?",
          answer: "🚨 COMPTE TEMPORAIREMENT BLOQUÉ - Votre compte est limité pour créer de NOUVEAUX items (pas pour ajouter à des items existants). ✅ SOLUTION IMMÉDIATE : Allez dans 'Mes Items' → Cliquez sur un item existant → Bouton 'Add Files' → Uploadez là-bas (ça fonctionne!). 📧 POUR DÉBLOQUER : Attendez 24-48h sans créer de nouveaux items, puis contactez info@archive.org. En attendant, utilisez UNIQUEMENT des items existants."
        },
        {
          question: "Pourquoi je peux uploader sur le site web mais pas dans l'app ?",
          answer: "Sur le site web, vous ajoutez probablement des fichiers à des items EXISTANTS, ce qui est autorisé même si votre compte est limité. L'app fonctionne pareil : utilisez 'Mes Items' → Sélectionnez un item → 'Add Files' au lieu de créer un nouveau item."
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
      uploadFailed: 'Fallo al subir',
      spamErrorTitle: '🚨 DETECCIÓN DE SPAM - CUENTA TEMPORALMENTE BLOQUEADA',
      spamErrorMessage: 'Su cuenta de Internet Archive está temporalmente bloqueada para crear NUEVOS items.\n\n✅ SOLUCIÓN INMEDIATA:\n1. Vaya a la pestaña "Items"\n2. Encuentre un item EXISTENTE\n3. Haga clic en "Add Files" en ese item\n4. Suba sus archivos allí (¡funciona!)\n\n📧 PARA DESBLOQUEAR:\nContacte a info@archive.org y solicite eliminar la marca de spam.\n\nMientras tanto, use SOLO items existentes, no nuevos items.',
      newItemWarningTitle: '⚠️ Creando un NUEVO item',
      newItemWarningText: 'Si obtiene un error "SlowDown" o "spam", su cuenta está temporalmente limitada.',
      newItemWarningSolution: '💡 Solución: Suba a un item EXISTENTE vía Items → Add Files',
      autoCollectionNote: 'ℹ️ Internet Archive asignará automáticamente su item a la colección de su cuenta. Puede cambiar la colección más tarde a través de la interfaz web si es necesario.'
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

    // FAQ
    faq: {
      title: 'Preguntas Frecuentes',
      subtitle: 'Preguntas comunes sobre el uso de IA Item Manager',
      links: 'Enlaces Útiles',
      linkApiKeys: 'Obtener claves API',
      linkDocs: 'Documentación API Internet Archive',
      linkGeneralFaq: 'FAQ General de Internet Archive',
      madeBy: 'Hecho por Snow • Versión 1.0.0',
      questions: [
        {
          question: "¿Cómo obtengo mis claves API de Internet Archive?",
          answer: "Ve a https://archive.org/account/s3.php e inicia sesión con tu cuenta de Internet Archive. Encontrarás tu Access Key y Secret Key allí. Cópialas y pégalas en el panel de Ajustes."
        },
        {
          question: "¿Qué es un identificador?",
          answer: "Un identificador es un nombre único para tu item en Internet Archive. Debe estar en minúsculas, usar solo letras, números, guiones y guiones bajos. Ejemplo: mi-coleccion-retro-games"
        },
        {
          question: "¿Puedo subir varios archivos a la vez?",
          answer: "¡Sí! Haz clic en 'Seleccionar Archivos' y puedes elegir varios archivos para subir. Todos se subirán al mismo item."
        },
        {
          question: "¿Cómo agrego archivos a un item existente?",
          answer: "Ve a 'Mis Items', haz clic en el item al que quieres agregar archivos, luego haz clic en el botón '+ Add Files'. El identificador se bloqueará y tus nuevos archivos se agregarán a ese item."
        },
        {
          question: "¿Por qué no puedo ver mis items?",
          answer: "Asegúrate de haber ingresado tus claves API en Ajustes y tu email de Internet Archive en el campo 'IA Email'. La app busca items subidos por tu cuenta."
        },
        {
          question: "¿Puedo eliminar items?",
          answer: "Sí, pero Internet Archive mantiene algunos archivos del sistema (_meta.xml, etc.) que no se pueden eliminar. Tus archivos subidos serán eliminados. Para una eliminación completa, usa el sitio web de Internet Archive."
        },
        {
          question: "¿Qué son los campos de metadatos?",
          answer: "Los metadatos describen tu item: Title (nombre para mostrar), Description (contenido), Subject (etiquetas de búsqueda), Creator (autor) y Media Type (software, movies, audio, etc.)."
        },
        {
          question: "¿Por qué mi subida tarda en aparecer?",
          answer: "Después de subir, Internet Archive procesa los archivos (crea derivados, miniaturas, etc.). Esto puede tomar desde unos minutos hasta varias horas dependiendo del tamaño del archivo y la carga del servidor."
        },
        {
          question: "¿Qué tipos de archivos puedo subir?",
          answer: "Puedes subir cualquier tipo de archivo. Tipos comunes: ZIP, ISO, PDF, MP4, MP3, JPG, PNG, TXT, etc. Internet Archive los procesará automáticamente."
        },
        {
          question: "¿Cómo descargo archivos?",
          answer: "En los detalles del item, cada archivo tiene un botón de descarga que abre el enlace de descarga optimizado en archive.org."
        },
        {
          question: "Recibo un error '503 SlowDown' o 'spam' al subir. ¿Qué debo hacer?",
          answer: "🚨 CUENTA TEMPORALMENTE BLOQUEADA - Su cuenta está limitada para crear NUEVOS items (no para agregar a items existentes). ✅ SOLUCIÓN INMEDIATA: Vaya a 'Mis Items' → Haga clic en un item existente → Botón 'Add Files' → Suba allí (¡funciona!). 📧 PARA DESBLOQUEAR: Espere 24-48h sin crear nuevos items, luego contacte info@archive.org. Mientras tanto, use SOLO items existentes."
        },
        {
          question: "¿Por qué puedo subir en el sitio web pero no en la app?",
          answer: "En el sitio web, probablemente está agregando archivos a items EXISTENTES, lo cual está permitido incluso si su cuenta está limitada. La app funciona igual: use 'Mis Items' → Seleccione un item → 'Add Files' en lugar de crear un nuevo item."
        }
      ]
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
      uploadFailed: 'Hochladen fehlgeschlagen',
      spamErrorTitle: '🚨 SPAM-ERKENNUNG - KONTO TEMPORÄR GESPERRT',
      spamErrorMessage: 'Ihr Internet Archive-Konto ist vorübergehend für das Erstellen NEUER Elemente gesperrt.\n\n✅ SOFORTIGE LÖSUNG:\n1. Gehen Sie zur Registerkarte "Items"\n2. Finden Sie ein VORHANDENES Element\n3. Klicken Sie auf "Add Files" bei diesem Element\n4. Laden Sie Ihre Dateien dort hoch (es funktioniert!)\n\n📧 ZUM ENTSPERREN:\nKontaktieren Sie info@archive.org und bitten Sie, die Spam-Markierung zu entfernen.\n\nVerwenden Sie in der Zwischenzeit NUR vorhandene Elemente, keine neuen Elemente.',
      newItemWarningTitle: '⚠️ Erstellen eines NEUEN Elements',
      newItemWarningText: 'Wenn Sie einen "SlowDown"- oder "Spam"-Fehler erhalten, ist Ihr Konto vorübergehend eingeschränkt.',
      newItemWarningSolution: '💡 Lösung: Laden Sie zu einem VORHANDENEN Element über Items → Add Files hoch',
      autoCollectionNote: 'ℹ️ Internet Archive wird Ihr Element automatisch der Sammlung Ihres Kontos zuweisen. Sie können die Sammlung später bei Bedarf über die Weboberfläche ändern.'
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

    // FAQ
    faq: {
      title: 'Häufig Gestellte Fragen',
      subtitle: 'Häufige Fragen zur Verwendung von IA Item Manager',
      links: 'Nützliche Links',
      linkApiKeys: 'API-Schlüssel erhalten',
      linkDocs: 'Internet Archive API-Dokumentation',
      linkGeneralFaq: 'Internet Archive Allgemeine FAQ',
      madeBy: 'Erstellt von Snow • Version 1.0.0',
      questions: [
        {
          question: "Wie erhalte ich meine Internet Archive API-Schlüssel?",
          answer: "Gehen Sie zu https://archive.org/account/s3.php und melden Sie sich mit Ihrem Internet Archive-Konto an. Dort finden Sie Ihren Access Key und Secret Key. Kopieren Sie sie und fügen Sie sie in das Einstellungsfenster ein."
        },
        {
          question: "Was ist eine Kennung?",
          answer: "Eine Kennung ist ein eindeutiger Name für Ihr Element auf Internet Archive. Sie muss in Kleinbuchstaben sein und darf nur Buchstaben, Zahlen, Bindestriche und Unterstriche verwenden. Beispiel: meine-retro-games-sammlung"
        },
        {
          question: "Kann ich mehrere Dateien gleichzeitig hochladen?",
          answer: "Ja! Klicken Sie auf 'Dateien auswählen' und Sie können mehrere Dateien zum Hochladen auswählen. Sie werden alle zum selben Element hochgeladen."
        },
        {
          question: "Wie füge ich Dateien zu einem vorhandenen Element hinzu?",
          answer: "Gehen Sie zu 'Meine Elemente', klicken Sie auf das Element, zu dem Sie Dateien hinzufügen möchten, und klicken Sie dann auf die Schaltfläche '+ Add Files'. Die Kennung wird gesperrt und Ihre neuen Dateien werden zu diesem Element hinzugefügt."
        },
        {
          question: "Warum kann ich meine Elemente nicht sehen?",
          answer: "Stellen Sie sicher, dass Sie Ihre API-Schlüssel in den Einstellungen eingegeben haben und Ihre Internet Archive-E-Mail im Feld 'IA Email'. Die App sucht nach Elementen, die von Ihrem Konto hochgeladen wurden."
        },
        {
          question: "Kann ich Elemente löschen?",
          answer: "Ja, aber Internet Archive behält einige Systemdateien (_meta.xml usw.), die nicht gelöscht werden können. Ihre hochgeladenen Dateien werden entfernt. Für eine vollständige Löschung verwenden Sie die Internet Archive-Website."
        },
        {
          question: "Was sind Metadatenfelder?",
          answer: "Metadaten beschreiben Ihr Element: Title (Anzeigename), Description (Inhalt), Subject (Suchtags), Creator (Autor) und Media Type (software, movies, audio usw.)."
        },
        {
          question: "Warum dauert es, bis mein Upload angezeigt wird?",
          answer: "Nach dem Hochladen verarbeitet Internet Archive die Dateien (erstellt Derivate, Miniaturansichten usw.). Dies kann je nach Dateigröße und Serverlast einige Minuten bis mehrere Stunden dauern."
        },
        {
          question: "Welche Dateitypen kann ich hochladen?",
          answer: "Sie können jeden Dateityp hochladen. Gängige Typen: ZIP, ISO, PDF, MP4, MP3, JPG, PNG, TXT usw. Internet Archive verarbeitet sie automatisch."
        },
        {
          question: "Wie lade ich Dateien herunter?",
          answer: "In den Elementdetails hat jede Datei eine Download-Schaltfläche, die den optimierten Download-Link auf archive.org öffnet."
        },
        {
          question: "Ich erhalte einen '503 SlowDown'- oder 'Spam'-Fehler beim Hochladen. Was soll ich tun?",
          answer: "🚨 KONTO TEMPORÄR GESPERRT - Ihr Konto ist für das Erstellen NEUER Elemente eingeschränkt (nicht für das Hinzufügen zu vorhandenen Elementen). ✅ SOFORTIGE LÖSUNG: Gehen Sie zu 'Meine Elemente' → Klicken Sie auf ein vorhandenes Element → 'Add Files'-Schaltfläche → Laden Sie dort hoch (es funktioniert!). 📧 ZUM ENTSPERREN: Warten Sie 24-48h ohne neue Elemente zu erstellen, kontaktieren Sie dann info@archive.org. Verwenden Sie in der Zwischenzeit NUR vorhandene Elemente."
        },
        {
          question: "Warum kann ich auf der Website hochladen, aber nicht in der App?",
          answer: "Auf der Website fügen Sie wahrscheinlich Dateien zu VORHANDENEN Elementen hinzu, was erlaubt ist, auch wenn Ihr Konto eingeschränkt ist. Die App funktioniert genauso: Verwenden Sie 'Meine Elemente' → Wählen Sie ein Element → 'Add Files' anstatt ein neues Element zu erstellen."
        }
      ]
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
