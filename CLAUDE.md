# Self Tune — Claude Code Instructions

## 🔒 ALWAYS ACTIVE RULES
> These apply on EVERY prompt, automatically, no trigger needed.

- NEVER run `git push` or any command that affects the remote repository
- NEVER create, force-push, move, or delete remote tags
- NEVER create or close GitHub issues, PRs, or releases
- NEVER run `git tag` — developer decides versioning
- NEVER create or publish a GitHub Release
- Always tell the user what commands to run for any remote git operation — let the user run them

---

## 📋 ON-DEMAND CHECKLIST
> Only runs when user says: "run pre-release check" or "is this ready to release?"
> All checks are local only. No remote GitHub access.

### 1. Code Quality
- [ ] Run `npx tsc --noEmit` — zero TypeScript errors
- [ ] Run `npx eslint . --ext .ts,.tsx` — zero lint errors
- [ ] No `console.log()` debug statements left in code
- [ ] No commented-out dead code
- [ ] No hardcoded test data

### 2. Version Bump
- [ ] `package.json` version updated
- [ ] `npm install` run so `package-lock.json` is in sync
- [ ] Both files match the intended release version

### 3. Changelog / README
- [ ] New features documented
- [ ] Bug fixes documented
- [ ] Install instructions updated if anything changed
- [ ] Version and date added to changelog

### 4. Local Build & Test
- [ ] Run `rm -rf dist release` to clean old builds
- [ ] Run `npm install`
- [ ] Run `node node_modules/.bin/vite build`
- [ ] Run `node node_modules/.bin/electron-builder --linux`
- [ ] Confirm AppImage exists in `release/` folder
- [ ] AppImage is runnable locally

### 5. Local Git Status Check
- [ ] Run `git status` — show all uncommitted/untracked changes
- [ ] List all modified files for developer review
- [ ] Run `git diff` — show exactly what changed line by line

---

## ✅ RELEASE READINESS REPORT FORMAT
> Only produced after checklist is complete. Decision is always the developer's.

- TypeScript: ✅ / ❌
- Lint: ✅ / ❌
- Version in package.json: ✅ / ❌
- Build: ✅ AppImage exists in release/ / ❌
- Changelog: ✅ / ❌
- Uncommitted changes: ⚠️ X files modified (listed below)

### Modified Files:
- (list of files from git status)

### Decision is yours:
You are now ready to review and decide whether to release.

---

## Project Structure
- `src/` — React + TypeScript source code
- `dist/` — Vite build output (do not edit manually)
- `release/` — Packaged AppImage output (do not edit manually)
- `~/.config/self-tune/self-tune-data.json` — User data file

## Tech Stack
- Electron v31 — desktop shell
- React 18 + TypeScript — UI
- Vite 5 + vite-plugin-electron — bundler
- electron-builder — AppImage packaging
- Node.js fs — local JSON storage
- Pure CSS — styling

## Version Naming Convention (SemVer)
- Major (X.0.0) — breaking changes
- Minor (0.X.0) — new features
- Patch (0.0.X) — bug fixes