# IA Item Manager

A beautiful desktop application to manage your Internet Archive items and files with ease.

![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)

## ✨ Features

- 📤 **Upload Files** - Upload files to Internet Archive with progress tracking
- 📁 **Manage Items** - View and browse all your archived items
- 🔍 **Search** - Quickly find your files with powerful search
- 📝 **Edit Metadata** - Update item metadata (title, description, subject, creator, mediatype)
- ➕ **Add Files to Existing Items** - Easily add new files to your collections
- ⬇️ **Download** - Direct download links for all your files
- 🗑️ **Delete** - Remove files and items (keeps old versions in history)
- 🎨 **Modern UI** - Elegant dark mode interface
- 🌍 **Multi-language** - English and French support

## 📦 Download

Get the latest release from the [Releases](https://github.com/snowww62/ia-item-manager/releases) page.

**Portable version recommended** - Just download `IA-Item-Manager-Portable.exe` and run it. No installation required!

## 🚀 Quick Start

1. **Get your API keys** from [archive.org/account/s3.php](https://archive.org/account/s3.php)
2. **Launch the app** and go to Settings
3. **Enter your credentials** (Access Key & Secret Key)
4. **Enter your Internet Archive email** (for searching your items)
5. **Start managing your archives!**

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm

### Setup

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run package
```

Executable will be generated in the `release/` folder.

## 🔐 Security

- Your credentials are stored **locally** in your application
- No data is sent to third-party servers
- All communication is with official Internet Archive APIs via HTTPS

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Credits

- Built with [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/)
- Uses the [Internet Archive API](https://archive.org/developers/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made by Snow**
