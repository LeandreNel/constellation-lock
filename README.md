# Constellation Lock

A creative authentication system built with the MERN stack, where users register and log in by drawing a unique star constellation pattern instead of typing a password.

---

## What is Constellation Lock?

Instead of a traditional password, users click on stars in a specific sequence on an interactive star map to create their "constellation key". This pattern is hashed and stored securely — just like a password — but the interaction is entirely visual and spatial.

---

## Creative Authentication Method

When registering, the user:
1. Enters their username and email
2. Clicks a sequence of stars on a canvas to form their constellation
3. The sequence (e.g. star IDs `[3, 17, 42, 8]`) is joined into a string and hashed using **bcrypt**

When logging in, the user:
1. Enters their email
2. Recreates their constellation by clicking the same stars in the same order
3. The sequence is compared against the stored hash using `bcrypt.compare`
4. If it matches, a **JWT token** is issued and the user is authenticated

The star map is always identical across sessions (fixed star positions), so users can reliably recreate their pattern.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Auth:** bcryptjs, JSON Web Tokens (JWT)

---

## Project Structure

```
constellation-lock/
├── frontend/         # React + Vite app
│   └── src/
│       ├── pages/
│       │   ├── Register.jsx
│       │   └── Login.jsx
│       └── App.jsx
├── backend/          # Node.js + Express API
│   ├── middleware/
│   │   └── server.js
│   ├── routes/
│   │   └── auth.js
│   ├── models/
│   │   └── User.js
│   └── .env
└── README.md
```

---

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account with a cluster set up

### 1. Clone the repository
```bash
git clone https://github.com/LeandreNel/constellation-lock.git
cd constellation-lock
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:
```bash
npm run dev
```

### 3. Set up the frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
Go to [http://localhost:5173](http://localhost:5173)

---

## Security

- Constellation patterns are never stored in plain text
- bcrypt with a salt round of 12 is used to hash the pattern
- JWT tokens expire after 1 day
- CORS is configured to only allow requests from the frontend origin
