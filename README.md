# RetroVault Archive Manager

A modern desktop app to **manage your Internet Archive items** and **bulk‑upload files** to them.

![Windows](https://img.shields.io/badge/Windows-0078D6?style=flat-square&logo=windows&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)

## ✨ What it does

- **Item browser** — thumbnails, sort (date / title / views), media‑type filter, grid or list view, pagination, multi‑select.
- **Bulk upload** — drag & drop, per‑file progress and speed, retry failed, optional destination folders (`roms/snes/…`), toggle derivation.
- **Item details** — overview / files / metadata / raw tabs, per‑file source badges, copy download links, whole‑item ZIP download.
- **archive.org integration** — connection test (shows your screen name), processing/task status, one‑click re‑derivation, full metadata editor (title, description, subject, creator, date, license, language, media type).
- **New item** — create an item straight from the app (advanced, gated behind a spam‑risk warning).
- **Update check** — checks this repo's latest release on launch and points you to the download if there's a newer one.
- **Polish** — dark modern UI, in‑app toasts and confirm dialogs (no more browser `alert()`), collapsible sidebar, keyboard shortcuts (`Ctrl/⌘ + 1–6`, `Ctrl/⌘ + K`).
- **4 languages** — English, Français, Español, Deutsch.

## 🔐 Security

- API keys are encrypted at rest with your OS keychain (Electron `safeStorage`).
- Nothing is sent anywhere except the official Internet Archive HTTPS APIs.
- External links open in your real browser, never inside the app.

## 🚀 Quick start

1. Create your first item on [archive.org/upload](https://archive.org/upload/) (one‑time — or use the in‑app **New item** panel).
2. Get your keys at [archive.org/account/s3.php](https://archive.org/account/s3.php).
3. Launch RetroVault Archive Manager → **Settings** → paste your Access Key & Secret Key, add your IA email, hit **Test connection**.
4. **My items** → pick an item → **Add files** → drop files → upload.

## 🛠️ Development

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
npm run package
```

Executables land in `build_output/` (`RetroVault-Archive-Manager-Portable.exe` and the installer).

## 📄 License

MIT — see [LICENSE](LICENSE).

---

**Made by Snow** · Built with Electron, React, Vite, Tailwind CSS and [Lucide](https://lucide.dev/) icons.
