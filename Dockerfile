# Etapa 1: Compilar el Frontend React con Node.js
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor Python con FastAPI (Sirve tanto la API como el Frontend)
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

WORKDIR /app

# Instalar dependencias del backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY backend/ .

# Copiar los archivos compilados del frontend a /app/dist
COPY --from=frontend-builder /app/dist /app/dist

# Crear directorio para la base de datos persistente SQLite
RUN mkdir -p /app/data

EXPOSE 8000

# Render inyecta la variable $PORT automáticamente (ej. 10000)
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"
