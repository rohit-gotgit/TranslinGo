<div align="center">

# TranslinGo

Real-Time Communication Infrastructure for Modern Web Applications

<br>

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Socket.IO-Real--Time%20Messaging-010101?logo=socket.io&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-Authentication-orange" />

</div>

---

## Overview

Translingo is a real-time chat application designed for secure and efficient communication. Built with Socket.io, it enables seamless instant messaging and file sharing, allowing users to send images, documents, and media effortlessly. The platform leverages Multer and Cloudinary for cloud-based file storage, ensuring optimized performance, accessibility, and data persistence. A robust authentication system safeguards user accounts and conversations, with potential end-to-end encryption to enhance privacy and security.

---

##  About the Project

**Translingo** is a full-stack real-time chat application designed to facilitate seamless communication across different languages. The application supports both one-on-one direct messages and group channels, enabling users to connect and communicate instantly.

### Key Highlights

-  **Real-time Communication**: Instant message delivery using WebSocket technology
-  **Secure Authentication**: JWT-based authentication with HTTP-only cookies
-  **File Sharing**: Upload and share images, documents via Cloudinary
-  **Group Channels**: Create and manage group conversations
-  **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
-  **Production Ready**: Deployed on scalable cloud infrastructure

---

##  Features

### Core Functionality
-  **Real-time Messaging**: Instant bidirectional communication using Socket.io
-  **Direct Messages**: Private one-on-one conversations
-  **Group Channels**: Create channels, add/remove members, manage permissions
-  **File Sharing**: Upload images and documents (up to 10MB)
-  **User Profiles**: Customizable profiles with avatar uploads
-  **Contact Management**: Search and manage contacts
-  **Message History**: Persistent message storage and retrieval
-  **Emoji Support**: Rich emoji picker for expressive messaging

### User Experience
-  **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
-  **Loading States**: Visual feedback for all async operations
-  **Form Validation**: Real-time validation with helpful error messages
-  **Error Handling**: Graceful error boundaries and user-friendly messages
-  **Smooth Animations**: Polished UI with Framer Motion animations

### Security & Performance
-  **Rate Limiting**: Protection against abuse (API, Auth, Upload endpoints)
-  **Input Validation**: Comprehensive validation on client and server
-  **File Validation**: Type and size validation for uploads
-  **Password Hashing**: Bcrypt with salt rounds
-  **CORS Protection**: Configured for secure cross-origin requests

---

##  How It Works

### Architecture Overview

Translingo follows a **client-server architecture** with real-time WebSocket communication:

```
┌─────────────┐         HTTP/REST API          ┌─────────────┐
│   React     │◄──────────────────────────────►│   Express   │
│   Client    │                                │   Server    │
└─────────────┘                                └─────────────┘
       │                                             │
       │         WebSocket (Socket.io)               │
       └─────────────────────────────────────────────┘
                                                     │
                                                     ▼
                                            ┌─────────────┐
                                            │   MongoDB   │
                                            │  Database   │
                                            └─────────────┘
                                                     │
                                                     ▼
                                            ┌─────────────┐
                                            │ Cloudinary  │
                                            │ File Storage│
                                            └─────────────┘
```

### Real-time Communication Flow

1. **User Authentication**:
   - User logs in → Server validates credentials → JWT token generated
   - Token stored in HTTP-only cookie → Client receives user data
   - Socket connection established with user ID

2. **Sending Messages**:
   - User types message → Client emits Socket.io event
   - Server receives event → Message saved to MongoDB
   - Server broadcasts to recipient(s) → Real-time delivery

3. **Receiving Messages**:
   - Server emits Socket.io event to recipient
   - Client receives event → Redux state updated → UI re-renders
   - Message appears instantly in chat interface

4. **File Uploads**:
   - User selects file → Client validates (type, size)
   - File uploaded via Multer → Stored temporarily
   - Uploaded to Cloudinary → URL returned
   - Message with file URL saved to database

### State Management

- **Frontend**: Redux Toolkit for global state management
  - Auth slice: User authentication state
  - Chat slice: Selected chat and messages
  - Channel slice: User's channels
  - Contact slice: Contacts and DMs

- **Backend**: RESTful API with Socket.io for real-time updates

---

##  Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI library |
| Redux Toolkit | 2.5.0 | State management |
| React Router DOM | 7.1.1 | Client-side routing |
| Socket.io Client | 4.8.1 | Real-time communication |
| Axios | 1.7.9 | HTTP client |
| Tailwind CSS | 3.4.17 | Utility-first CSS |
| Framer Motion | 12.0.0 | Animation library |
| Vite | 6.0.5 | Build tool |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest LTS | Runtime environment |
| Express.js | 4.21.2 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.9.5 | ODM for MongoDB |
| Socket.io | 4.8.1 | WebSocket server |
| JWT | 9.0.2 | Authentication tokens |
| Bcrypt | 5.1.1 | Password hashing |
| Cloudinary | 2.5.1 | Cloud file storage |
| Multer | 1.4.5 | File upload handling |
| Express Rate Limit | Latest | Rate limiting |

---

##  Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account ([Sign up here](https://cloudinary.com/users/register_free))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Translingo.git
cd Translingo
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017
# Or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRY=7d

ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the server:

```bash
npm run dev
```

The server will run on `http://localhost:3001`

#### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_SOCKET_SERVER_URL=http://localhost:3001
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

#### 4. Seed Database (Optional)

To populate the database with sample data for testing:

```bash
cd server
npm run seed
```

This will create:
- **12 users** (all with password: `Password123`)
- **Direct messages** between users over the past month
- **5 channels** with members and messages
- **File messages** for variety

**Login Credentials:**
- Email: Any user email from the seed (e.g., `rahul.sharma@example.com`)
- Password: `Password123`

 **Note**: This will delete all existing data in the database!

For more details, see [server/src/scripts/README.md](server/src/scripts/README.md)

---

##  Database Schema

### User Model

```javascript
{
  email: String (required, unique, validated),
  password: String (required, minlength: 8, hashed),
  firstName: String,
  lastName: String,
  age: Number (min: 10, max: 99),
  avatar: String (Cloudinary URL),
  token: String (JWT token)
}
```

**Methods:**
- `isPasswordCorrect(password)` - Compares password with hashed version
- `generateToken()` - Generates JWT token for authentication

**Hooks:**
- `pre('save')` - Automatically hashes password before saving

### Message Model

```javascript
{
  sender: ObjectId (ref: 'User', required),
  recipient: ObjectId (ref: 'User'), // null for channel messages
  messageType: String (enum: ['text', 'file'], required),
  content: String (required if messageType is 'text'),
  fileUrl: String (required if messageType is 'file'),
  timestamp: Date (default: Date.now)
}
```

**Relationships:**
- `sender` → References User model
- `recipient` → References User model (null for channel messages)

### Channel Model

```javascript
{
  name: String (required),
  members: [ObjectId] (ref: 'User', required),
  admin: ObjectId (ref: 'User', required),
  messages: [ObjectId] (ref: 'Message'),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Relationships:**
- `members[]` → Array of User references
- `admin` → References User model (channel creator)
- `messages[]` → Array of Message references

**Hooks:**
- `pre('save')` - Updates `updatedAt` timestamp
- `pre('findOneAndUpdate')` - Updates `updatedAt` on updates

### Database: `chatApp`

All models are stored in the MongoDB database named `chatApp`.

---

##  API Documentation

### Base URL
```
Development: http://localhost:3001/api/v1
Production: https://your-service-url.run.app/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/getUserDetails` | Get current user details | Yes |
| POST | `/auth/updateDetails` | Update user profile | Yes |
| POST | `/auth/updateAvatar` | Upload/update avatar | Yes |
| PUT | `/auth/deleteAvatar` | Delete user avatar | Yes |
| POST | `/auth/resetPassword` | Reset password | No |

### Contact Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contact/search` | Search for contacts | Yes |
| GET | `/contact/getContactsForDM` | Get contacts for DMs | Yes |
| GET | `/contact/getAllContacts` | Get all contacts | Yes |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/chat/getMessages` | Get messages between users | Yes |
| POST | `/chat/uploadFile` | Upload file for chat | Yes |

### Channel Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/channel/createChannel` | Create new channel | Yes |
| GET | `/channel/getUserChannel` | Get user's channels | Yes |
| GET | `/channel/getChannelMessages/:channelId` | Get channel messages | Yes |
| GET | `/channel/getChannelDetails/:channelId` | Get channel details | Yes |
| POST | `/channel/addMemberToChannel/:channelId` | Add member to channel | Yes |
| POST | `/channel/removeMemberFromChannel/:channelId` | Remove member from channel | Yes |
| DELETE | `/channel/deleteChannel/:channelId` | Delete channel | Yes |

### Socket.io Events

**Client → Server:**
- `sendMessage` - Send direct message
- `send-channel-message` - Send message to channel

**Server → Client:**
- `receiveMessage` - Receive direct message
- `receive-channel-message` - Receive channel message

---

##  Deployment

### Backend: Google Cloud Run

The backend is deployed on **Google Cloud Run**, a serverless platform that scales automatically.

**Deployment Steps:**

1. **Prerequisites:**
   ```bash
   # Install Google Cloud SDK
   # Install Docker
   ```

2. **Set Project ID:**
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   ```

3. **Deploy:**
   ```bash
   cd server
   chmod +x deploy.sh
   ./deploy.sh
   ```

**Configuration:**
- **Platform**: Google Cloud Run
- **Region**: us-central1
- **Scaling**: Min instances: 0, Max instances: 10
- **Resources**: 1 CPU, 512Mi memory
- **Cost**: Free tier (2M requests/month), then pay-per-use

**Environment Variables** (set in Cloud Run):
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - Token expiry (e.g., "7d")
- `ORIGIN` - Frontend URL for CORS
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Frontend: Vercel

The frontend is deployed on **Vercel** for optimal performance and CDN distribution.

**Deployment Steps:**

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL` - Backend API URL
   - `VITE_SOCKET_SERVER_URL` - Socket server URL
   - `VITE_CLOUDINARY_API_KEY` - Cloudinary API key
3. Deploy automatically on push to main branch

**Configuration:**
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

---

##  Live Demo

### Production URLs

- **Frontend**: [https://translingo-mu.vercel.app](https://translingo-mu.vercel.app) 
- **Backend API**: Deployed on Google Cloud Run

### Try It Out

Visit the live application and experience real-time chat functionality:
- Create an account or use test credentials
- Start chatting with other users
- Create and join channels
- Share files and images

**Test Credentials:**
- Email: Any seeded user email (e.g., `rahul.sharma@example.com`)
- Password: `Password123`

*Note: If database is seeded, you can use any of the 12 pre-created accounts*

---

##  Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React App  │  │  Redux Store │  │ Socket Client│       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST + WebSocket
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Express    │  │  Socket.io   │  │  Middlewares │       │
│  │     API      │  │    Server    │  │  (Auth, etc) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   MongoDB    │  │  Cloudinary  │  │   JWT Store  │       │
│  │  (Messages,  │  │  (File Store)│  │  (Cookies)   │       │
│  │   Users,     │  │              │  │              │       │
│  │  Channels)   │  │              │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Authentication Request:**
   ```
   Client → Express API → MongoDB (validate) → JWT Generation → HTTP-only Cookie → Client
   ```

2. **Message Send:**
   ```
   Client → Socket.io → Server (save to MongoDB) → Socket.io Broadcast → Recipient Client
   ```

3. **File Upload:**
   ```
   Client → Express API (Multer) → Temporary Storage → Cloudinary → MongoDB (save URL) → Client
   ```

---

##  Security Features

### Authentication & Authorization
-  **JWT Tokens**: Secure token-based authentication
-  **HTTP-only Cookies**: Prevents XSS attacks
-  **Password Hashing**: Bcrypt with salt rounds
-  **Protected Routes**: Middleware verification for all sensitive endpoints

### Rate Limiting
-  **API Endpoints**: 100 requests per 15 minutes per IP
-  **Authentication**: 5 attempts per 15 minutes per IP
-  **File Uploads**: 10 uploads per hour per IP

### Input Validation
-  **Client-side**: Real-time validation with helpful error messages
-  **Server-side**: Comprehensive validation for all inputs
-  **File Validation**: Type and size validation (max 10MB)
-  **Email Validation**: Regex pattern matching
-  **Password Requirements**: Minimum 8 characters

### Data Protection
-  **CORS Configuration**: Restricted to allowed origins
-  **Environment Variables**: Sensitive data stored securely
-  **Error Handling**: No sensitive data exposed in error messages
-  **SQL Injection Prevention**: Using Mongoose ODM (NoSQL)

---

##  Performance Optimizations

### Frontend
-  **Code Splitting**: Lazy loading with React Router
-  **Memoization**: React.memo and useMemo for expensive computations
-  **Optimized Images**: Cloudinary CDN for fast image delivery
-  **Bundle Optimization**: Vite for fast builds and HMR

### Backend
-  **Database Indexing**: Indexed fields for faster queries
-  **Connection Pooling**: MongoDB connection reuse
-  **File Streaming**: Efficient file upload handling
-  **Caching**: Socket.io connection reuse

### Infrastructure
-  **CDN**: Vercel CDN for static assets
-  **Auto-scaling**: Cloud Run scales based on traffic
-  **Serverless**: Pay only for what you use
-  **Geographic Distribution**: Vercel edge network

---

##  Project Structure

```
Translingo/
├── client/                      # Frontend React Application
│   ├── public/                  # Static assets
│   │   ├── readme_logo.png      # Logo
│   │   └── readme_main.png      # Main preview image
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── Pages/               # Page components
│   │   │   ├── Homepage.jsx    # Login/Signup
│   │   │   ├── Signup.jsx      # Profile setup
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── chats/          # Chat interface
│   │   ├── Redux/               # State management
│   │   │   ├── store.js
│   │   │   └── slices/         # Redux slices
│   │   ├── lib/                # Utilities
│   │   │   ├── axiosInstance.js
│   │   │   └── utils.js
│   │   ├── utils/              # Helpers
│   │   │   ├── constants.js    # API endpoints
│   │   │   └── validation.js  # Input validation
│   │   ├── context.jsx         # Socket context
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js Application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── channel.controller.js
│   │   │   └── contact.controller.js
│   │   ├── models/             # MongoDB models
│   │   │   ├── auth.models.js  # User model
│   │   │   ├── messages.models.js
│   │   │   └── channel.models.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── channel.routes.js
│   │   │   └── contact.routes.js
│   │   ├── middlewares/        # Custom middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── multer.middleware.js
│   │   │   └── rateLimiter.middleware.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── cloudinary.js
│   │   │   └── errorHandler.js
│   │   ├── db/                 # Database connection
│   │   │   └── index.js
│   │   ├── app.js              # Express app setup
│   │   ├── index.js            # Server entry point
│   │   ├── socket.js           # Socket.io configuration
│   │   └── constants.js         # Constants
│   ├── Dockerfile              # Docker configuration
│   ├── deploy.sh              # Deployment script
│   ├── .env.example            # Environment variables template
│   └── package.json
│
└── README.md                   # This file
```

---

##  Testing

*Note: Testing infrastructure can be added*

### Manual Testing Checklist

- [x] User registration and login
- [x] Profile creation and updates
- [x] Direct message sending and receiving
- [x] Channel creation and management
- [x] File upload and sharing
- [x] Real-time message delivery
- [x] Error handling and validation
- [x] Responsive design on different devices

---

##  Known Issues & Solutions

### Fixed Issues
-  Fixed dotenv path configuration in server
-  Fixed missing `path` import in Cloudinary utility
-  Replaced hardcoded URLs with environment variables
-  Fixed double slash bug in API constants
-  Added comprehensive input validation
-  Added loading states for better UX
-  Added React error boundaries
-  Added rate limiting for security
-  Added file upload validation

---

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

This project is licensed under the ISC License.

---

##  Author

**Rohit Kumar**

---

##  Acknowledgments

- [Socket.io](https://socket.io/) - Real-time communication
- [Cloudinary](https://cloudinary.com/) - Cloud file storage
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Vercel](https://vercel.com/) - Frontend hosting
- [Google Cloud](https://cloud.google.com/) - Backend hosting
- All the amazing open-source libraries that made this project possible


