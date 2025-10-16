# The Coffee Realm - POS System

A modern, full-stack Point of Sale (POS) system built for coffee shops with real-time order management, inventory tracking, and payment processing.

## Features

### Core Functionality
- **Point of Sale Terminal** - Complete POS interface for taking orders
- **Inventory Management** - Track products, stock levels, and low stock alerts
- **Order Management** - Real-time order tracking and status updates
- **User Authentication** - Secure login/register with Google OAuth
- **Payment Processing** - Integration with Xendit for multiple payment methods
- **Dashboard Analytics** - Sales overview and daily statistics

### Technical Features
- **Real-time Updates** - Live order status and inventory changes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Type Safety** - Full TypeScript implementation
- **Modern UI** - Built with Tailwind CSS and Radix UI components
- **State Management** - Zustand for efficient state handling

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icons

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Real-time)
- **Xendit** - Payment processing for Philippines
- **Vercel Analytics** - Performance monitoring

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **React Refresh** - Hot module replacement

## 📁 Project Structure

```
src/
├── components/                 # Reusable UI components
│   ├── ui/                    # Base UI components (buttons, inputs, etc.)
│   ├── pos/                   # POS-specific components
│   ├── payment/               # Payment-related components
│   ├── DashboardLayout.tsx    # Main dashboard layout
│   ├── ProtectedRoute.tsx     # Route protection component
│   └── PaymentModal.tsx       # Payment processing modal
├── contexts/                  # React Context providers
│   ├── auth-context.ts        # Authentication context definition
│   └── auth-provider.tsx      # Authentication provider component
├── hooks/                     # Custom React hooks
│   ├── use-auth.ts           # Authentication hook
│   ├── use-mobile.ts         # Mobile detection hook
│   └── use-store-initializer.ts # Store initialization hook
├── lib/                      # Utility libraries and configurations
│   ├── supabase.ts          # Supabase client configuration
│   ├── utils.ts             # Utility functions
│   └── xendit.ts            # Xendit payment integration
├── pages/                    # Page components
│   ├── authentication/      # Login and register pages
│   │   ├── _components/     # Auth-specific components
│   │   ├── login.tsx        # Login page
│   │   ├── register.tsx     # Registration page
│   │   └── index.ts         # Auth exports
│   └── dashboard/           # Dashboard pages
│       ├── Overview.tsx     # Dashboard overview
│       ├── POSTerminal.tsx  # POS terminal
│       ├── Orders.tsx       # Order management
│       └── Inventory.tsx    # Inventory management
├── services/                # Business logic services
│   ├── payment/            # Payment-related services
│   └── user-profile/       # User profile services
├── stores/                 # Zustand state stores
│   ├── use-cart-store.ts   # Shopping cart state
│   ├── use-inventory-store.ts # Inventory state
│   └── use-orders-store.ts # Orders state
├── App.tsx                 # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Installation & Environment Setup

### Prerequisites

#### 1. System Requirements
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: pnpm (recommended) or npm
- **Git**: For version control
- **Code Editor**: VS Code (recommended)

#### 2. Install Node.js
```bash
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from: https://nodejs.org/
# Or use a version manager like nvm:
# nvm install 18
# nvm use 18
```

#### 3. Install pnpm (Recommended)
```bash
# Install pnpm globally
npm install -g pnpm

# Verify installation
pnpm --version
```

### 📦 Project Setup

#### 1. Clone the Repository
```bash
# Navigate to your development directory
cd /Applications/XAMPP/xamppfiles/htdocs/the-coffee-realm

# If you need to clone from a repository:
# git clone <repository-url>
# cd the-coffee-realm/coffee-realm
```

#### 2. Install Dependencies
```bash
# Navigate to the project directory
cd coffee-realm

# Install all dependencies (this will install everything from package.json)
pnpm install

# Alternative with npm:
# npm install
```

**What gets installed:**
- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Radix UI** - Component library
- **Supabase** - Backend services
- **Xendit** - Payment processing
- **Zustand** - State management
- **React Router** - Navigation
- **ESLint** - Code linting

#### 3. Verify Installation
```bash
# Check if all dependencies are installed
pnpm list

# Run the development server to test
pnpm dev
```

### 🔧 Environment Configuration

#### 1. Create Environment File
Create a `.env` file in the root directory (`coffee-realm/.env`):

```bash
# Navigate to project root
cd coffee-realm

# Create .env file
touch .env
```

#### 2. Environment Variables Template
Copy this template into your `.env` file:

```env
# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
# Get these from your Supabase project dashboard
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# ===========================================
# XENDIT PAYMENT CONFIGURATION
# ===========================================
# Get these from your Xendit dashboard
VITE_XENDIT_PUBLIC_KEY=your-xendit-public-key
XENDIT_SECRET_KEY=your-xendit-secret-key
VITE_XENDIT_CUSTOMER_ID=your-xendit-customer-id
VITE_XENDIT_REFERENCE_ID=your-xendit-reference-id

# ===========================================
# DEVELOPMENT SETTINGS
# ===========================================
# Set to 'development' for local development
NODE_ENV=development
```

#### 3. Get Supabase Credentials

##### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `coffee-realm-pos`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

##### Step 2: Get Supabase Keys
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

##### Step 3: Set Up Database
1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase-migrations/001_create_user_profiles.sql`
4. Click "Run" to execute the migration

##### Step 4: Configure Authentication
1. Go to **Authentication** → **Settings**
2. **Site URL**: `http://localhost:5173` (for development)
3. **Redirect URLs**: Add `http://localhost:5173/dashboard`
4. **Google OAuth** (optional):
   - Go to **Authentication** → **Providers**
   - Enable Google provider
   - Add your Google OAuth credentials

#### 4. Get Xendit Credentials

##### Step 1: Create Xendit Account
1. Go to [xendit.co](https://xendit.co)
2. Sign up for an account
3. Complete the verification process

##### Step 2: Get API Keys
1. Go to **Developers** → **API Keys**
2. Copy the following:
   - **Public Key** → `VITE_XENDIT_PUBLIC_KEY`
   - **Secret Key** → `XENDIT_SECRET_KEY`
   - **Customer ID** → `VITE_XENDIT_CUSTOMER_ID`
   - **Reference ID** → `VITE_XENDIT_REFERENCE_ID`

##### Step 3: Configure Webhooks (Optional)
1. Go to **Developers** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/webhooks/xendit`
3. Select events: `invoice.paid`, `invoice.expired`

## 🚀 Running the Application

### 1. Start Development Server
```bash
# Make sure you're in the project directory
cd coffee-realm

# Start the development server
pnpm dev

# Alternative commands:
# npm run dev
# yarn dev
```

### 2. Access the Application
- **Local URL**: `http://localhost:5173`
- **Network URL**: `http://192.168.x.x:5173` (for mobile testing)

### 3. Verify Everything Works
1. **Open browser** to `http://localhost:5173`
2. **Test registration** - Create a new account
3. **Test login** - Sign in with your account
4. **Test POS** - Navigate to `/dashboard/pos`
5. **Test payment** - Try creating an order (use test payment data)

## 🔍 Troubleshooting

### Common Installation Issues

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# If version is too old, update:
# Using nvm:
nvm install 18
nvm use 18

# Or download from nodejs.org
```

#### 2. pnpm Installation Issues
```bash
# If pnpm install fails, try:
npm install -g pnpm@latest

# Or use npm instead:
npm install
```

#### 3. Dependency Conflicts
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Or with npm:
rm -rf node_modules
rm package-lock.json
npm install
```

#### 4. Environment Variables Not Loading
```bash
# Make sure .env file is in the correct location:
# coffee-realm/.env (not in parent directory)

# Check if variables are loaded:
# Add this to any component temporarily:
console.log(import.meta.env.VITE_SUPABASE_URL)
```

#### 5. Supabase Connection Issues
```bash
# Check your Supabase URL format:
# Correct: https://your-project-id.supabase.co
# Wrong: https://supabase.co/dashboard/project/your-project-id

# Verify your anon key is correct
# Check Supabase dashboard → Settings → API
```

#### 6. Xendit Integration Issues
```bash
# Make sure you're using the correct environment:
# Development: Use sandbox keys
# Production: Use live keys

# Check Xendit dashboard for correct API keys
```

### Development Server Issues

#### 1. Port Already in Use
```bash
# If port 5173 is busy:
pnpm dev --port 3000

# Or kill the process using port 5173:
lsof -ti:5173 | xargs kill -9
```

#### 2. Hot Reload Not Working
```bash
# Restart the development server
# Press Ctrl+C to stop, then:
pnpm dev
```

#### 3. TypeScript Errors
```bash
# Check TypeScript compilation:
pnpm tsc --noEmit

# Fix any type errors before running dev server
```

## 📱 Testing on Mobile

### 1. Find Your Local IP
```bash
# On macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# On Windows:
ipconfig | findstr "IPv4"
```

### 2. Start Dev Server with Network Access
```bash
# Start with network access
pnpm dev --host

# Access from mobile: http://YOUR_IP:5173
```

### 3. Test Mobile Features
- Touch interactions
- Responsive design
- Mobile navigation
- Payment flow on mobile

## Production Deployment

### 1. Build for Production
```bash
# Create production build
pnpm build

# Test production build locally
pnpm preview
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 3. Environment Variables for Production
Set these in your deployment platform:
- All `VITE_*` variables
- `NODE_ENV=production`
- Update Supabase redirect URLs
- Use production Xendit keys

## Development Guidelines

### Naming Conventions
- **Files & Folders**: `kebab-case` (e.g., `user-profile.tsx`)
- **Components**: `PascalCase` (e.g., `UserProfile`)
- **Functions & Variables**: `camelCase` (e.g., `getUserProfile`)
- **Types & Interfaces**: `PascalCase` (e.g., `UserProfileType`)

### Code Organization
- **Components**: Keep components small and focused on single responsibility
- **Hooks**: Use custom hooks for reusable logic
- **Services**: Business logic should be in service files
- **Stores**: Use Zustand for global state management
- **Context**: Use React Context for app-wide state (auth, theme, etc.)

### File Structure Rules
- **Shared Components**: Place in `src/components/`
- **Page Components**: Place in `src/pages/`
- **Custom Hooks**: Place in `src/hooks/`
- **Business Logic**: Place in `src/services/`
- **State Management**: Place in `src/stores/`
- **Utilities**: Place in `src/lib/`

## Key Components

### Authentication System
- **Context-based**: Uses React Context for global auth state
- **Supabase Auth**: Handles user authentication and sessions
- **Google OAuth**: Social login integration
- **Protected Routes**: Automatic route protection

### State Management
- **Zustand Stores**: Lightweight state management
  - `use-cart-store.ts` - Shopping cart functionality
  - `use-inventory-store.ts` - Product inventory management
  - `use-orders-store.ts` - Order processing and tracking

### Payment Integration
- **Xendit Integration**: Supports multiple payment methods
  - Credit Cards
  - GCash
  - GrabPay
  - PayMaya
- **Real-time Status**: Payment status updates

### POS System
- **Product Grid**: Browse products by category
- **Shopping Cart**: Add/remove items, quantity management
- **Order Processing**: Complete order workflow
- **Payment Modal**: Secure payment processing

## UI Components

### Design System
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Custom Components**: Built on top of Radix UI
- **Responsive Design**: Mobile-first approach

### Component Library
Located in `src/components/ui/`:
- `button.tsx` - Various button styles and states
- `input.tsx` - Form input components
- `card.tsx` - Card layout components
- `dialog.tsx` - Modal dialogs
- `table.tsx` - Data tables
- And more...

## API Integration

### Supabase
- **Database**: PostgreSQL with real-time subscriptions
- **Authentication**: User management and sessions
- **Storage**: File uploads (if needed)
- **Real-time**: Live updates for orders and inventory

### Xendit
- **Payment Processing**: Invoice creation and management
- **Webhooks**: Payment status updates
- **Multiple Methods**: Support for various payment options

## esting

### Running Tests
```bash
pnpm test
```

### Linting
```bash
pnpm lint
```

### Type Checking
```bash
pnpm tsc --noEmit
```

## 📱 Mobile Development

### React Native Setup (Future)
The system is designed to be easily converted to React Native:
- Shared business logic in services
- Zustand stores work with React Native
- Supabase client supports React Native
- Component structure is mobile-friendly

## Security

### Authentication
- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level security
- **Protected Routes**: Client-side route protection
- **Session Management**: Automatic session handling

### Data Protection
- **Environment Variables**: Sensitive data in env files
- **Type Safety**: TypeScript prevents runtime errors
- **Input Validation**: Form validation and sanitization

## Verification Checklist

After setup, verify these work:

- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads after login
- [ ] POS terminal displays products
- [ ] Shopping cart functionality works
- [ ] Payment integration works (test mode)
- [ ] Inventory management works
- [ ] Order management works
- [ ] Mobile responsive design works

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make your changes following the coding guidelines
3. Test your changes thoroughly
4. Submit a pull request

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] TypeScript types are correct
- [ ] Components are properly structured
- [ ] No console.log statements in production code
- [ ] Responsive design works on all devices

## 📄 License

This project is proprietary software for The Coffee Realm.

---

**Happy Coding! ☕️**
