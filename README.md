# 🎯 Self Tune

> A native Linux desktop app to plan your day, complete tasks, and track weekly progress.

![Platform](https://img.shields.io/badge/platform-Linux-blue?logo=linux)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848f?logo=electron)
![React](https://img.shields.io/badge/UI-React%20%2B%20TypeScript-61dafb?logo=react)

---

## What is Self Tune?

Self Tune helps you stay consistent with a simple daily workflow:

1. **Plan** — Pull tasks from your Backlog into today's plan
2. **Do** — Work through your tasks and mark them done directly from the plan
3. **Review** — The **Weekly Report** shows how many tasks you completed per category across the week

Plus a **Backlog** — capture everything you want to do, then pull individual tasks into any day's plan when you're ready.

---

## Features

- 📅 **Daily Planner** — See your tasks for today. Mark them done with one click.
- 📊 **Weekly Report** — 7-day grid, tasks completed per day, category breakdown as % of total.
- 📋 **Backlog** — Add tasks with priority (High / Medium / Low), category, and notes. Pull them into today with one click.
- 🏷️ **Custom Categories** — Add, edit, remove categories with custom emoji and color.
- 💾 **Offline & Private** — All data stored locally on your machine. No account, no sync, no cloud.
- 🖥️ **Native Desktop** — Runs as a proper desktop app. No browser, no terminal needed.

---

## Download & Install (Linux)

### Option 1 — Download AppImage from Releases (Recommended)

1. Go to the [**Releases**](../../releases) page
2. Download the latest `Self Tune-x.x.x.AppImage`
3. Open a terminal and make it executable:
   ```bash
   chmod +x "Self Tune-*.AppImage"
   ```
4. Run it:
   ```bash
   ./"Self Tune-*.AppImage"
   ```

> **Ubuntu 22.04+ / Debian users:** AppImages require `libfuse2`. Install it once:
> ```bash
> sudo apt install libfuse2
> ```

### Option 2 — Create a Desktop Shortcut

After running the app once, you can pin it to your launcher. Or create a `.desktop` file:

```bash
# After downloading the AppImage to ~/Applications/
cat > ~/.local/share/applications/self-tune.desktop << EOF
[Desktop Entry]
Type=Application
Name=Self Tune
Exec=/home/$USER/Applications/Self Tune-1.0.2.AppImage
Icon=utilities-system-monitor
Terminal=false
Categories=Utility;
EOF

chmod +x ~/.local/share/applications/self-tune.desktop
```

---

## Build from Source

### Requirements

- Node.js 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- Linux (Ubuntu 22.04 or similar)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/your-username/self-tune.git
cd self-tune

# 2. Install dependencies
npm install

# 3. Build the app
node node_modules/.bin/vite build

# 4. Package as AppImage
node node_modules/.bin/electron-builder --linux

# 5. Run it
./release/Self\ Tune-1.0.2.AppImage
```

> The AppImage will be in `release/Self Tune-x.x.x.AppImage`

---

## How to Use

### 1. Set Your Categories

Go to **🏷️ Categories** → add your personal focus areas.

Default categories: 🧮 DSA, 💻 Development, 🏗️ System Design, 🏃 Running

You can add anything: Reading, Leetcode, Language Learning, Gym, Writing — anything you want to track.

### 2. Build Your Backlog

Go to **📋 Backlog** → add tasks/topics you want to work on.

- Set a **category**, **priority**, and optional **notes**
- Items stay in the backlog until you're ready
- Click **"📅 Add to Today"** to schedule an item for today

### 3. Plan Your Day

Go to **📅 Today's Plan** → see all tasks you've added for today.

- Tasks show with their category emoji and notes
- Click **✓ Done** to mark a task complete (also marks it done in Backlog)
- Click **✕** to remove a task from today's plan
- Counter shows how many tasks done vs total

### 4. Review Your Week

Go to **📊 Weekly Report** → see your full week at a glance.

- 7-day grid showing completed task count per day
- Stats: total tasks done, active days, average tasks/day
- Category breakdown — e.g. DSA 40%, Dev 40%, Running 20% based on tasks completed

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop shell | [Electron](https://www.electronjs.org/) v31 |
| UI | [React](https://react.dev/) 18 + TypeScript |
| Bundler | [Vite](https://vitejs.dev/) 5 + vite-plugin-electron |
| Packaging | [electron-builder](https://www.electron.build/) |
| Storage | Local JSON file via Node.js `fs` (no database) |
| Styling | Pure CSS with CSS custom properties |

---

## Data & Privacy

All your data is stored **locally** in:
```
~/.config/self-tune/self-tune-data.json
```

No telemetry. No accounts. No internet required. Your data never leaves your machine.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

### Ideas for contributions
- [ ] Windows / macOS support
- [ ] Data export (CSV / JSON)
- [ ] Notifications / reminders
- [ ] Dark mode toggle
- [ ] Charts for category trends over time

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ to help you stay consistent and grow every week.
</div>
