# MEAN Stack Messaging Application

A full-stack messaging application built with MongoDB, Express.js, Angular, and Node.js (MEAN stack). This application provides a comprehensive messaging platform with user management, role-based access control, and admin functionality.

## 🚀 Features

### User Features
- **Authentication**: Secure login/logout with JWT tokens
- **Messaging System**: 
  - Send messages to other users
  - Inbox to view received messages
  - Outbox to view sent messages
  - Message deletion functionality
- **User Profile**: Personal information management

### Admin Features
- **User Management**: Create, read, update, and delete users
- **System Logging**: Monitor all API requests and system activities
- **Admin Dashboard**: Comprehensive view of system activities

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Angular** - Frontend framework
- **TypeScript** - Programming language
- **Angular Forms** - Form handling
- **Angular HTTP Client** - API communication
- **ngx-pagination** - Pagination component

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (v4.4 or higher)
- **Angular CLI** (v12 or higher)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd messaging-app-mean-stack-main
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install additional dependencies if needed
npm install bcrypt http-errors jsonwebtoken

# Start MongoDB service (ensure MongoDB is running on port 27017)
# Default connection: mongodb://127.0.0.1:27017/db

# Start the backend server
node index.js
# OR for development with auto-restart
npm install -g nodemon
nodemon index.js
```

The backend server will start on `http://localhost:4000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd src

# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli

# Install frontend dependencies
npm install

# Start the Angular development server
ng serve
```

The frontend application will be available at `http://localhost:4200`

## 🔑 Default Admin Credentials

The application automatically creates an admin user on first startup:

- **Username**: `alp`
- **Password**: `alp`
- **Email**: `alp@srdc.com`

## 📱 Usage

### For Regular Users
1. **Login**: Use your credentials to access the application
2. **Send Messages**: Navigate to "Send Message" to compose new messages
3. **Inbox**: View and manage received messages
4. **Outbox**: View your sent messages

### For Administrators
1. **User Management**: Access user list, create/edit/delete users
2. **System Logs**: Monitor system activities and API requests
3. **All User Features**: Admins have access to all regular user features

## 🌐 API Endpoints

### Authentication
- `POST /api/user/login` - User login
- `GET /api/user/logout` - User logout

### User Management
- `GET /api/users` - Get all users (Admin only)
- `POST /api/user` - Create new user
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

### Messaging
- `POST /api/message` - Send new message
- `GET /api/messages/inbox/:username` - Get inbox messages
- `GET /api/messages/outbox/:username` - Get outbox messages
- `PUT /api/message/:id` - Update message (delete functionality)

### Logging (Admin only)
- `GET /api/logs` - Get system logs
- `POST /api/log` - Create log entry

## 📁 Project Structure

```
messaging-app-mean-stack-main/
├── backend/                    # Backend (Node.js/Express)
│   ├── index.js               # Main server file
│   ├── models/                # MongoDB models
│   │   ├── User.js           # User schema
│   │   ├── Message.js        # Message schema
│   │   └── Log.js            # Log schema
│   ├── routes/               # API routes
│   │   ├── user.route.js     # User-related routes
│   │   ├── message.route.js  # Message-related routes
│   │   └── log.route.js      # Log-related routes
│   ├── middleware/           # Custom middleware
│   │   └── logging.js        # Request logging middleware
│   ├── utils/               # Utility functions
│   │   └── auth.js          # Authentication utilities
│   └── package.json         # Backend dependencies
│
└── src/                      # Frontend (Angular)
    ├── app/
    │   ├── admin-components/     # Admin-only components
    │   │   ├── user-list/       # User management
    │   │   ├── user-edit-create/ # User creation/editing
    │   │   └── log/             # System logs
    │   ├── common-components/    # Shared components
    │   │   ├── inbox/           # Message inbox
    │   │   ├── outbox/          # Message outbox
    │   │   └── send-message/    # Message composition
    │   ├── auth-service/        # Authentication service
    │   ├── api-service/         # API communication service
    │   ├── login/              # Login component
    │   ├── menu/               # Navigation menu
    │   └── model/              # TypeScript models
    ├── assets/                 # Static assets
    └── index.html              # Main HTML file
```

## 🔧 Configuration

### Database Configuration
The application connects to MongoDB using the following default configuration:
- **Host**: `127.0.0.1`
- **Port**: `27017`
- **Database**: `db`

To modify the database connection, edit the connection string in `backend/index.js`:
```javascript
await mongoose.connect("mongodb://127.0.0.1:27017/db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Port Configuration
- **Backend**: Port 4000 (configurable via `process.env.PORT`)
- **Frontend**: Port 4200 (Angular default)

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on your system
   - Check the connection string in `backend/index.js`
   - Verify MongoDB is accessible on port 27017

2. **CORS Issues**
   - The backend is configured to allow CORS
   - Ensure frontend is running on port 4200

3. **Authentication Issues**
   - Check if JWT tokens are being stored correctly in localStorage
   - Verify the backend JWT secret configuration

4. **Module Not Found Errors**
   - Run `npm install` in both backend and frontend directories
   - Check for missing dependencies and install them

## 📝 Development Notes

- The application uses JWT tokens for authentication
- Passwords are hashed using bcrypt
- The frontend uses Angular reactive forms for form handling
- Pagination is implemented using ngx-pagination
- Request logging middleware tracks all API calls
- Admin users have additional privileges for user management and system monitoring

---

**Note**: This repository contains only the "backend" and "src" folders of the complete project. Ensure you have the required dependencies installed and MongoDB running before starting the application.
