# Next.js Authentication Starter

A production-ready authentication starter built with Next.js 14, featuring advanced security measures and comprehensive user management.

## Demo

Experience the authentication system in action: [Live Demo](https://pinit-nu.vercel.app)

## Features

- 🔐 Advanced Authentication System

  - Email/Password authentication
  - OAuth support (Google, GitHub)
  - Two-factor authentication (2FA)
  - Email verification
  - Password reset functionality
  - Rate limiting
  - Session management
  - Role-based access control (RBAC)

- 🛡️ Security Features

  - JWT-based sessions
  - CSRF protection
  - Advanced Rate Limiting
  - IP and Email-based protection
  - Sliding window algorithm
  - Real-time countdown feedback
  - Secure password hashing
  - XSS protection
  - HTTP-only cookies

- 🏗️ Modern Stack
  - Next.js 14 (App Router)
  - TypeScript
  - Prisma ORM
  - PostgreSQL
  - Tailwind CSS
  - Shadcn/UI Components
  - Server Actions
  - Email Integration (Resend)

## Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- Redis database (for rate limiting)
- npm or yarn
- Git

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/auth-starter.git
   cd auth-starter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the following required environment variables:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_URL`: Your application URL
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`
   - OAuth credentials (if using):
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
   - `RESEND_API_KEY`: For email functionality
   - Rate Limiting (Required):
     - `UPSTASH_REDIS_URL`: Your Upstash Redis REST URL
     - `UPSTASH_REDIS_TOKEN`: Your Upstash Redis REST Token

4. Initialize the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── src/
│   ├── actions/        # Server actions for form handling
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable UI components
│   ├── lib/          # Core utilities and configurations
│   ├── schemas/      # Validation schemas
│   └── types/        # TypeScript type definitions
```

## Authentication Flow

1. **Email/Password Authentication**

   - User registration with email verification
   - Secure password hashing using bcrypt
   - Optional 2FA using time-based tokens

2. **OAuth Authentication**

   - Seamless integration with Google and GitHub
   - Automatic account linking
   - Profile information syncing

3. **Session Management**
   - JWT-based sessions
   - Secure HTTP-only cookies
   - Automatic token rotation

## Production Deployment Checklist

- [ ] Update environment variables
- [ ] Configure production database
- [ ] Set up email provider
- [ ] Enable rate limiting
- [ ] Configure CORS settings
- [ ] Set up monitoring
- [ ] Enable error tracking
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

## Security Considerations

- All passwords are hashed using bcrypt
- Sessions are managed using secure HTTP-only cookies
- CSRF protection is enabled by default
- Rate limiting prevents brute force attacks
- Email verification prevents account abuse
- 2FA adds an extra layer of security

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License
