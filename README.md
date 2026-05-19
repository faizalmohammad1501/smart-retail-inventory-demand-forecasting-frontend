# Smart Retail Inventory & Demand Forecasting Platform - Frontend

A modern React-based frontend application for managing retail inventory and demand forecasting using AI-powered predictions.

## 🚀 Features

- **Dashboard**: Real-time overview of inventory, sales, and forecasts
- **Inventory Management**: Track and manage product stock levels
- **Demand Forecasting**: AI-powered demand predictions and recommendations
- **Reports & Analytics**: Detailed insights and downloadable reports
- **Supplier Management**: Manage supplier relationships and performance
- **Authentication**: Secure login and registration system
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API integration
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## 🔧 Installation & Setup

1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - The `.env` file is already configured with default values
   - Update `VITE_API_BASE_URL` if your backend runs on a different port

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`

## 📁 Project Structure

```
smart-retail-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and icons
│   ├── components/        # Reusable components
│   │   ├── common/       # Navbar, Sidebar, Loader, etc.
│   │   └── dashboard/    # Dashboard-specific components
│   ├── pages/            # Page components
│   │   ├── auth/         # Login, Register
│   │   └── dashboard/    # Dashboard pages
│   ├── layouts/          # Layout wrappers
│   ├── services/         # API service and configuration
│   ├── context/          # React Context (Auth)
│   ├── routes/           # Route configuration
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The application uses Axios for API communication. API endpoints are configured in:
- `src/services/api.js` - Main API configuration with interceptors
- Base URL: `http://localhost:8000/api` (configurable in `.env`)

### Available Services:
- **authService** - Login, Register, Profile
- **inventoryService** - CRUD operations for inventory
- **forecastService** - Demand and sales forecasting
- **analyticsService** - Dashboard stats and reports
- **supplierService** - Supplier management

## 🎯 Key Features Implemented

### Authentication
- JWT-based authentication with token storage
- Protected routes with automatic redirect
- Auth context for global user state management

### Dashboard
- Real-time statistics cards
- Sales and demand charts
- Forecast predictions with confidence levels
- Alert notifications

### Inventory Management
- Product listing with search and filters
- Stock level tracking
- Status indicators (In Stock, Low Stock, Out of Stock)

### Demand Forecasting
- AI-powered predictions
- Product-wise forecast breakdown
- Recommendation engine
- Configurable time ranges

### Reports & Analytics
- Sales performance metrics
- Top performing products
- Downloadable reports
- Customizable date ranges

### Supplier Management
- Supplier directory
- Contact information management
- Performance tracking
- Rating system

## 🎨 UI Components

### Common Components
- **Navbar** - Top navigation with user menu
- **Sidebar** - Left navigation menu
- **Loader** - Loading spinner
- **ProtectedRoute** - Route guard for authentication

### Dashboard Components
- **InventoryCard** - Metric display card
- **ForecastCard** - Forecast prediction card
- **SalesChart** - Line chart for sales trends
- **DemandChart** - Bar chart for demand analysis

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Token stored in localStorage
3. Token added to all API requests via Axios interceptor
4. Protected routes check for valid token
5. Auto-redirect to login if unauthorized (401)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

To build for production:

```bash
npm run build
```

The optimized files will be in the `dist/` folder, ready to deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## 🔗 Backend Integration

This frontend is designed to work with the Smart Retail Backend API. Ensure the backend is running and accessible at the URL configured in `.env`.

## 📝 Notes

- The application uses mock data for demonstration when backend is not connected
- All API calls include proper error handling
- Token refresh logic can be added to the API interceptors
- The design follows modern UI/UX best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is part of the Smart Retail Platform.

---

**Built with ❤️ using React + Vite + Tailwind CSS**
