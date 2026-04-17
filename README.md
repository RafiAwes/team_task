# Qtec Task Manager

A high-performance, full-stack task management system engineered for high-velocity teams. This application delivers a seamless, SPA-like user experience while maintaining the robust backend architecture expected in modern enterprise solutions.

## 🔗 Important Links
- **Live Production Application:** [https://team-task-pfbb.onrender.com/dashboard](https://team-task-pfbb.onrender.com/dashboard)
- **Tech Stack:** Laravel, React, Inertia.js, TiDB, Docker, Render

---

## 🚀 Technologies & Infrastructure

### Core Stack
- **Framework:** Laravel (PHP 8.4+)
- **Frontend:** React 18 + Inertia.js (Zero-API approach)
- **Styling:** Tailwind CSS (Custom Dark Mode & Glassmorphism UI)
- **Database:** TiDB Serverless (MySQL Compatible, Cloud-Native)
- **Testing:** Pest PHP (Next-gen Testing Framework)

### Infrastructure & DevOps
- **Containerization:** Multi-stage Docker optimization
- **Deployment:** Render (PaaS)
- **SSL Lifecycle:** Let's Encrypt certificates baked into the runtime
- **CI/CD Logic:** Automated builds via Dockerfile triggers

---

## 🏛 Architectural & DevOps Decisions

### Decision 1: Architecture (Inertia.js over Decoupled API)
Given the strict development timeline, **Inertia.js** was selected as the bridge between Laravel and React. This allowed for a "snappy" Single Page Application (SPA) experience without the significant overhead of maintaining a separate Redux/Context state or a decoupled REST/GraphQL API. By keeping the routing and state management primarily on the server, we achieved faster iteration cycles while delivering a premium user experience.

### Decision 2: Reliability (Mock Data & Proactive Testing)
To ensure the system is "battle-tested" from day one, we utilized **Laravel Factories and Seeders** to generate complex task hierarchies and team distributions. Reliability was further reinforced using **Pest PHP**. Pest's expressive syntax allowed us to implement high-coverage feature tests quickly, ensuring that core CRUD operations and status transitions remain stable across deployments.

### Decision 3: Product Value (AI-Powered "Smart Scope")
Standard task managers suffer from vague descriptions. The **"Smart Scope"** feature was integrated as a proactive solution. By leveraging an LLM via API, the system can auto-generate comprehensive technical descriptions from a simple task title. This demonstrates a product-first mindset: moving from a passive storage system to an active productivity partner.

### Decision 4: DevOps (Dockerization & Secure Cloud Connectivity)
The production environment is engineered for security and scale. key highlights include:
- **Base Image:** We utilize `serversideup/php:8.4-fpm-nginx` for its optimized footprint and built-in Nginx configuration.
- **Secure Database Connectivity:** TiDB Serverless requires encrypted connections. We explicitly download the **ISRG Root X1 certificate** during the Docker build stage and symlink it into the container's trusted store to ensure secure internal networking.
- **HTTPS Enforcement:** Behind Render's load balancer, we configured the `AppServiceProvider` to force HTTPS schemes, preventing mixed-content errors and ensuring all traffic is encrypted end-to-end.

---

## 💻 Local Development Setup

Follow these steps to get the environment running on your local machine.

### Prerequisites
- PHP 8.4+
- Node.js 20+
- Composer & NPM
- A local MySQL instance or a TiDB Serverless cluster

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task_manager
   ```

2. **Install Dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Note: Ensure your `.env` contains valid `DB_HOST`, `DB_USERNAME`, and `DB_PASSWORD` for your TiDB/MySQL instance.*

4. **Database Migration & Seeding:**
   ```bash
   php artisan migrate --seed
   ```
   *This will populate the system with mock users and tasks for immediate testing.*

5. **Build Assets & Start Servers:**
   ```bash
   npm run build
   # Start the development server
   php artisan serve
   ```

---

## ✨ Features
- **Task Kanban:** Fluid drag-and-drop task movement (Pending → In Progress → Completed).
- **Team Assignments:** Assign tasks to specific users with real-time status updates.
- **Task Comments:** Collaborative threads for every task.
- **Smart Scope:** (Bonus) AI-generated technical task descriptions.
- **Futuristic UI:** Deep charcoal themes with translucent cyan/purple glassmorphism elements.

---
*Created as part of the Qtec Full-Stack Assessment.*
