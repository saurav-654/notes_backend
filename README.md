# YardStick SaaS Notes App

A modern SaaS application for managing notes with multi-tenant architecture, user roles, and subscription plans.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## 🎯 Overview

YardStick is a multi-tenant SaaS notes application featuring:
- **Multi-tenant architecture** with FREE and PRO plans
- **Role-based access control** (Admin/Member)
- **JWT authentication** with secure sessions
- **CRUD operations** for notes management
- **Plan upgrade functionality** for admins
- **Responsive design** with dark/light mode

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Shadcn/ui
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Middleware:** CORS, Cookie Parser, Express Session
- **Deployment:** Vercel

---

## 🗄️ Database Models

### User Model (`models/User.js`)
```javascript
{
  _id: ObjectId,
  name: String,           // User's full name
  email: String,          // Unique email address (indexed)
  password: String,       // Hashed password (bcrypt)
  role: String,           // "ADMIN" | "MEMBER"
  tenantId: ObjectId,     // Reference to tenant
  createdAt: Date,
  updatedAt: Date
}
```

### Tenant Model (`models/tenent.js`)
```javascript
{
  _id: ObjectId,
  name: String,           // Tenant/Company name
  slug: String,           // Unique slug for URL (indexed)
  plan: String,           // "FREE" | "PRO"
  upgradedAt: Date,       // When plan was upgraded
  createdAt: Date,
  updatedAt: Date
}
```

### Note Model (`models/note.js`)
```javascript
{
  _id: ObjectId,
  noteId: String,         // Display ID for users
  title: String,          // Note title
  content: String,        // Note content/body
  userId: ObjectId,       // Reference to creator
  tenantId: ObjectId,     // Tenant isolation
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛣️ API Routes

### Authentication Routes
- `POST /api/login` - User authentication
- `POST /api/register` - User registration (creates tenant)
- `POST /api/logout` - User logout (clears session)

### User Management Routes
- `POST /api/adduser` - Add new team member (Admin only)

### Notes Management Routes
- `GET /api/userNotes` - Get user's notes and profile
- `POST /api/addNote` - Create new note
- `PUT /api/editNote/:id` - Update existing note
- `DELETE /api/deleteNote/:id` - Delete note

### Subscription Management Routes
- `POST /api/tenants/:slug/upgrade` - Upgrade tenant plan to PRO (Admin only)

---

## 🔐 Authentication & Authorization

### JWT Authentication
- **Token Storage:** HTTP-only cookies
- **Token Expiry:** 24 hours
- **Middleware:** `protect` middleware validates JWT and adds user to request

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ADMIN** | ✅ All note operations<br>✅ Add team members<br>✅ Upgrade tenant plan<br>✅ View tenant dashboard |
| **MEMBER** | ✅ Personal note operations<br>❌ Add users<br>❌ Upgrade plan<br>❌ Admin dashboard |

### Multi-Tenant Security
- **Data Isolation:** All queries filtered by `tenantId`
- **Tenant Scope:** Users only access their tenant's data
- **Admin Verification:** Admin actions verified against tenant ownership

---
