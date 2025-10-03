# 🍽️ TasteTrail - Smart Meal Planner

A comprehensive meal planning application with drag-and-drop functionality, built with React and Node.js.

## ✨ Features

- **🔐 User Authentication**: Secure login/register system with JWT tokens
- **📋 Meal Planning**: Interactive weekly meal planner with drag & drop
- **🍳 Recipe Management**: Browse 18+ curated recipes across diet categories
- **📱 Responsive Design**: Beautiful UI with modern gradient design
- **💾 Data Persistence**: File-based storage with JSON database
- **🔍 Recipe Details**: Popup modals with detailed recipe information
- **🛒 Shopping List**: Integrated shopping list functionality
- **👤 User Profiles**: Personal profile management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.16.0 or higher)
- npm (v9.5.1 or higher)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vikasyadav068/Meal_Planner.git
   cd Meal_Planner
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

## 🏃‍♂️ Running the Application

### Method 1: Two Terminal Setup

**Terminal 1 - Backend Server:**
```bash
cd "path/to/Meal_Planner"
node app.js
```

**Terminal 2 - Frontend Server:**
```bash
cd "path/to/Meal_Planner"
npx serve -s frontend/build -l 3000
```

### Method 2: One-Line Command (Windows)
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node app.js"; Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx serve -s frontend/build -l 3000"
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 🔑 Default Login Credentials

- **Email**: `abc@gmail.com`
- **Password**: `1111111`

## 📁 Project Structure

```
Meal_Planner/
├── 📂 frontend/              # React frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable components
│   │   ├── 📂 pages/         # Page components
│   │   ├── 📂 contexts/      # React contexts
│   │   └── 📄 App.js         # Main app component
│   ├── 📂 public/            # Static assets
│   └── 📂 build/             # Production build
├── 📂 routes/                # API routes
├── 📂 models/                # Data models
├── 📂 middleware/            # Express middleware
├── 📄 app.js                 # Express server
├── 📄 data.json              # File-based database
└── 📄 package.json           # Backend dependencies
```

## 🎯 Key Features Explained

### 🎨 Drag & Drop Meal Planning
- Drag recipes from the recipe carousel to meal slots
- Visual feedback during drag operations
- Persistent meal plan storage

### 🍳 Recipe Management
- 18 curated recipes across multiple diet categories
- Detailed recipe information in popup modals
- Recipe filtering and browsing

### 🔐 Authentication System
- Secure bcrypt password hashing
- JWT token-based authentication
- Protected routes and middleware

### 💾 Data Storage
- File-based JSON storage for simplicity
- User data, recipes, and meal plans persistence
- Easy backup and migration

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Touch-friendly drag & drop
- Optimized for all screen sizes

## 🎨 UI/UX Features

- **Modern Gradient Design**: Beautiful purple-to-blue gradients
- **Glass Morphism Effects**: Translucent cards with backdrop filters
- **Smooth Animations**: Hover effects and transitions
- **Interactive Elements**: Drag & drop with visual feedback
- **Modal Popups**: Recipe details in overlay modals

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get specific recipe

### Meal Plans
- `GET /api/mealplan` - Get user meal plans
- `POST /api/mealplan` - Create/update meal plan

## 🚀 Deployment

The application can be deployed to:
- **Heroku** - For backend API
- **Netlify/Vercel** - For frontend
- **Digital Ocean** - Full stack deployment
- **AWS** - Scalable cloud deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vikas Yadav**
- GitHub: [@Vikasyadav068](https://github.com/Vikasyadav068)
- Repository: [Meal_Planner](https://github.com/Vikasyadav068/Meal_Planner)

## 🙏 Acknowledgments

- Recipe data curated from various cooking sources
- Icons and design inspiration from modern UI libraries
- Community feedback and testing

---

### 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Kill existing processes
taskkill /f /im node.exe  # Windows
# or
pkill node  # Linux/Mac
```

**Memory Issues with npm start:**
```bash
# Use production build instead
npm run build
npx serve -s build -l 3000
```

**Dependencies Issues:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

Made with ❤️ by Vikas Yadav