# ===== IMAGEM BASE =====
FROM node:18

# ===== DIRETÓRIO DE TRABALHO =====
WORKDIR /usr/src/app

# ===== COPIAR ARQUIVOS DE DEPENDÊNCIAS =====
COPY package*.json ./

# ===== INSTALAR DEPENDÊNCIAS =====
RUN npm install --production

# ===== COPIAR TODO O CÓDIGO =====
COPY . .

# ===== PORTA =====
# Back4App define a porta via variável de ambiente PORT
ENV PORT=8080
EXPOSE 8080

# ===== COMANDO DE INÍCIO =====
CMD ["npm", "start"]
