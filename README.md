# GUTS Investigation API

A full-stack investigation management system built with FastAPI backend, React frontend, and MySQL database.

![Project Banner](https://img.shields.io/badge/GUTS-Investigation%20API-blue?style=for-the-badge)

## 🚀 Features

- **RESTful API** with FastAPI and automatic OpenAPI documentation
- **Modern React Frontend** with Vite, Tailwind CSS, and Zustand state management
- **JWT Authentication** with secure login/logout and token refresh
- **MySQL Database** with SQLAlchemy ORM
- **Docker Support** for development and production environments
- **CRUD Operations** for investigation items
- **Responsive Design** with mobile-first approach
- **OAuth2 Integration** ready for Google, GitHub, Facebook, Twitter, and LinkedIn
- **Persistent State** with localStorage integration
- **Type Safety** with Pydantic schemas

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Frontend Features](#frontend-features)
- [Docker Usage](#docker-usage)
- [Contributing](#contributing)

## 📁 Project Structure

```
GutsApi/
├── 📁 backEnd/                     # FastAPI backend
│   ├── 📁 app/
│   │   ├── 📁 api/                 # API route handlers
│   │   │   ├── 📁 endpoints/       # Endpoint modules
│   │   │   │   ├── users.py        # User management routes
│   │   │   │   └── items.py        # Items CRUD routes
│   │   │   └── dependencies.py     # Shared dependencies
│   │   ├── 📁 core/                # Core application logic
│   │   │   ├── config.py           # Application configuration
│   │   │   ├── security.py         # Security utilities
│   │   │   └── oauth.py            # OAuth2 configuration
│   │   ├── 📁 db/                  # Database configuration
│   │   │   └── database.py         # Database connection
│   │   ├── 📁 models/              # SQLAlchemy models
│   │   │   ├── user.py             # User model
│   │   │   └── item.py             # Item model
│   │   ├── 📁 schemas/             # Pydantic schemas
│   │   │   ├── user.py             # User schemas
│   │   │   └── item.py             # Item schemas
│   │   └── main.py                 # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend Docker configuration
│   ├── docker-compose.dev.yml      # Backend dev environment
│   ├── .env                        # Backend environment variables
│   └── .env.example               # Backend environment template
│
├── 📁 frontEnd/                    # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable React components
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   │   └── Header.jsx      # Application header with auth
│   │   │   ├── 📁 auth/            # Authentication components
│   │   │   │   ├── Login.jsx       # Login form
│   │   │   │   └── Register.jsx    # Registration form
│   │   │   ├── Container.jsx       # Container wrapper
│   │   │   ├── ModuleBtn.jsx       # Module button component
│   │   │   ├── ItemsTable.jsx      # Items data table
│   │   │   └── DataTable.jsx       # Generic data table
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Dashboard.jsx       # Main dashboard
│   │   │   ├── Auth.jsx            # Authentication page
│   │   │   ├── Items.jsx           # Items management page
│   │   │   └── ErrorNotFound.jsx   # 404 error page
│   │   ├── 📁 services/            # API service layer
│   │   │   ├── auth.services.js    # Authentication services
│   │   │   └── item.services.js    # Item CRUD services
│   │   ├── 📁 store/               # Zustand state management
│   │   │   ├── 📁 slices/          # State slices
│   │   │   │   ├── authSlice.js    # Authentication state
│   │   │   │   └── itemsSlice.js   # Items state
│   │   │   ├── store.js            # Main store with persistence
│   │   │   └── useDataTableStore.js # Alternative data table store
│   │   ├── 📁 config/              # Configuration files
│   │   │   └── api.config.js       # API configuration
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx                # Application entry point
│   │   └── router.jsx              # React Router configuration
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.js             # Vite configuration with proxy
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── Dockerfile                 # Frontend Docker configuration
│   ├── docker-compose.dev.yml     # Frontend dev environment
│   ├── .env                       # Frontend environment variables
│   └── .env.example              # Frontend environment template
│
├── 📁 nginx/                       # Nginx configuration (production)
│   └── nginx.conf                  # Reverse proxy configuration
├── docker-compose.yml             # Development Docker Compose
├── docker-compose.prod.yml        # Production Docker Compose
├── Makefile                       # Development commands
├── .env                          # Main environment configuration
├── .env.example                  # Main environment template
├── .gitignore                    # Git ignore rules
├── .gitattributes               # Git attributes
└── README.md                    # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js** (v18+) and **npm**
- **Python** (v3.11+) and **pip**
- **MySQL** (v8.0+)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd GutsApi
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your actual values
nano .env
```

### 3. Docker Development (Recommended)

```bash
# Start all services with Docker
docker-compose up --build

# Or run in background
docker-compose up -d --build

# Use Makefile for convenience
make dev
```

### 4. Manual Development Setup

**Backend:**
```bash
cd backEnd
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontEnd
npm install
npm run dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend API** | http://localhost:8000 | FastAPI backend |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **ReDoc** | http://localhost:8000/redoc | Alternative API documentation |
| **MySQL** | localhost:3306 | Database (if running locally) |

## ⚙️ Environment Configuration

### Required Environment Variables

**Main .env file:**
```bash
# Application Settings
PROJECT_NAME=GutsAPI
VERSION=1.0.0
ENVIRONMENT=development
API_V1_STR=/api/v1

# Database Settings
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_DATABASE=product
MYSQL_USER=gutsuser
MYSQL_PASSWORD=gutspassword123
DATABASE_URL=mysql+mysqlconnector://root:@mysql:3306/product

# Security Settings
SECRET_KEY=guts-dev-secret-key-2024-change-in-production-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# OAuth2 Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id-from-console
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-console
GITHUB_CLIENT_ID=your-github-client-id-from-app
GITHUB_CLIENT_SECRET=your-github-client-secret-from-app

# Frontend Settings
VITE_API_URL=http://localhost:8000
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=GUTS Investigation System
VITE_ENVIRONMENT=development
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/users/login` | User login | ❌ |
| `POST` | `/api/v1/users/register` | User registration | ❌ |
| `POST` | `/api/v1/users/logout` | User logout | ✅ |
| `POST` | `/api/v1/users/refresh` | Refresh access token | ✅ |

### Items Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/items/` | List all items | ✅ |
| `GET` | `/api/v1/items/{id}` | Get item by ID | ✅ |
| `POST` | `/api/v1/items/` | Create new item | ✅ |
| `PUT` | `/api/v1/items/{id}` | Update item | ✅ |
| `DELETE` | `/api/v1/items/{id}` | Delete item | ✅ |

### Users Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/v1/users/me` | Get current user | ✅ |
| `PUT` | `/api/v1/users/update` | Update current user | ✅ |
| `GET` | `/api/v1/users/` | List users (admin) | ✅ |
| `GET` | `/api/v1/users/{id}` | Get user by ID | ✅ |

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with persistent sessions:

### Login Process

1. **Register a new user:**
```bash
curl -X POST "http://localhost:8000/api/v1/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123"
  }'
```

2. **Login to get access token:**
```bash
curl -X POST "http://localhost:8000/api/v1/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "securepassword123"
  }'
```

3. **Use token in subsequent requests:**
```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  "http://localhost:8000/api/v1/items/"
```

### Token Management

- **Access tokens** expire in 30 minutes (configurable)
- **Refresh tokens** are used to get new access tokens
- **Automatic token refresh** handled by frontend
- **Persistent sessions** with localStorage
- **Secure logout** invalidates tokens

## 🎨 Frontend Features

### State Management with Zustand

- **Persistent authentication** state across browser sessions
- **Optimistic updates** for better UX
- **Error handling** with user feedback
- **Automatic token refresh** and session management
- **Centralized store** with modular slices

### UI Components

- **Responsive design** with Tailwind CSS
- **Mobile-first** approach with hamburger menu
- **Loading states** and error handling
- **Confirmation dialogs** for destructive actions
- **Form validation** with real-time feedback
- **Modal components** for editing and confirmations

### Key Features

- **Dashboard** with module navigation
- **Items management** with full CRUD operations
- **User authentication** with persistent sessions
- **Real-time error** handling and validation
- **Mobile-responsive** design
- **Search and pagination** for data tables
- **Logout confirmation** with error handling

## 🐳 Docker Usage

### Development Environment

```bash
# Start development environment
make dev
# or
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
make stop
# or
docker-compose down

# Clean everything (including volumes)
make clean
```

### Individual Services

```bash
# Backend only (with database)
make backend
# or
cd backEnd && docker-compose -f docker-compose.dev.yml up --build

# Frontend only
make frontend
# or
cd frontEnd && docker-compose -f docker-compose.dev.yml up --build
```

### Production Deployment

```bash
# Production deployment
make prod
# or
docker-compose -f docker-compose.prod.yml up -d --build

# View production logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🛠️ Development Commands

### Using Makefile

```bash
make help          # Show all available commands
make dev           # Start development environment
make prod          # Start production environment
make backend       # Run only backend + database
make frontend      # Run only frontend
make stop          # Stop all services
make clean         # Remove all containers and volumes
make logs          # View logs for all services
make build         # Rebuild all services
```

### Backend Development

```bash
cd backEnd

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run with specific environment
ENVIRONMENT=development uvicorn app.main:app --reload
```

### Frontend Development

```bash
cd frontEnd

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Production Deployment

### Environment Configuration

1. **Update production environment:**
```bash
# Set secure values in .env
SECRET_KEY=your-super-secure-production-secret-key-minimum-32-characters
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_user_password
ENVIRONMENT=production
```

2. **Configure OAuth2 providers** (optional):
- Google: https://console.developers.google.com/
- GitHub: https://github.com/settings/applications/new
- Facebook: https://developers.facebook.com/apps/
- Twitter: https://developer.twitter.com/en/portal/dashboard
- LinkedIn: https://www.linkedin.com/developers/apps

3. **Update CORS settings:**
```bash
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
```

### Deployment Steps

```bash
# Pull latest code
git pull origin main

# Build and deploy
make prod

# Verify deployment
docker-compose -f docker-compose.prod.yml ps
curl http://your-domain.com/api/v1/health
```

## 🔧 Troubleshooting

### Common Issues

1. **Database connection errors:**
```bash
# Check MySQL service
docker-compose logs mysql
# Reset database
docker-compose down -v && docker-compose up -d mysql
```

2. **CORS errors:**
```bash
# Check CORS configuration
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

3. **Authentication issues:**
```bash
# Clear browser storage
localStorage.clear()
# Check token expiration
# Verify SECRET_KEY consistency
```

4. **Port conflicts:**
```bash
# Check port usage
lsof -i :3306  # MySQL
lsof -i :8000  # Backend
lsof -i :5173  # Frontend
```

### Debugging

```bash
# View all service logs
make logs

# Debug specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec frontend sh
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Use meaningful commit messages
- Keep pull requests focused and small

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent Python framework
- **React** and **Vite** for modern frontend development
- **Tailwind CSS** for utility-first styling
- **Zustand** for simple state management
- **Docker** for containerization
- **MySQL** for reliable data storage

---

## 📞 Support

For support and questions:
- Check the [API documentation](http://localhost:8000/docs) when running locally
- Review the troubleshooting section above
- Open an issue on GitHub

**Happy coding! 🚀**