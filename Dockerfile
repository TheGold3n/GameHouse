# Etapa 1: Compilación de la aplicación React con Node.js
FROM node:20-alpine AS build

WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx ligero para producción
FROM nginx:alpine

# Copiar los archivos estáticos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

