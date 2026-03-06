#!/bin/bash
# CRUSHOME - Emergency Disk Recovery Script v3

echo "🚨 [DISCO LLENO] Iniciando purga crítica de archivos..."

# 1. Eliminar carpetas de construcción y cachés de paquetes
echo "🧹 Eliminando .next y caches locales..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -rf .npm-cache

# 2. Limpieza profunda de NPM en el home del usuario y root del proyecto
echo "🧹 Limpiando caches profundas de NPM..."
rm -rf ~/.npm/_logs/*
rm -rf ~/.npm/_cacache/*
rm -rf ~/.npm/_npx/*
rm -rf .npm-cache/_logs/*
rm -rf ~/.npm/anonymous-cli-metrics.json

# 3. Eliminar archivos temporales de sistema (si existen en el entorno)
echo "🧹 Limpiando archivos temporales..."
rm -rf /tmp/* || true

# 4. Eliminar archivos de bloqueo para permitir reinstalación limpia
rm -f package-lock.json

# 5. Limpiar cache de NPM de forma forzada
echo "✨ Ejecutando npm cache clean..."
npm cache clean --force || true

echo "📊 Espacio recuperado (df -h):"
df -h .

echo "✅ Listo. El entorno debería tener espacio suficiente para 'npm install'."
