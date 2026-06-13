# AI Virtual Assistant

A full-stack AI-powered virtual assistant web application that lets users chat with an AI assistant, manage their account securely, and customize the assistant's appearance and name.

🔗 **Live Demo:** 

---

## ✨ Features

- 🔐 **Secure Authentication** — Sign up and sign in with an access token & refresh token system for safe, persistent sessions
- 💬 **AI-Powered Chat** — Real-time conversational assistant powered by the Groq API
- 🖥️ **Dashboard** — Central hub to interact with the assistant
- 🎨 **Customization** — Personalize the assistant's name and profile picture
- ⚡ **Fast & Scalable** — Redis caching for improved performance
- 🐳 **Dockerized** — Easy deployment with Docker

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/)

**Backend**
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) — Database
- [Redis](https://redis.io/) — Caching / session management
- [Groq API](https://groq.com/) — AI model access

**Authentication**
- JWT-based Access Token & Refresh Token system

**Deployment**
- Docker (server containerized)

---

## 📂 Pages

| Page | Description |
|------|-------------|
| **Sign Up** | Create a new user account |
| **Sign In** | Log in to an existing account |
| **Dashboard** | Main interface to chat with the assistant |
| **Customize** | Update assistant's name and profile picture |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB instance
- Redis instance
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prachi-Gupta456/VIRTUAL-ASSISTANT.git
   cd VIRTUAL-ASSISTANT
   ```

2. **Set up environment variables**

   Create a `.env` file in the server directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_connection_string
   GROQ_API_KEY=your_groq_api_key
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```

   Create a `.env.local` file in the client (Next.js) directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

3. **Install dependencies**

   Backend:
   ```bash
   cd server
   npm install
   ```

   Frontend:
   ```bash
   cd client
   npm install
   ```

### Running Locally

**Backend**
```bash
cd server
npm run dev
```

**Frontend**
```bash
cd client
npm run dev
```

The app should now be running at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 🐳 Running with Docker

The server is dockerized for easy setup and deployment.

```bash
cd server
docker build -t virtual-assistant-server .
docker run -p 5000:5000 --env-file .env virtual-assistant-server
```

Or, if using Docker Compose:
```bash
docker-compose up -d
```

---

## 🔑 Authentication Flow

1. User signs up / logs in and receives:
   - **Access Token** — short-lived, used to authorize API requests
   - **Refresh Token** — long-lived, used to generate a new access token
2. Access tokens are sent with each authenticated request
3. When the access token expires, the refresh token is used to silently issue a new one, keeping the user logged in securely

---

👤 Author
- **Prachi Gupta**

---

## 🙌 Acknowledgements

- [Groq](https://groq.com/) for AI model access
- [Next.js](https://nextjs.org/) and [Express.js](https://expressjs.com/) communities
