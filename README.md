# Blog Website (Node/Express/MongoDB + React)

This repository contains a full-stack blog application:

- backend/: Node.js + Express + MongoDB (Mongoose)
- frontend/: React app (Create React App style)

Quick start (requires Node.js and MongoDB):

1. Backend
   - cd backend
   - copy `.env.example` to `.env` and fill values
   - npm install
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm start

The frontend expects the backend at `http://localhost:4000/api`. Set `REACT_APP_API_URL` to change.

Features implemented (MVP):
- User registration and login (JWT)
- Create, read, update, delete posts
- Comments on posts (create, delete)
- Tags listing and filtering
- Search by title and tag

Notes and next steps:
- Add input validation and better error handling
- Add pagination UI and editing/deleting posts from frontend
- Add unit/integration tests

