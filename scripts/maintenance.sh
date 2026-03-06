#!/bin/bash
# CRUSHOME - DevOps Disk Recovery & Build Optimizer v3

echo "🚀 [CRUSHOME] Iniciando mantenimiento preventivo de almacenamiento..."

# 1. Limpieza total de artefactos volátiles
echo "🧹 Purgando .next, caches y temporales..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .npm-cache
rm -rf ~/.npm/_logs/*
rm -rf ~/.npm/_cacache/*
rm -rf ~/.npm/_npx/*
rm -rf .turbo

# 2. Limpiar cache de NPM de forma segura
npm cache clean --force || true

# 3. Instalación optimizada para ahorrar espacio
echo "📦 Reinstalando dependencias en modo ahorro..."
npm install --no-audit --no-fund --loglevel error --prefer-offline

# 4. Limpieza post-instalación inmediata
echo "🧹 Limpiando remanentes de instalación..."
rm -rf ~/.npm/_logs/*
rm -rf ~/.npm/_cacache/*
rm -rf .npm-cache/_logs/*

echo "📊 Estado del disco post-mantenimiento:"
df -h .

echo "✅ Entorno saneado. Podés ejecutar 'npm run build' o 'npm run dev'."
