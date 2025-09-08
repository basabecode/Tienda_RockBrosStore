#!/bin/bash

# Script para conectar el repositorio local con GitHub
# Ejecutar después de crear el repositorio en GitHub

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Script de conexión a GitHub${NC}"
echo "======================================"

# Solicitar el nombre de usuario de GitHub
read -p "Ingresa tu nombre de usuario de GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ Error: Debes ingresar un nombre de usuario${NC}"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: No estás en un directorio git${NC}"
    exit 1
fi

echo -e "${BLUE}📡 Configurando repositorio remoto...${NC}"

# Agregar remote origin
REPO_URL="https://github.com/${GITHUB_USERNAME}/tienda_RockBrosStore.git"
git remote add origin "$REPO_URL"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Remote origin agregado exitosamente${NC}"
else
    echo -e "${RED}❌ Error agregando remote origin${NC}"
    exit 1
fi

# Verificar remote
echo -e "${BLUE}🔍 Verificando configuración remota...${NC}"
git remote -v

# Hacer push
echo -e "${BLUE}⬆️ Subiendo código a GitHub...${NC}"
git push -u origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Proyecto subido exitosamente a GitHub!${NC}"
    echo -e "${GREEN}📂 Tu repositorio: https://github.com/${GITHUB_USERNAME}/tienda_RockBrosStore${NC}"
else
    echo -e "${RED}❌ Error subiendo a GitHub${NC}"
    echo "Verifica que:"
    echo "1. El repositorio existe en GitHub"
    echo "2. Tienes permisos de escritura"
    echo "3. Tu autenticación de Git está configurada"
fi

echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Verifica que todos los archivos estén presentes"
echo "3. Configura las variables de entorno para deployment"
echo "4. Considera configurar GitHub Pages o Vercel para deployment"
