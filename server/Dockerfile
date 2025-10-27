FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta da aplicação
EXPOSE 3000

# Comando para iniciar em desenvolvimento
CMD ["npm", "run", "dev"]
