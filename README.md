# IA Item Manager

A beautiful desktop application to **manage and bulk upload files** to your existing Internet Archive items with ease.

![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)

## ✨ Features

- 📤 **Bulk Upload** - Upload multiple files to existing items with progress tracking
- 📁 **Folder Organization** - Create folder structures within items (e.g., `roms/intellivision/game.zip`)
- 🔍 **Item Browser** - View and search all your archived items
- ➕ **Add Files to Items** - Easily add hundreds of files to your collections at once
- 📝 **Edit Metadata** - Update item metadata (title, description, subject, creator, mediatype)
- ⬇️ **Download** - Direct download links for all your files
- 🗑️ **Delete** - Remove files and items (keeps old versions in history)
- 🎨 **Modern UI** - Elegant dark mode interface
- 🌍 **Multi-language** - English, French, Spanish, and German support

## 🎯 What This App Is For

**IA Item Manager** is designed for **bulk file management** on existing Internet Archive items:
- ✅ Upload **hundreds of files** to an existing item in one go
- ✅ Organize files in **folders** within items
- ✅ Manage and edit your **existing items**
- ✅ **Safe from spam detection** - no new item creation

**Note:** To create your **first item**, use the [Internet Archive website](https://archive.org/upload/). After that, use this app to manage and upload files to it!

## 📦 Download

Get the latest release from the [Releases](https://github.com/snowww62/ia-item-manager/releases) page.

**Portable version recommended** - Just download `IA-Item-Manager-Portable.exe` and run it. No installation required!

## 🚀 Quick Start

1. **Create your first item** on [archive.org/upload](https://archive.org/upload/) (one-time only)
2. **Get your API keys** from [archive.org/account/s3.php](https://archive.org/account/s3.php)
3. **Launch the app** and go to Settings
4. **Enter your credentials** (Access Key & Secret Key)
5. **Enter your Internet Archive email** (for searching your items)
6. **Go to "My Items"** tab → Select an item → Click **"Add Files"**
7. **Upload in bulk!** Add hundreds of files to your item

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

Executable will be generated in the `build_output/` folder.

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
