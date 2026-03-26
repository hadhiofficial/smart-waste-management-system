# Quick Reference: Essential Commands

## 🚀 Running the Project

### Development
```bash
# Navigate to project
cd front-end

# Install dependencies (run once)
npm install

# Start development server
npm run dev

# The app will be accessible at:
# http://localhost:5173
```

### Production
```bash
# Build optimized version
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel
npm install -g vercel
vercel
```

---

## 🔧 Setup Commands

### First Time Setup
```bash
# 1. Navigate to project
cd front-end

# 2. Create .env file from template
cp .env.example .env

# 3. Edit .env with your Supabase credentials
# On Windows: notepad .env
# On Mac/Linux: nano .env

# 4. Install dependencies
npm install

# 5. Start dev server
npm run dev
```

### Supabase Setup (One Time)
```sql
-- Example SQL to run in Supabase console

-- Create a table
CREATE TABLE your_table_name (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for SELECT
CREATE POLICY "Users can view own data" ON your_table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy for INSERT
CREATE POLICY "Users can insert own data" ON your_table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy for UPDATE
CREATE POLICY "Users can update own data" ON your_table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy for DELETE
CREATE POLICY "Users can delete own data" ON your_table_name
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 📦 Dependency Management

### Add New Package
```bash
npm install package-name

# Examples:
npm install axios              # HTTP client
npm install lodash             # Utility library
npm install date-fns           # Date utilities
```

### Update Dependencies
```bash
# Check for updates
npm outdated

# Update everything
npm update

# Update specific package
npm update package-name
```

### Remove Package
```bash
npm uninstall package-name
```

---

## 🐛 Debugging & Troubleshooting

### View Development Logs
```bash
# Logs appear in terminal where npm run dev is running
# Also check browser Developer Tools: F12 or Cmd+Option+I
```

### Check for Errors
```bash
# ESLint check (if configured)
npm run lint

# Fix linting issues
npm run lint:fix
```

### Clear Cache & Reinstall
```bash
# Delete node_modules
rm -r node_modules
# or on Windows:
rmdir /s node_modules

# Clear npm cache
npm cache clean --force

# Reinstall everything
npm install
```

### Debug Supabase Connection
```javascript
// Add to your component for testing
console.log(import.meta.env.VITE_SUPABASE_URL);
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

// Should print your values (not undefined)
```

---

## 🔐 Environment Variables

### Set Up .env File
```bash
# Copy template
cp .env.example .env

# Edit the file (.env - NOT .env.example)
# Add your actual Supabase credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Verify Variables Loaded
```javascript
// In any component - for testing only
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should print: https://your-project.supabase.co
```

---

## 📱 Mobile Development

### Test on Mobile Device
```bash
# Get your machine's IP address
# Windows: ipconfig
# Mac/Linux: ifconfig

# Start dev server (note the output URL)
npm run dev

# On mobile device, visit:
# http://YOUR_IP_ADDRESS:5173

# Example:
# http://192.168.1.100:5173
```

---

## 🚢 Deployment Commands

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (first time)
vercel

# Deploy again (after code changes)
vercel --prod

# View deployments
vercel list
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy (first time)
netlify deploy

# Deploy to production
netlify deploy --prod

# View site
netlify open site
```

### GitHub Pages (if using GitHub)
```bash
# Build
npm run build

# The dist/ folder is what you deploy
# Upload to GitHub Pages or use GitHub Actions
```

---

## 📊 Project Statistics

### Check Project Size
```bash
# Build size before optimization
npm run build
# Check size of dist/ folder
```

### Lines of Code
```bash
# Count lines in src/
# Windows PowerShell:
(Get-ChildItem -Recurse -Include "*.jsx","*.js" | Measure-Object -Line).Lines

# Mac/Linux:
find src -name "*.jsx" -o -name "*.js" | xargs wc -l
```

---

## ⚡ Performance Tips

### Monitor Build Time
```bash
# Build with timing information
npm run build -- --analyze

# Or check terminal output during build
npm run dev
# Vite shows timing of dev server startup
```

### Check Dependencies
```bash
# See dependency tree
npm ls

# Find duplicate packages
npm ls --depth=0

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🧪 Testing (Optional - Not Included)

### Add Testing Library (Optional)
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

---

## 🎨 Styling Tips

### Colors Used in Project
```css
/* Primary Colors */
--primary: #667eea;      /* Purple-blue */
--secondary: #764ba2;    /* Purple */
--accent: #667eea;

/* Semantic Colors */
--success: #3c3;         /* Green */
--error: #c33;           /* Red */
--warning: #fb9;         /* Orange */
--info: #33c;            /* Blue */

/* Neutral Colors */
--bg-dark: #1a1a1a;
--bg-light: #f5f7fa;
--text-dark: #333;
--text-muted: #999;
--border: #ddd;
```

### Add Custom Colors
```css
/* In index.css */
:root {
  --my-custom-color: #YOUR_HEX_CODE;
}

/* Use in components */
.my-element {
  color: var(--my-custom-color);
}
```

---

## 🔗 Git Commands (If Using Version Control)

### Initialize Git Repo
```bash
git init
git add .
git commit -m "Initial commit: React Supabase integration"
```

### Push to GitHub
```bash
git remote add origin https://github.com/yourusername/repo.git
git branch -M main
git push -u origin main
```

### Common Git Operations
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to remote
git push

# Pull latest changes
git pull

# View history
git log

# Create new branch
git checkout -b feature-name
```

---

## 📚 File Navigation

### Open Files in Editor
```bash
# Open entire project
code .

# Or in VS Code:
# File → Open Folder → Select front-end/

# Key Files to Edit:
# - src/components/Dashboard.jsx (Main page)
# - src/services/dataService.js (CRUD operations)
# - src/styles/Dashboard.css (Styling)
# - .env (Supabase credentials)
```

### Project Structure Quick Access
```
front-end/
├── src/
│   ├── services/ ← Edit: supabaseClient.js, dataService.js
│   ├── components/ ← Edit: Login, SignUp, Dashboard, etc
│   ├── hooks/ ← useAuth, useData
│   ├── context/ ← AuthContext (global state)
│   └── styles/ ← Auth.css, CRUD.css, Dashboard.css
├── .env ← Add: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
├── package.json ← Dependencies list
└── README.md ← Project documentation
```

---

## 💾 Backup & Recovery

### Create Backup
```bash
# Backup entire project
cp -r front-end front-end-backup
# or on Windows:
xcopy front-end front-end-backup /E

# Backup just .env (IMPORTANT!)
cp .env .env.backup
```

### Restore from Backup
```bash
# Restore from backup
cp -r front-end-backup front-end
# or on Windows:
xcopy front-end-backup front-end /E /Y

# Restore .env
cp .env.backup .env
```

### Important: Don't Commit
```bash
# Make sure .env is in .gitignore
echo ".env" >> .gitignore

# Commit only .env.example
git add .env.example
git add .gitignore
git commit -m "Add environment template"
```

---

## 🆘 Emergency Reset

### Reset Everything
```bash
# Delete everything
rm -r node_modules package-lock.json
# or on Windows:
rmdir /s node_modules

# Reinstall
npm install

# Clear cache
npm cache clean --force

# Reinstall again
npm install

# Start fresh
npm run dev
```

### Full Restart
```bash
# Kill dev server (Ctrl+C in terminal)

# Reset dependencies
npm cache clean --force
rm -r node_modules package-lock.json
npm install

# Delete .env and recreate
rm .env
cp .env.example .env
# Edit .env with your credentials

# Restart
npm run dev
```

---

## 📋 Checklist: Daily Workflow

```
Morning:
□ npm run dev
□ Check browser for errors (F12)
□ Review Supabase console for new data

During Development:
□ Make code changes
□ Save files (Ctrl+S)
□ Check browser for updates (hot reload)
□ Test functionality
□ Check console for errors

Before Committing:
□ npm run build (verify no errors)
□ Test all features
□ Update .env if needed
□ Add .env to .gitignore

Before Deploying:
□ npm run build (verify success)
□ Check dist/ folder created
□ Set environment variables on hosting
□ Test full flow on staging
□ Deploy to production
```

---

## 🎓 Learning Resources

### Official Docs
```
React:        https://react.dev
Supabase:     https://supabase.com/docs
React Router: https://reactrouter.com
Vite:         https://vitejs.dev
```

### Tutorials
```
"npm run dev" - See development URL
npm run build - Create production build
npm install <package> - Add dependency
npm uninstall <package> - Remove dependency
```

---

## 🆘 Common Issues & Solutions

### Issue: npm command not found
**Solution:** 
- Install Node.js from nodejs.org
- Restart terminal

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 3000
# or kill the process:
# Windows: netstat -ano | findstr :5173
# Mac/Linux: lsof -i :5173 | kill -9 <PID>
```

### Issue: Modules not found
**Solution:**
```bash
npm install
npm cache clean --force
npm install
```

### Issue: .env file not working
**Solution:**
- Restart dev server
- Check file is named `.env` (not `.env.txt`)
- Verify variables start with `VITE_`

---

**Need Help?** Check SUPABASE_SETUP.md or ARCHITECTURE.md for detailed guides.
