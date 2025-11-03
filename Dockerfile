# Usar Node 20 LTS como base
FROM node:20

# Definir diretório de trabalho
WORKDIR /usr/src/app

# Copiar apenas os arquivos de dependências primeiro para cache de layer
COPY package*.json ./

# Instalar apenas dependências de produção (ignora dev)
RUN npm install --omit=dev

# Copiar o restante do código da aplicação
COPY . .

# Definir variável de ambiente da porta
ENV PORT=3001

# Expor porta da aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
