# Stage 1: Build the React Frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy the built frontend into the backend's static directory
COPY --from=frontend-build /app/frontend/dist /app/backend/static

# Run Uvicorn from the backend directory (Cloud Run injects the PORT env var)
WORKDIR /app/backend
CMD uvicorn app:app --host 0.0.0.0 --port ${PORT:-8080}
