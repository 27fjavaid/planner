# Planner App

A full-stack Notion-style productivity app built with Spring Boot and React.

## Features

- **Authentication** — Secure JWT-based login and registration
- **Pages & Notes** — Create and edit pages with a rich text editor
- **Sidebar Navigation** — Collapsible page tree with nested subpages
- **Kanban Board** — Drag-and-drop task management with To Do / In Progress / Done columns
- **Auto-save** — Pages save automatically as you type

## Tech Stack

**Backend**
- Java 21 + Spring Boot 3
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- PostgreSQL

**Frontend**
- React + Vite
- Tailwind CSS
- TipTap Rich Text Editor
- Axios

## Getting Started

### Prerequisites
- Java 21+
- PostgreSQL
- Node.js 18+

### Backend Setup
```bash
cd backend/backend
# Create a PostgreSQL database called planner_db
# Update src/main/resources/application.properties with your DB credentials
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
planner/
├── backend/          # Spring Boot REST API
│   └── src/
│       └── main/java/com/planner/backend/
│           ├── controller/   # REST endpoints
│           ├── model/        # JPA entities
│           ├── repository/   # Data access layer
│           ├── service/      # Business logic
│           └── config/       # Security configuration
└── frontend/         # React application
    └── src/
        ├── components/   # Reusable UI components
        ├── context/      # Auth context
        ├── pages/        # Login, Register, Dashboard, Kanban
        └── services/     # API client
```