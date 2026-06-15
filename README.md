# AI Platform

An AI-powered full-stack application built with React, Node.js, FastAPI, SQL Server, and OpenRouter/OpenAI integration.

## Features

### AI Chat Assistant

* AI-powered chatbot
* Markdown response rendering
* Multi-chat support
* Chat history persistence
* Rename chats
* Delete chats
* Chat session management

### Backend

* REST APIs using Node.js and Express
* SQL Server database integration
* Chat and message persistence
* Multi-session support

### AI Service

* FastAPI-based AI service
* OpenRouter/OpenAI integration
* LLM-powered responses

---

# Tech Stack

## Frontend

* React
* Axios
* React Markdown
* Remark GFM

## Backend

* Node.js
* Express.js
* MSSQL

## AI Service

* FastAPI
* OpenAI SDK
* OpenRouter

## Database

* Microsoft SQL Server

---

# Project Structure

```text
ai-platform
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   └── App.js
│   └── package.json
│
├── backend
│   ├── config
│   ├── routes
│   ├── app.js
│   └── package.json
│
├── ai-service
│   ├── main.py
│   ├── .env
│   └── requirements.txt
│
└── README.md
```

---

# Prerequisites

Install the following:

## Node.js

Recommended:

```text
Node.js 20+
```

Download:

https://nodejs.org

---

## Python

Recommended:

```text
Python 3.11+
```

Download:

https://python.org

---

## SQL Server

Install:

* SQL Server Express
* SQL Server Management Studio (SSMS)

---

# Database Setup

Create database:

```sql
CREATE DATABASE ai_platform;
GO
```

Use database:

```sql
USE ai_platform;
GO
```

Create chats table:

```sql
CREATE TABLE chats (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);
```

Create messages table:

```sql
CREATE TABLE messages (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chat_id INT,
    role VARCHAR(50),
    message NVARCHAR(MAX),
    created_at DATETIME,
    FOREIGN KEY (chat_id) REFERENCES chats(id)
);
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Example:

```env
DB_USER=sa
DB_PASSWORD=YOUR_PASSWORD
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=ai_platform

PORT=5000
```

Run backend:

```bash
npm run dev
```

Expected output:

```text
SQL Server Connected
Server running on port 5000
```

Backend URL:

```text
http://localhost:5000
```

---

# AI Service Setup

Navigate:

```bash
cd ai-service
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

Windows PowerShell:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi uvicorn openai chromadb python-dotenv pydantic
```

Create:

```text
ai-service/.env
```

Example:

```env
OPENROUTER_API_KEY=YOUR_API_KEY
```

Run AI service:

```bash
python -m uvicorn main:app --reload --port 8000
```

Expected output:

```text
Application startup complete.
```

AI URL:

```text
http://localhost:8000
```

Test:

```text
http://localhost:8000/chat
```

---

# Frontend Setup

Navigate:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run React:

```bash
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

# Application Startup Order

Start services in this order:

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd ai-service
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 3

```bash
cd frontend
npm start
```

---

# Current Features

* AI Chat
* Multiple Chats
* Chat Persistence
* Rename Chat
* Delete Chat
* Markdown Responses
* SQL Server Storage
* OpenRouter Integration

---


# Environment Variables

Backend:

```env
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_PORT=
DB_DATABASE=
PORT=
```

AI Service:

```env
OPENROUTER_API_KEY=
```

---

# License

This project is for educational and learning purposes.
