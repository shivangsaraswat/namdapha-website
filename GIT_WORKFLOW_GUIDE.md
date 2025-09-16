# Git Workflow Guide - Namdapha Website Project

## 🌿 Branch Structure

### Component-Level Branches
- `feature/api-server` - Express.js API server
- `feature/admin-dashboard` - Admin panel (Next.js)
- `feature/deployment` - Deployment configs & scripts
- `feature/shared` - Shared utilities & types

### Page-Based Branches (Frontend)
- `feature/frontend-home` - Home page (`/app/home/`, `/app/page.tsx`)
- `feature/frontend-about` - About page (`/app/about/`)
- `feature/frontend-council` - Council page (`/app/council/`)
- `feature/frontend-events` - Events page (`/app/events/`)
- `feature/frontend-teams` - Teams page (`/app/teams/`)
- `feature/frontend-resources` - Resources page (`/app/resources/`)
- `feature/frontend-whatsapp` - WhatsApp integration (`/app/whatsapp/`)

### Feature-Based Branches (Frontend)
- `feature/frontend-components` - Shared components (`/components/`)
- `feature/frontend-layout` - Layout & globals (`/app/layout.tsx`, `/app/globals.css`)
- `feature/frontend-lib` - Utils & data (`/lib/`)
- `feature/frontend-assets` - Static assets (`/public/`)
- `feature/frontend-config` - Config files (Next.js, ESLint, etc.)

---

## 🧑💻 Developer Workflow

### 1. Initial Setup
```bash
# Clone repository
git clone https://github.com/shivangsaraswat/namdapha-website.git
cd namdapha-website

# Switch to specific feature branch
git checkout feature/frontend-council
```

### 2. Development Process
```bash
# Make sure you're on the right branch
git branch

# Pull latest changes
git pull origin feature/frontend-council

# Make your changes to files
# Edit: frontend/app/council/page.tsx

# Check what files changed
git status

# Add changes
git add .
# Or add specific files
git add frontend/app/council/page.tsx

# Commit with descriptive message
git commit -m "Add council member filtering and search functionality"

# Push to remote branch
git push origin feature/frontend-council
```

### 3. Create Pull Request
- GitHub will show: "Create a pull request for 'feature/frontend-council'"
- Click the link or go to GitHub → Pull Requests → New Pull Request
- Add description of changes
- Submit PR

---

## 👨💼 Admin Review Workflow

### 1. Check for New PRs
```bash
# Fetch all latest changes
git fetch --all

# See all remote branches
git branch -r

# Check GitHub for new Pull Requests
```

### 2. Review PR Online (GitHub)
- Go to GitHub → Pull Requests tab
- Click on the PR to review
- Check "Files changed" tab to see modifications
- Review code line by line

### 3. Review Changes Locally (Optional)
```bash
# Switch to the feature branch
git checkout feature/frontend-council

# Pull latest changes from developer
git pull origin feature/frontend-council

# See commit history
git log --oneline -10

# See what files changed compared to main
git diff main..feature/frontend-council --name-only

# See detailed changes
git diff main..feature/frontend-council

# See changes in specific file
git diff main..feature/frontend-council -- frontend/app/council/page.tsx
```

### 4. Test Changes Locally
```bash
# Test frontend changes
cd frontend
npm install
npm run dev
# Visit localhost:3000/council to test

# Test API changes
cd backend/api
npm install
npm run dev

# Test admin dashboard
cd backend/admin-dashboard
yarn install
yarn dev
```

### 5. Approve or Request Changes

#### If Code is Good:
```bash
# On GitHub PR page:
1. Click "Review changes"
2. Select "Approve"
3. Add optional comment
4. Click "Submit review"
5. Click "Merge pull request"
6. Click "Confirm merge"
```

#### If Code Needs Changes:
```bash
# On GitHub PR page:
1. Click "Review changes"
2. Select "Request changes"
3. Add comments on specific lines
4. Click "Submit review"
# Developer will fix and push again
```

---

## 🔄 Common Git Commands

### Branch Management
```bash
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature/frontend-council

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Checking Changes
```bash
# See current status
git status

# See commit history
git log --oneline -10

# See changes in working directory
git diff

# See changes between branches
git diff main..feature/frontend-council

# See changes in specific file
git diff HEAD~1 frontend/app/council/page.tsx
```

### Syncing with Remote
```bash
# Fetch all changes without merging
git fetch --all

# Pull changes from specific branch
git pull origin main
git pull origin feature/frontend-council

# Push changes to remote
git push origin feature/frontend-council

# Push all branches
git push --all origin
```

### Merging
```bash
# Merge feature branch to main (locally)
git checkout main
git merge feature/frontend-council
git push origin main

# Merge main into feature branch (to update)
git checkout feature/frontend-council
git merge main
git push origin feature/frontend-council
```

---

## 🚨 Emergency Commands

### Undo Changes
```bash
# Undo uncommitted changes
git checkout -- filename.txt
git reset --hard HEAD

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (safe for shared repos)
git revert <commit-hash>
```

### Fix Merge Conflicts
```bash
# When merge conflict occurs:
1. Open conflicted files
2. Look for <<<<<<< ======= >>>>>>> markers
3. Edit to resolve conflicts
4. Remove conflict markers
5. git add <resolved-files>
6. git commit -m "Resolve merge conflict"
```

---

## 📋 Best Practices

### Commit Messages
```bash
# Good commit messages:
git commit -m "Add council member search functionality"
git commit -m "Fix responsive layout on events page"
git commit -m "Update API endpoint for team data"

# Bad commit messages:
git commit -m "fix"
git commit -m "changes"
git commit -m "update"
```

### Branch Naming
```bash
# Good branch names:
feature/frontend-council
feature/api-authentication
bugfix/navbar-mobile-menu
hotfix/security-vulnerability

# Bad branch names:
fix
update
new-feature
```

### Before Pushing
```bash
# Always check before pushing:
git status
git diff
git log --oneline -3

# Test your changes:
npm run dev
npm run build
npm run test
```

---

## 🎯 Quick Reference

### Daily Developer Commands
```bash
git status
git pull origin <branch-name>
git add .
git commit -m "descriptive message"
git push origin <branch-name>
```

### Daily Admin Commands
```bash
git fetch --all
git checkout <feature-branch>
git pull origin <feature-branch>
git diff main..<feature-branch>
# Review on GitHub → Merge PR
```

### Project Setup Commands
```bash
# Frontend
cd frontend && npm install && npm run dev

# API Server
cd backend/api && npm install && npm run dev

# Admin Dashboard
cd backend/admin-dashboard && yarn install && yarn dev
```

---

## 📞 Support

- **GitHub Repository**: https://github.com/shivangsaraswat/namdapha-website
- **Issues**: Create GitHub issues for bugs/features
- **Documentation**: See individual README files in each folder

---

*Last Updated: December 2024*