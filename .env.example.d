# production
NODE_ENV=development

# Database
DATABASE_URL=postgresql://portfolio:portfolio@postgres:5432/portfolio_db

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=dev-secret-key-12345
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=dev-refresh-secret-12345
JWT_REFRESH_EXPIRES_IN=30d

# AWS S3 (optional for local dev)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=portfolio-media

# Server
PORT=5000
API_VERSION=v1

# Admin Credentials
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@123

# Frontend URLs
WEB_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100


# SMTP / Nodemailer
SMTP_HOST='mail.test.com'
SMTP_PORT=587
SMTP_USER='test@test.com'
SMTP_PASS='test@test.com'
SMTP_FROM='test@test.com'

# 'k9fj **** v8px ****'
