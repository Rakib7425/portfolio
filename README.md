# Full-Stack Portfolio Platform

A production-grade developer portfolio platform with a public website, admin dashboard, and RESTful backend APIs.

## 🏗️ Architecture

This is a **monorepo** built with:
- **Public Website**: Next.js 14 (App Router) -  Animated portfolio showcasing projects, skills, and experience
- **Admin Panel**: Next.js 14 (App Router) - Content management dashboard with analytics
- **Backend API**: Node.js + Express + TypeScript - RESTful APIs with JWT authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Cache**: Redis for API response caching
- **DevOps**: Docker Compose for local development, Docker + Nginx for production

## 📁 Project Structure

```
portfolio/
├── apps/
│   ├── web/              # Public Next.js website (port 3000)
│   └── admin/            # Admin Next.js panel (port 3001)
├── server/               # Node.js backend (port 5000)
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Auth, error handling, rate limiting
│   │   └── config/       # Environment configuration
│   └── prisma/           # Database schema and migrations
├── docker/               # Dockerfiles for each service
├── nginx/                # Nginx reverse proxy configuration
├── .env                  # Environment variables
└── docker-compose.yaml   # Local development setup
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Yarn
- Docker & Docker Compose (optional, for containerized development)

### Option 1: Local Development (Without Docker)

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up PostgreSQL and Redis:**
   - Install PostgreSQL and create a database
   - Install Redis
   - Update `DATABASE_URL` and `REDIS_URL` in `.env`

4. **Initialize the database:**
   ```bash
   yarn workspace @portfolio/server drizzle:generate
   yarn workspace @portfolio/server drizzle:migrate
   yarn workspace @portfolio/server drizzle:seed
   ```

5. **Start all services:**
   ```bash
   yarn dev
   ```

   Or start individual services:
   ```bash
   yarn dev:web      # Public website on http://localhost:3000
   yarn dev:admin    # Admin panel on http://localhost:3001
   yarn dev:server   # Backend API on http://localhost:5000
   ```

### Option 2: Docker Development

1. **Start all services with Docker Compose:**
   ```bash
   yarn docker:dev
   ```

   This will start:
   - PostgreSQL (port 5432)
   - Redis (port 6379)
   - Backend API (port 5000)
   - Web app (port 3000)
   - Admin app (port 3001)
   - Nginx reverse proxy (port 80)

2. **Initialize the database:**
   ```bash
   # Access the backend container
   docker exec -it portfolio-api sh
   
   # Run migrations and seed
   yarn workspace @portfolio/server drizzle:generate
   yarn workspace @portfolio/server drizzle:migrate
   yarn workspace @portfolio/server drizzle:seed
   ```

3. **Access the applications:**
   - Public Website: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Backend API: http://localhost:5000
   - API Docs : http://localhost:5000/api-docs (Coming soon)

## 🔑 Default Admin Credentials

After running the seed script:
- **Email**: admin@portfolio.com
- **Password**: Admin@123456

⚠️ **Change these in production!**

## 📦 Available Scripts

### Root Scripts
- `yarn dev` - Start all services in development mode
- `yarn build` - Build all services for production
- `yarn lint` - Run linters across all packages
- `yarn test` - Run tests across all packages
- `yarn docker:dev` - Start Docker Compose development environment
- `yarn drizzle:generate` - Generate database migrations
- `yarn drizzle:migrate` - Run database migrations
- `yarn drizzle:studio` - Open Prisma Studio

### Service-Specific Scripts
- `yarn workspace @portfolio/web [script]` - Run web app script
- `yarn workspace @portfolio/admin [script]` - Run admin app script
- `yarn workspace @portfolio/server [script]` - Run server script

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=portfolio-media
```

### Frontend (apps/web/.env.local & apps/admin/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🗄️ Database Schema

The platform includes the following models:
- **User**: Admin users with JWT authentication
- **Profile**: Developer profile information
- **Skill**: Technical skills with proficiency levels
- **Experience**: Work experience timeline
- **Project**: Portfolio projects with images and tech stacks
- **Contact**: Contact form submissions
- **PageView**: Page view analytics
- **ProjectView**: Project-specific view tracking
- **SeoMeta**: SEO metadata for each page

## 🛡️ Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Redis-backed rate limiting
- Helmet.js security headers
- CORS configuration
- Input validation with Zod
- Bcrypt password hashing
- SQL injection protection (Prisma)

## 📊 API Documentation

### Public Endpoints (No Auth Required)
- `GET /api/v1/public/profile` - Get profile information
- `GET /api/v1/public/skills` - Get all skills
- `GET /api/v1/public/experience` - Get work experience
- `GET /api/v1/public/projects` - Get all projects
- `POST /api/v1/public/contact` - Submit contact form
- `POST /api/v1/public/analytics/view` - Track page view

### Auth Endpoints
- `POST /api/v1/auth/login` - Admin login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout

### Admin Endpoints (Auth Required)
- `PUT /api/v1/admin/profile` - Update profile
- `POST/PUT/DELETE /api/v1/admin/projects` - Manage projects
- `POST/PUT/DELETE /api/v1/admin/skills` - Manage skills
- `POST/PUT/DELETE /api/v1/admin/experience` - Manage experience
- `GET /api/v1/admin/contacts` - View contact submissions
- `GET /api/v1/admin/analytics/overview` - Get analytics dashboard data

## 🎨 Frontend Tech Stack

### Public Website
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- GSAP (scroll animations)
- React Hook Form + Zod (form validation)
- next-themes (dark mode)

### Admin Panel
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit (state management)
- Chart.js (analytics)
- React Hook Form + Zod
- TanStack Table (data tables)

## 🔧 Backend Tech Stack

- Node.js 20+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- JWT authentication
- Bcrypt
- Helmet.js
- Express Rate Limit
- Zod validation

## 📝 Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** and test locally

3. **Run linting and tests**
   ```bash
   yarn lint
   yarn test
   ```

4. **Build for production**
   ```bash
   yarn build
   ```

5. **Commit and push**
   ```bash
   git commit -m "feat: your feature"
   git push origin feature/your-feature
   ```

## 🚢 Deployment

### Using Docker (Recommended)

1. **Build production images:**
   ```bash
   yarn docker:build
   ```

2. **Deploy to server:**
   - Copy `docker-compose.yaml`, `nginx/`, `docker/` to your server
   - Set up environment variables
   - Run `docker-compose up -d`

### AWS EC2 Deployment

See `scripts/deploy.sh` and `scripts/setup-ec2.sh` for deployment automation.

## 📈 Performance

- Redis caching for all public API endpoints (1-hour TTL)
- Next.js image optimization
- Code splitting and lazy loading
- Gzip compression via Nginx
- Database query optimization with Prisma

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run backend tests
yarn workspace @portfolio/server test

# Run with coverage
yarn workspace @portfolio/server test --coverage
```

## 📄 License

MIT

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!
