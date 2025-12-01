#!/bin/bash

set -e # Fail fast em erros

echo "Iniciando atualização da aplicação..."

cd /var/www/fio-e-flor-system

echo "Executando git pull..."
git pull

echo "Entrando na pasta do backend..."
cd backend

echo "Rodando migrations do banco de dados..."
npx prisma migrate deploy

echo "Gerando Prisma Client..."
npx prisma generate

echo "Instalando dependências do backend..."
npm install

echo "Realizando build do backend..."
npm run build

echo "Reiniciando o backend no PM2..."
pm2 restart fio-e-flor-api
pm2 start ecosystem.config.js
pm2 save

echo "Restartando o apache..."
sudo systemctl restart apache2

echo "Atualização concluída!"
