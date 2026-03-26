# React + Supabase Setup Guide

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Installation Steps](#installation-steps)
3. [Environment Setup](#environment-setup)
4. [How It Works](#how-it-works)
5. [Common Errors & Solutions](#common-errors--solutions)
6. [File Descriptions](#file-descriptions)

---

## Project Structure

```
your-react-app/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   └── AuthGuard.jsx
│   │   ├── CRUD/
│   │   │   ├── DataTable.jsx
│   │   │   ├── AddData.jsx
│   │   │   └── EditData.jsx
│   │   └── Dashboard.jsx
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── authService.js
│   │   └── dataService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useData.js
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .env (DO NOT COMMIT)
├── .env.example
├── .gitignore
└── package.json
```

---

## Installation Steps

### Step 1: Create Vite React Project
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

### Step 2: Install Supabase
```bash
npm install @supabase/supabase-js
```

### Step 3: Setup Environment Variables
Create `.env` file in root:
```
VITE_SUPABASE_URL=https://eikzpnipv...
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

**Important:** Add `.env` to `.gitignore`

### Step 4: Copy All Files
Copy all provided files to their respective locations (see File Descriptions section).

### Step 5: Run the App
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Environment Setup

### Why Environment Variables?
- **Security**: Never expose keys in source code
- **Flexibility**: Different keys for dev/prod
- **Best Practice**: Industry standard

### Accessing in Components
```javascript
// Vite uses import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_ANON_KEY;
```

### Naming Convention
- Prefix with `VITE_` (required for Vite)
- Use UPPERCASE with UNDERSCORES
- No sensitive data in `import.meta.env.MODE`

---

## How It Works

### 1. **Frontend ↔ Supabase Communication**

```
┌─────────────────┐
│  React App      │
│  (Browser)      │
└────────┬────────┘
         │ HTTPS Request
         ▼
┌─────────────────┐
│  Supabase API   │
│  (PostgreSQL)   │
└────────┬────────┘
         │ Data Response
         ▼
┌─────────────────┐
│  React State    │
│  (Component)    │
└─────────────────┘
```

### 2. **Authentication Flow**
```
User Signs Up
    ↓
POST /auth/v1/signup
    ↓
Supabase Creates User + JWT Token
    ↓
Token Stored in localStorage
    ↓
All Future Requests Include Token
    ↓
Server Validates Token
    ↓
Grant/Deny Access
```

### 3. **RLS (Row Level Security) - How It Works**
```sql
-- Example: Users can only see their own data
CREATE POLICY "Users see own data"
ON public.tasks
FOR SELECT
USING (auth.uid() = user_id);
```

- `auth.uid()` = Current logged-in user's ID
- Only returns rows where `user_id` matches
- Applied automatically to all queries

---

## Common Errors & Solutions

### ❌ CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Cause:** Browser blocking request from different domain

**Fix:**
1. CORS is **already enabled** on Supabase (✅ No action needed)
2. Check your request headers are correct
3. Use HTTPS not HTTP

**Code Check:**
```javascript
// ✅ Correct
const { data, error } = await supabase
  .from('users')
  .select();

// ❌ Wrong - Direct fetch won't work
fetch('https://api.supabase.com/users')
```

---

### ❌ RLS Policy Error
**Error:** `new row violates row-level security policy`

**Cause:** Row-level security policy preventing insert/update

**Fix:**
1. Check RLS policies in Supabase dashboard
2. Ensure `auth.uid()` matches `user_id` in table
3. Policy might deny the operation

**Debug:**
```javascript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user ID:', user?.id);

// Ensure you're sending correct user_id
const { data, error } = await supabase
  .from('tasks')
  .insert([{ title: 'Task', user_id: user.id }]) // Match auth.uid()
  .select();
```

---

### ❌ Invalid Supabase Key
**Error:** `Invalid credentials` or `Invalid API key`

**Cause:** 
- Wrong URL or key
- Key is secret key instead of anon key
- Typo in environment variable

**Fix:**
1. Get **ANON KEY** (not SECRET KEY) from Supabase dashboard
2. Copy full URL with `.supabase.co`
3. Check `.env` file spelling (should be `VITE_SUPABASE_URL`)

**Verify:**
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
// Should print full URL and 40+ char key
```

---

### ❌ Missing VITE_ Prefix
**Error:** `undefined` when accessing environment variables

**Cause:** Environment variables don't start with `VITE_`

**Fix:**
```javascript
// ❌ Wrong - Vite won't expose this
process.env.SUPABASE_URL

// ✅ Correct - Must start with VITE_
import.meta.env.VITE_SUPABASE_URL
```

---

### ❌ JWT Token Expired
**Error:** `JWT_EXPIRED` or `Invalid token`

**Cause:** Session expired after 1 hour

**Fix:**
```javascript
// Supabase auto-refreshes if token near expiration
// If not, manually refresh:
const { data, error } = await supabase.auth.refreshSession();
```

---

### ❌ CRUD Operation Returns Empty Array
**Error:** Query returns `[]` but data exists in table

**Cause:**
- RLS policy denying read access
- Wrong table name
- Wrong column filtering

**Debug:**
```javascript
// 1. Check RLS policy exists and is correct
// Dashboard → Authentication → Policies

// 2. Try reading without filter first
const { data } = await supabase.from('tasks').select();

// 3. Check column names match exactly (case sensitive)
const { data } = await supabase
  .from('tasks')
  .select('id, title, user_id'); // Column names must exist
```

---

## File Descriptions

| File | Purpose |
|------|---------|
| `supabaseClient.js` | Creates & exports Supabase client |
| `authService.js` | Authentication functions |
| `dataService.js` | CRUD operations |
| `AuthContext.jsx` | Global auth state management |
| `useAuth.js` | Hook for accessing auth state |
| `useData.js` | Hook for data operations |
| `SignUp.jsx` | Sign up component |
| `Login.jsx` | Login component |
| `Dashboard.jsx` | Protected dashboard |
| `.env.example` | Template (commit this) |
| `.env` | Actual keys (DON'T commit) |

---

## Testing Checklist

- [ ] Environment variables load correctly
- [ ] Can sign up new user
- [ ] Can login existing user
- [ ] Token saved to localStorage
- [ ] Can fetch data (GET)
- [ ] Can insert data (POST)
- [ ] Can update data (PUT)
- [ ] Can delete data (DELETE)
- [ ] Logout clears session
- [ ] Page redirects to login when not authenticated
- [ ] RLS policies working correctly
- [ ] Error messages display properly

---

## Deployment Notes

### Before Deploying

1. **Never commit `.env` file**
   ```bash
   echo ".env" >> .gitignore
   git rm --cached .env
   ```

2. **Use `.env.example` as template**
   ```
   VITE_SUPABASE_URL=your_url_here
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

3. **Add environment variables to deployment platform**
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment
   - GitHub Pages: Not recommended for keys

4. **Update Supabase CORS settings** (if needed)
   - Dashboard → Settings → API
   - Add your deployed URL

---

## Security Best Practices

✅ **Do:**
- Use ANON key for frontend (not SECRET)
- Enable RLS on all tables
- Use Row Level Security policies
- Implement proper authentication checks
- Store sensitive tokens safely

❌ **Don't:**
- Commit `.env` file
- Use SECRET key in frontend
- Disable RLS (unless public data)
- Trust client-side validation only
- Expose keys in console logs

---

## Troubleshooting

**Step 1:** Check browser console for errors
```javascript
// Add logging to debug
console.log('Auth state:', user);
console.log('Data:', data);
console.log('Error:', error);
```

**Step 2:** Check Supabase Dashboard
- Authentication → Users
- SQL Editor → Check table structure
- Policies → Verify RLS

**Step 3:** Verify network requests
- Browser DevTools → Network tab
- Look for 4xx/5xx errors
- Check request headers include auth token

**Step 4:** Test with Supabase CLI
```bash
supabase status
supabase functions serve
```

---

## Quick Start Summary

1. ✅ Create Vite React project
2. ✅ Install `@supabase/supabase-js`
3. ✅ Create `.env` with credentials
4. ✅ Copy all provided files
5. ✅ Set up database tables in Supabase
6. ✅ Configure RLS policies
7. ✅ Run `npm run dev`
8. ✅ Test authentication flows
9. ✅ Test CRUD operations

**That's it!** Your React app is now connected to Supabase! 🚀
