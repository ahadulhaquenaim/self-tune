# 🎯 Self Tune

> A native Linux desktop app to plan your day, track your work, and build weekly consistency.

![Platform](https://img.shields.io/badge/platform-Linux-blue?logo=linux)
![License](https://img.shields.io/badge/license-MIT-green)
![Electron](https://img.shields.io/badge/built%20with-Electron-47848f?logo=electron)
![React](https://img.shields.io/badge/UI-React%20%2B%20TypeScript-61dafb?logo=react)

---

## What is Self Tune?

Self Tune helps you stay consistent by giving you a simple daily ritual:

1. **Plan** — Set how you want to split your focus today (e.g. DSA 20%, Development 30%, System Design 40%, Running 10%)
2. **Log** — At the end of the day, record what you actually did
3. **Win** — Score ≥ 75%? You get a 🏆 **Victory** screen with confetti
4. **Review** — The **Weekly Report** shows your consistency, win rate, and streak across the whole week

Plus a **Backlog** — capture everything you want to do, then pull individual tasks into any day's plan when you're ready.

---

## Features

- 📅 **Daily Planner** — Set focus % targets per category. Must total 100%.
- ✅ **Daily Log** — Record actual time spent. Live score preview as you fill it in.
- 🏆 **Victory Screen** — Animated celebration when you hit ≥75% of your plan.
- 📊 **Weekly Report** — 7-day grid, win rate, current streak, category breakdown.
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
Exec=/home/$USER/Applications/Self Tune-1.0.0.AppImage
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
./release/Self\ Tune-1.0.0.AppImage
```

> The AppImage will be in `release/Self Tune-x.x.x.AppImage`

---

## How to Use

### 1. Set Your Categories

Go to **🏷️ Categories** → add your personal focus areas.

Default categories:
| Category | Default % |
|----------|-----------|
| 🧮 DSA | 20% |
| 💻 Development | 20% |
| 🏗️ System Design | 50% |
| 🏃 Running | 10% |

You can add anything: Reading, Leetcode, Language Learning, Gym, Writing — anything you want to track.

### 2. Build Your Backlog

Go to **📋 Backlog** → add tasks/topics you want to work on.

- Set a **category**, **priority**, and optional **notes**
- Items stay in the backlog until you're ready
- Click **"📅 Add to Today"** to schedule an item for today

### 3. Plan Your Day

Go to **📅 Today's Plan** → set your focus % for each category.

- Percentages must add up to **100%**
- Today's tasks from Backlog are shown below the allocation
- Save the plan — it's locked in for the day

### 4. Log Your Work

Go to **✅ Today's Log** → record what you actually did.

- Set actual % per category
- Check off completed tasks from your backlog
- Watch your **Achievement Score** update live
- Hit **Submit Log** — if score ≥ 75%, 🎉 Victory!

### 5. Review Your Week

Go to **📊 Weekly Report** → see your full week at a glance.

- 7-day grid showing victories and scores
- Consistency stats: win rate, current streak
- Category breakdown (average % per area)
- Detailed day-by-day view with notes

---

## Victory Score

```
Score = (sum of min(actual%, target%) for each category) / 100

Victory = Score ≥ 75%
```

**Example:**
| Category | Target | Actual | Credit |
|----------|--------|--------|--------|
| DSA | 20% | 15% | 15 |
| Development | 20% | 25% | 20 _(capped at target)_ |
| System Design | 50% | 48% | 48 |
| Running | 10% | 12% | 10 _(capped at target)_ |
| **Score** | | | **93/100 = 🏆 Victory!** |

Over-achieving in one area doesn't penalize you — it just doesn't give extra credit beyond the target.

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
- [ ] Custom victory threshold setting
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
