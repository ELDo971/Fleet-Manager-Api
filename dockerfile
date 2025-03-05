# Utilisation de Node.js comme base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY package.json package-lock.json ./
RUN npm install

# Copier tout le reste du projet
COPY . .

# Générer les migrations Prisma
RUN npx prisma generate

# Exposer le port pour l'API (Express par exemple)
EXPOSE 11021

# Démarrer l'API
CMD ["npm", "start"]
