# Quick Start Guide - Smart Retail Frontend

## ⚡ Getting Started in 5 Minutes

### Step 1: Install Node.js (Required)
**Node.js is not currently installed on your system.**

1. Download Node.js from: https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. Run the installer and follow the setup wizard
4. Restart your terminal/PowerShell after installation

To verify installation:
```bash
node -v    # Should show: v18.x.x or higher
npm -v     # Should show: 9.x.x or higher
```

### Step 2: Install Project Dependencies
```bash
npm install
```

This will install:
- React 18.2.0
- React Router DOM 6.22.0
- Vite 5.1.4
- Tailwind CSS 3.4.1
- Axios 1.6.7
- Recharts 2.12.0
- Lucide React 0.344.0
- And all other dependencies

### Step 3: Start Development Server
```bash
npm run dev
```

The application will automatically open at: **http://localhost:3000**

### Step 4: Access the Application
- **Login Page**: http://localhost:3000/login
- **Register Page**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard (after login)

---

## 🎯 What's Included

✅ **Complete React + Vite Setup**
✅ **Tailwind CSS Configured**
✅ **React Router with Protected Routes**
✅ **Authentication System (Login/Register)**
✅ **Dashboard with Charts & Analytics**
✅ **Inventory Management Interface**
✅ **Demand Forecasting Module**
✅ **Reports & Analytics**
✅ **Supplier Management**
✅ **Axios API Integration**
✅ **Responsive Mobile-First Design**
✅ **Reusable Components Library**

---

## 📱 Application Pages

### Public Pages
- `/login` - User login
- `/register` - New user registration

### Protected Dashboard Pages
- `/dashboard` - Main dashboard with overview
- `/inventory` - Inventory management
- `/forecast` - Demand forecasting
- `/reports` - Analytics and reports
- `/suppliers` - Supplier management

---

## 🔧 Environment Configuration

The `.env` file is already configured with:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Smart Retail Platform
```

**Note**: Update the API URL when your backend is running on a different port.

---

## 🎨 Tech Stack Summary

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | API Calls |
| Recharts | Data Visualization |
| Lucide React | Icons |

---

## 🚀 Next Steps

1. **Install Node.js** (if not done)
2. Run `npm install`
3. Run `npm run dev`
4. Open http://localhost:3000
5. Test the login/register pages
6. Explore the dashboard

---

## ⚠️ Current Status

**Node.js Installation Required**: The application is ready to run but requires Node.js to be installed first.

Once Node.js is installed, you'll be able to:
- Install all dependencies
- Run the development server
- Build for production
- Access all features

---

## 🆘 Need Help?

**Common Issues:**

1. **"npm is not recognized"**
   - Node.js is not installed or not in PATH
   - Solution: Install Node.js and restart terminal

2. **Port 3000 already in use**
   - Another app is using port 3000
   - Solution: Stop the other app or change port in vite.config.js

3. **Module not found errors**
   - Dependencies not installed
   - Solution: Run `npm install`

---

## 📚 Additional Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

**Ready to start building your Smart Retail Platform! 🚀**
