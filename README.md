# 🚀 Vue.js Todo List Application

A modern, feature-rich todo list application built with Vue 3, TypeScript, and Tailwind CSS. This application provides both table and kanban board views for managing tasks with drag-and-drop functionality, inline editing, and comprehensive task management features.

## ✨ Features

- **📊 Dual View Modes**: Switch between table view and kanban board
- **🎯 Drag & Drop**: Move tasks between status columns in kanban view
- **✏️ Inline Editing**: Edit tasks directly in the table view
- **🔍 Real-time Search**: Search tasks with debounced input
- **📅 Date Management**: VueDatePicker integration for due dates
- **👥 Developer Assignment**: Multi-select developer assignment
- **🎨 Dark Theme**: Beautiful dark UI with custom styling
- **📱 Responsive Design**: Works on desktop and mobile devices
- **⚡ Fast Performance**: Built with Vite for lightning-fast development

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **State Management**: Pinia for reactive state management
- **HTTP Client**: Axios for API communication
- **Date Picker**: VueDatePicker (@vuepic/vue-datepicker)
- **Icons**: Font Awesome for beautiful icons
- **Build Tool**: Vite for fast development and building
- **Testing**: Vitest for unit testing
- **Linting**: ESLint for code quality

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (version 16.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control - [Download here](https://git-scm.com/)

## 🚀 Getting Started

Follow these step-by-step instructions to get the project running on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/dzulfiardev/todolist-frontend.git
cd todolist-frontend
```

### 2. Install Dependencies

Install all required packages using npm:

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then configure your environment variables:

```env
# API Configuration
API_URL=http://localhost:8000/api

# App Configuration
APP_NAME=Todo List App
APP_VERSION=1.0.0

# Environment
NODE_ENV=development
```

**Important Configuration Notes:**
- **API_URL**: Replace with your actual backend API URL
- **APP_NAME**: Customize your application name
- **NODE_ENV**: Set to `production` when deploying

*Note: Never commit your `.env` file to version control as it may contain sensitive information*

### 4. Start Development Server

Launch the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Open in Browser

Navigate to `http://localhost:5173` in your web browser to see the application running!

## 📂 Project Structure

```
src/
├── api/              # API configuration and endpoints
│   ├── axios.ts      # Axios configuration
│   └── todoApi.ts    # Todo API methods
├── assets/           # Static assets (images, styles)
├── components/       # Vue components
│   └── TodoList/     # Todo-specific components
│       ├── KanbanBoard.vue    # Kanban board view
│       ├── TodoListTable.vue  # Table view
│       └── Tools.vue          # Toolbar with actions
├── router/           # Vue Router configuration
├── stores/           # Pinia state management
│   └── useTodoList.ts # Main todo store
├── views/            # Page components
└── main.ts          # Application entry point
```

## 🎯 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run lint` | Lint code with ESLint |
| `npm run type-check` | Type check with vue-tsc |

## 🔧 Development Workflow

### Adding New Features

1. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the existing code patterns

3. **Test your changes**:
   ```bash
   npm run test:unit
   npm run lint
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use **TypeScript** for all new files
- Follow **Vue 3 Composition API** patterns
- Use **Tailwind CSS** for styling
- Add **proper type definitions** for all props and data
- Write **meaningful commit messages** following conventional commits

## 🎨 Customization

### Themes

The application uses a dark theme by default. You can customize colors in:
- `tailwind.config.js` for global theme colors
- Component styles for specific customizations

### API Configuration

Update the API configuration in `src/api/axios.ts`:

```typescript
const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8000/api',
  // ... other configurations
})
```

Make sure your `.env` file contains the correct API_URL for your backend service.

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use a different port
npm run dev -- --port 3000
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Type check the project
npm run type-check
```

### Getting Help

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Node.js version: `node --version`
3. Ensure all dependencies are installed: `npm install`
4. Check if the backend API is running and accessible

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

## 📱 Features Overview

### Table View
- ✅ Sortable columns
- ✅ Inline editing for all fields
- ✅ Bulk selection and deletion
- ✅ Developer assignment with avatars
- ✅ Status color coding

### Kanban Board
- ✅ Drag and drop between columns
- ✅ Status-based task organization
- ✅ Card-based task display
- ✅ Real-time updates

### Task Management
- ✅ Create tasks with full details
- ✅ Edit all task properties
- ✅ Delete single or multiple tasks
- ✅ Search and filter functionality

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👨‍💻 Author

**Dzulfikar** - [GitHub Profile](https://github.com/dzulfiardev)

---

Happy coding! 🎉 If you have any questions or need help, feel free to open an issue or reach out.
