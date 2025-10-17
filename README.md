# 🚀 CoverGenius AI

**AI-Powered Cover Letter Generator**

CoverGenius AI is a sophisticated full-stack application that leverages Google's Gemini 2.0 Flash AI model to generate professional, personalized cover letters tailored to specific job descriptions and candidate resumes. Built with modern technologies and designed for scalability, it offers both registered user accounts and guest access with a flexible credit-based system.

![AI-Powered](https://img.shields.io/badge/AI-Powered-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-19.1.0-20232A?logo=react&logoColor=61DAFB) ![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?logo=nestjs&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white) ![Turbo](https://img.shields.io/badge/Turbo-2.5.4-FF6B6B?logo=turbo&logoColor=white)

## ✨ Features

### 🎯 Core Functionality

- **AI-Powered Generation**: Uses Google Gemini 2.0 Flash for intelligent cover letter creation
- **Resume Analysis**: Uploads and analyzes PDF resumes to extract relevant information
- **Job Matching**: Tailors cover letters to specific job descriptions and requirements
- **Professional Templates**: Generates properly formatted, business-standard cover letters
- **Enhancement Suggestions**: Provides AI-generated improvement recommendations
- **Real-time Processing**: Fast generation with progress indicators

### 🔐 Authentication & Access

- **Dual Access Modes**:
  - Registered users with email/password authentication
  - Guest access with IP-based tracking
- **JWT Security**: Secure token-based authentication with 24-hour expiration
- **Usage Limits**: Built-in credit system to manage access
- **Email Verification**: Optional email verification for registered users

### 💳 Monetization & Credits

- **Flexible Credit System**: Different usage limits for guests vs. registered users
- **Payment Integration**: Razorpay integration for credit purchases
- **Package Options**: Multiple credit packages (Basic, Standard, Premium)
- **Order Management**: Complete payment verification and tracking
- **Turnstile Protection**: Cloudflare Turnstile for bot protection

### 🛡️ Security & Performance

- **Rate Limiting**: 10 requests per minute throttling
- **Input Validation**: Comprehensive form validation and sanitization
- **File Security**: PDF-only upload restrictions with size limits
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Sanitized error messages and proper logging

## 🏗️ Architecture

### 📁 Project Structure

```
cover-letter-ai/
├── apps/
│   ├── backend/                 # NestJS API Server
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   │   ├── decorators/ # Custom decorators
│   │   │   │   ├── dto/        # Data transfer objects
│   │   │   │   ├── guards/     # Authentication guards
│   │   │   │   └── strategies/ # Passport strategies
│   │   │   ├── credits/        # Payment & credit management
│   │   │   ├── db/             # Database schemas & service
│   │   │   │   └── schema/     # MongoDB schemas
│   │   │   ├── eval/           # AI evaluation service
│   │   │   ├── assets/         # Static resources
│   │   │   └── gemini.service.ts # Gemini AI integration
│   │   └── render.yaml         # Deployment configuration
│   └── frontend/               # React Application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   │   └── ui/         # Base UI components
│       │   ├── pages/          # Route components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── utils/          # Utility functions
│       │   ├── types/          # TypeScript type definitions
│       │   └── assets/         # Static assets
│       └── vercel.json         # Deployment configuration
├── packages/
│   ├── constants/              # Shared constants
│   ├── eslint-config/          # Shared linting rules
│   └── ts-config/              # Shared TypeScript configs
└── turbo.json                  # Monorepo configuration
```

### 🔧 Tech Stack

#### Frontend

- **Framework**: React 19.1.0 with TypeScript 5.8.3
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Styling**: TailwindCSS 4.1.8 with modern design system
- **Routing**: React Router v7.6.3 for client-side navigation
- **State Management**: React Context for authentication and modals
- **UI Components**: Custom component library with Lucide React icons
- **HTTP Client**: Axios 1.9.0 for API communication
- **Notifications**: Sonner 2.0.6 for toast notifications
- **Payment**: React Razorpay 3.0.1 for payment processing
- **Security**: React Turnstile 1.1.4 for bot protection

#### Backend

- **Framework**: NestJS 11.0.1 with TypeScript 5.7.3
- **Database**: MongoDB 8.15.1 with Mongoose ODM
- **Authentication**: Passport.js with JWT and local strategies
- **File Upload**: Cloudinary 2.6.1 for resume storage
- **AI Integration**: Google Gemini API (@google/genai 1.4.0)
- **Payment Processing**: Razorpay SDK 2.9.6
- **Security**: bcryptjs 3.0.2 for password hashing, rate limiting
- **Validation**: class-validator 0.14.2 and class-transformer 0.5.1
- **Email**: Nodemailer 7.0.5 for email notifications
- **Utilities**: Snowflake ID generation with @sapphire/snowflake 3.5.5

#### DevOps & Deployment

- **Monorepo**: Turbo 2.5.4 for efficient builds and development
- **Package Manager**: Bun 1.2.12 for fast package management
- **Frontend Hosting**: Vercel with automatic deployments
- **Backend Hosting**: Render with environment management
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: Cloudinary for resume uploads // Future Plans
- **Email Service**: Brevo (formerly Sendinblue) for SMTP

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **Bun** >= 1.2.12 (recommended) or npm/yarn
- **MongoDB** instance (local or Atlas)
- **Google Gemini API** key
- **Cloudinary** account for file uploads // Future Plans
- **Razorpay** account for payments (optional for development)
- **Brevo** account for email services (optional for development)

### 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cover-letter-ai
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DB_URI=mongodb://localhost:27017/cover-letter-ai
   # or use MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/cover-letter-ai

   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here

   # Google Gemini AI
   GEMINI_API_KEY=your-gemini-api-key

   # Cloudinary (for file uploads) // Future Plans
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Razorpay (for payments)
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-secret

   # Brevo SMTP (for email notifications)
   BREVO_SMTP_HOST=smtp-relay.brevo.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_USER=your-brevo-username
   BREVO_SMTP_KEY=your-brevo-api-key

   # URLs (adjust for production)
   BACKEND_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:5173
   VITE_API_URL=http://localhost:3000
   ```

### 🏃‍♂️ Development

**Start the development environment:**

```bash
# Start both frontend and backend
bun dev

# Or start individually
bun dev --filter=frontend    # Frontend only (http://localhost:5173)
bun dev --filter=backend     # Backend only (http://localhost:3000)
```

**Other useful commands:**

```bash
bun build                    # Build all packages
bun lint                     # Lint all packages
bun format                   # Format code with Prettier
bun check-types             # Type checking
```

### 🧪 Testing the Application

1. **Access the frontend** at `http://localhost:5173`
2. **Try guest access** - Generate 3 free cover letters without registration
3. **Create an account** - Get 10 cover letter credits upon registration
4. **Upload a resume** (PDF format) and job description
5. **Generate and download** your personalized cover letter

## 🎯 Usage Guide

### For End Users

1. **Choose Access Method**:

   - **Guest Mode**: 3 free generations, no registration required
   - **Registered User**: 10 free generations, account required

2. **Prepare Your Materials**:

   - Job description (copy/paste from job posting)
   - Resume in PDF format
   - Optional: Additional relevant information

3. **Generate Cover Letter**:

   - Fill in the job description (max 4,499 characters)
   - Upload your PDF resume
   - Add any additional information (max 500 characters)
   - Click "Generate Cover Letter"

4. **Review and Download**:
   - Preview the generated cover letter
   - Review AI suggestions for enhancement
   - Download as text file
   - Generate additional letters as needed

### Credit System

| User Type  | Free Credits   | Credit Packages                         |
| ---------- | -------------- | --------------------------------------- |
| Guest      | 3 generations  | N/A                                     |
| Registered | 10 generations | Basic (10), Standard (30), Premium (50) |

## 🔧 API Documentation

### Authentication Endpoints

```typescript
POST /auth/signup/local          # Create new user account
POST /auth/login/local           # Login with email/password
POST /auth/login/guest           # Get guest access token
GET  /auth/me                    # Get current user info
GET  /auth/check-is-alive        # API Health check
```

### Cover Letter Generation

```typescript
POST /eval/cl                    # Generate cover letter
# Requires: JWT token, job description, resume file, optional additional info
```

### Credit Management

```typescript
POST /credits/create-order       # Create payment order
POST /credits/verify-payment     # Verify and process payment
```

## 🚀 Deployment

### Frontend (Vercel)

The frontend is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL
3. Deploy automatically on push to main branch

### Backend (Render)

The backend deploys on Render using the provided `render.yaml`:

1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
# Production URLs
BACKEND_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
VITE_API_URL=https://your-backend.onrender.com

# Database (MongoDB Atlas recommended)
DB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cover-letter-ai

# All other variables same as development
```

## 🧩 Key Components

### Backend Services

- **AuthService**: Handles user registration, login, and JWT generation
- **EvalService**: Manages AI cover letter generation with Gemini
- **CreditsService**: Processes payments and manages user credits
- **DbService**: Database operations and schema management
- **GeminiService**: Direct integration with Google Gemini AI

### Frontend Components

- **CoverLetterForm**: Main form for input collection and generation
- **CoverLetterPreview**: Display and download generated content
- **AuthContext**: Global authentication state management
- **ProgressIndicator**: Multi-step form progress tracking
- **CreditsShop**: Payment and credit purchase interface
- **Modal System**: Reusable modal components for authentication

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **File Type Restrictions**: Only PDF files accepted for resumes
- **Rate Limiting**: 10 requests per minute per IP
- **JWT Expiration**: 24-hour token validity
- **Password Hashing**: bcrypt with salt rounds
- **CORS Configuration**: Restricted to known origins
- **Error Handling**: Sanitized error messages
- **Bot Protection**: Cloudflare Turnstile integration

## 📊 Monitoring & Analytics

- **Usage Tracking**: All generations logged with user attribution
- **Error Logging**: Comprehensive error tracking and reporting
- **Performance Metrics**: Request timing and success rates
- **User Analytics**: Registration, usage patterns, and conversion tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use existing ESLint and Prettier configurations
- Write descriptive commit messages
- Add proper error handling
- Update documentation for new features
- Test thoroughly before submitting PRs

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support, <a href="mailto:profile.princeraj@gmail.com">click here</a> to email me or create an issue in the repository.

## 🏆 Acknowledgments

- **Google Gemini AI** for powerful language model capabilities
- **NestJS** for excellent Node.js framework
- **React Team** for the amazing frontend library
- **TailwindCSS** for beautiful, utility-first styling
- **Vercel & Render** for reliable hosting platforms
- **Turbo** for efficient monorepo management
- **Bun** for fast package management and runtime

---

**Built with ❤️ using modern technologies and AI**
