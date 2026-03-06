# 🏁 CRUSHOME MASTER PLAN: Checklist de Verificación Funcional (v2.0 Final)

Este documento es la guía definitiva para la validación del ecosistema CRUSHOME. Cubre los 22 puntos críticos del sistema, detallando pruebas, resultados esperados y roles aplicables.

---

### 1. Carga de Propiedades (Manual/Auto) + Geo + Duplicados
- **Verificar:** 
  - Formulario en `/property/add`.
  - Obligatoriedad de `lat/lng` interactuando con el mapa (Intelligent Location Filter).
  - Alerta de duplicidad: Ingresar datos de una propiedad existente (mismo barrio, piso, unidad).
  - Aplicación de marca de agua forense (simulada en el proceso de guardado).
- **Resultado Esperado:** 
  - No se permite guardar sin coordenadas (botón deshabilitado o toast de error).
  - Si el match de duplicidad es > 70%, aparece el modal `DuplicatePropertyWarning`.
  - La propiedad aparece en `/my-properties` con el status "active".
- **Roles:** AGENT, OWNER (pueden cargar), USER (no ve opción).
- **Notas de verificación:** Revisar `src/core/deduplication/detector.ts` si el score de duplicidad no es preciso.

---

### 2. CrushIA: Animación e Ingeniería completa
- **Verificar:** 
  - Flujo conversacional en `/property/search`.
  - Animaciones de estados cognitivos: "Breathe", "Thinking", "Searching", "Found".
  - Entrada por voz (Micrófono) y texto.
- **Resultado Esperado:** 
  - La IA interpreta deseos complejos (ej: "lugar tranquilo para mis hijos") y devuelve resultados con "Match Cognitivo" porcentual.
  - El avatar cambia de color y aura según el estado (`listening` = verde, `thinking` = púrpura).
- **Roles:** Todos los usuarios autenticados.
- **Notas de verificación:** Validar que el UCM (User Cognitive Model) se guarde en `localStorage`.

---

### 3. Historial de Búsquedas
- **Verificar:** 
  - Página `/my-searches`.
  - Listado de vectores de intención capturados.
  - Detalle de cada búsqueda (filtros aplicados, score, urgencia).
- **Resultado Esperado:** 
  - Visualización clara de la "Interpretación Semántica" de búsquedas pasadas.
  - El sistema muestra el nivel de urgencia detectado automáticamente por la IA.
- **Roles:** USER, AGENT, OWNER.
- **Notas de verificación:** Si la lista está vacía, realizar una búsqueda en CrushIA y volver.

---

### 4. Mapa Interactivo
- **Verificar:** 
  - `/intelligence/map`.
  - Activación de capas: Heatmaps de Demanda, Liquidez, Puntos de Oportunidad.
  - Bloqueo de capas según el plan del tenant.
- **Resultado Esperado:** 
  - Las capas premium muestran un "Lock Overlay" si el plan es inferior a PRO/BUSINESS.
  - Los pins muestran un mini-dashboard de insights al hacer clic.
- **Roles:** Todos (con restricciones de plan).
- **Notas de verificación:** Verificar que `mapboxgl` cargue correctamente en el contenedor.

---

### 5. Comunidad Inmobiliaria
- **Verificar:** 
  - `/intelligence/community`.
  - Visualización del score ICP (Índice de Cooperación) del tenant.
  - Feed de colaboración (oportunidades en red).
- **Resultado Esperado:** 
  - El ICP afecta el color del indicador (Verde = Regla, Rojo = Riesgo).
  - Listado de comunidades activas y miembros.
- **Roles:** AGENT, OWNER.
- **Notas de verificación:** Validar que la penalización por "Difusión Fantasma" sea visible si el ICP es bajo.

---

### 6. Anunciantes
- **Verificar:** 
  - `/intelligence/advertisers`.
  - Gestión de campañas de pauta y sponsored listings.
  - Métricas de CPC/CPM en tiempo real.
- **Resultado Esperado:** 
  - Poder listar campañas activas y ver balance de inversión.
  - Acceso restringido según el rol.
- **Roles:** MARKETING, OWNER, ADMIN.
- **Notas de verificación:** Revisar que el `AdEngine` asigne correctamente los placements.

---

### 7. Difusión Comunidad y Portales (Sindicación)
- **Verificar:** 
  - `/intelligence/syndication`.
  - Estado de sincronización con portales externos (Zonaprop, Argenprop, etc.).
  - Botón "Re-sync" global.
- **Resultado Esperado:** 
  - El "Health Score" de la red debe estar visible (ej: 98% Online).
  - Al presionar "Re-sync", se dispara un evento de telemetría exitoso.
- **Roles:** OWNER, AGENT (solo vista).
- **Notas de verificación:** Validar que los errores de API externa muestren el mensaje de error real.

---

### 8. Feed, Notificaciones y Chat
- **Verificar:** 
  - Live Feed en el Header (barra superior).
  - Burbuja de notificaciones y lista de eventos recientes.
- **Resultado Esperado:** 
  - Los eventos del sistema (ej: "Propiedad creada", "Match sugerido") aparecen inmediatamente en el ticker del Header.
  - Las notificaciones se marcan como leídas al abrir el panel.
- **Roles:** Todos.
- **Notas de verificación:** Comprobar que el `eventBus` esté emitiendo eventos `notification.created`.

---

### 9. Soporte y Reportes
- **Verificar:** 
  - Ruta `/reports`.
  - Tabla comparativa de niveles de soporte por plan.
  - Sección de tipos de reportes (Analítico, Operativo, Estratégico).
- **Resultado Esperado:** 
  - Visualización clara de qué reportes están incluidos en el plan actual.
  - Botón de contacto con soporte operativo funcional (placeholder o link).
- **Roles:** OWNER, ADMIN, AGENT.
- **Notas de verificación:** Validar que un usuario `FREE` no pueda ver reportes `ENTERPRISE`.

---

### 10. Automatizaciones y Permisos
- **Verificar:** 
  - Ejecución de reglas en `src/core/automations`.
  - Configuración de RBAC (Matrix de permisos).
- **Resultado Esperado:** 
  - Al crear una propiedad de alto valor (>100k), el sistema dispara automáticamente una notificación de "Matching Premium".
  - El sistema bloquea acciones si el rol no tiene el permiso explícito.
- **Roles:** ADMIN, OWNER (gestión), AGENT (ejecución).
- **Notas de verificación:** Revisar `rules-engine.ts` para validar la prioridad de reglas.

---

### 11. Mejoras (Optimización de UX)
- **Verificar:** 
  - Fluidez de transiciones entre páginas.
  - Uso de Toasts para errores y éxitos.
  - Skeleton loaders en cargas de datos.
- **Resultado Esperado:** 
  - Ausencia de errores de Hidratación en consola.
  - Interfaz responsiva en móviles y tablets.
- **Roles:** Todos.
- **Notas de verificación:** Validar que los botones tengan estado `loading` al procesar.

---

### 12. Asistente Virtual IA (Neural Command)
- **Verificar:** 
  - `/ai-assistant`.
  - Terminal de telemetría interactiva.
  - Campo de comandos neuronales (Neural Analyzer).
- **Resultado Esperado:** 
  - El comando "Ejecutar Análisis" devuelve una respuesta firmada por el Neural Core.
  - Las métricas de GIS/SES se actualizan en el panel lateral.
- **Roles:** OWNER, ADMIN, AGENT.
- **Notas de verificación:** Comprobar conexión con `getAIResponse` action.

---

### 13. WhatsApp API (Communication Kernel)
- **Verificar:** 
  - `/intelligence/whatsapp`.
  - Consola de despacho y Neural Dispatcher.
  - Simulación de entrada de mensaje (botón "Simular Entrada").
- **Resultado Esperado:** 
  - La IA detecta la intención del mensaje entrante y sugiere una respuesta coherente.
  - El "Event Log" muestra la traza de Meta Cloud API.
- **Roles:** AGENT, OWNER.
- **Notas de verificación:** Validar cálculo de costo estimado por sesión.

---

### 14. Ads Meta (Integración Publicitaria)
- **Verificar:** 
  - Panel de Ads dentro de `/intelligence/advertisers` o `/intelligence/syndication`.
  - Configuración de presupuestos diarios y placements IA.
- **Resultado Esperado:** 
  - Visualización de ROI proyectado por campaña de Meta.
  - Estado de conexión con Meta Ads API (v18.0).
- **Roles:** MARKETING, OWNER.
- **Notas de verificación:** Revisar que el `AdEngine` filtre por `targetRoles`.

---

### 15. Precios (SaaS Billing)
- **Verificar:** 
  - `/pricing`.
  - Calculadora de ROI estratégico.
  - Selector de ciclo mensual/anual.
- **Resultado Esperado:** 
  - El ROI se recalcula dinámicamente al cambiar parámetros.
  - Los botones de selección reflejan el estado del plan actual (ej: "Tu Plan Actual" deshabilitado).
- **Roles:** OWNER, ADMIN.
- **Notas de verificación:** Validar que el descuento del 20% anual se aplique correctamente al precio visual.

---

### 16. Master Plan (AI Guide)
- **Verificar:** 
  - `/ai-guide`.
  - Acceso al "Manual Maestro Vivo".
  - Estado de convergencia del aprendizaje de sesión.
- **Resultado Esperado:** 
  - Visualización de artículos vectorizados por el sistema.
  - El log de "Experiencia Reciente" muestra los últimos eventos procesados por el Core.
- **Roles:** Todos (vista restringida por categoría).
- **Notas de verificación:** Comprobar que los datos provengan de `maestro-data.ts`.

---

### 17. Modo Procesamiento (Background Engine)
- **Verificar:** 
  - Indicadores de "Procesando Inferencia" o "Neural Data Flow".
  - Logs de telemetría en `/engineering-blueprint` o `/ai-assistant`.
- **Resultado Esperado:** 
  - Procesamiento asíncrono de vectores de intención sin bloquear la UI.
  - Feedback visual de "Optimización en curso".
- **Roles:** ADMIN, DEV.
- **Notas de verificación:** Revisar el `eventBus` para eventos de tipo `cognitive.process`.

---

### 18. CRM (Dashboard de Inteligencia)
- **Verificar:** 
  - `/intelligence/crm`.
  - Cambio entre modo "Humano" y modo "Analista".
  - Métricas de Liquidez, Absorción y Presión de Demanda.
- **Resultado Esperado:** 
  - Las métricas cambian de lenguaje coloquial a técnico/estadístico según el modo.
  - El radar de mercado muestra zonas de riesgo y crecimiento.
- **Roles:** OWNER, AGENT.
- **Notas de verificación:** Validar que el `MarketEngine` devuelva datos coherentes con la zona.

---

### 19. Panel de Ingreso (Auth Flow)
- **Verificar:** 
  - Pantalla de inicio `/`.
  - Formulario de Login/Registro.
  - Selección de perfil (Particular, Profesional, Desarrollista).
- **Resultado Esperado:** 
  - Redirección automática al Dashboard tras el éxito del Auth.
  - Persistencia de sesión tras refrescar el navegador.
- **Roles:** Público / Todos.
- **Notas de verificación:** Probar el bypass de "chemesinversiones@gmail.com" para acceso ROOT.

---

### 20. Vista Admin (Admin Master)
- **Verificar:** 
  - `/admin`.
  - Gestión de usuarios y asientos (Seats).
  - Modo Impersonación.
- **Resultado Esperado:** 
  - El medidor de consumo de seats muestra datos reales del tenant.
  - La impersonación permite ver el sistema como otro usuario (con barra de advertencia naranja).
- **Roles:** ADMIN, OWNER.
- **Notas de verificación:** Comprobar el límite de 30 slots para el "Owner Team".

---

### 21. Análisis y Fusión 1 y 2 (Engineering Blueprint)
- **Verificar:** 
  - `/engineering-blueprint`.
  - Diagrama de flujo de datos neuronales.
  - Métricas de escalabilidad (GIS/SES).
- **Resultado Esperado:** 
  - Visualización técnica de los nodos del sistema (Cognitive, Security, Market, Result).
  - El diagrama es interactivo o animado para demostrar el flujo.
- **Roles:** ADMIN, DEV, OWNER.
- **Notas de verificación:** Documento crítico para auditorías Serie A.

---

### 22. Seguridad (Kernel Enforcement)
- **Verificar:** 
  - Bloqueos de RBAC en rutas protegidas.
  - Rastreo forense en imágenes descargadas.
  - Etiquetas de "E2EE" y "Link Firmado" en compartidos.
- **Resultado Esperado:** 
  - El sistema bloquea el acceso a `/admin` si el usuario es `USER` (redirección o error).
  - Las imágenes llevan marca de agua invisible con ID de usuario y timestamp.
- **Roles:** Todos (Enforcement automático).
- **Notas de verificación:** Revisar `media-gateway.ts` para validación de watermark forense.

---
**Instrucciones para QA:** Validar cada punto marcando las subtareas. Cualquier desviación de los "Resultados Esperados" debe reportarse como bug de integridad del núcleo.
