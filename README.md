
# CRUSHOME — Enterprise Production Monorepo

Arquitectura de microservicios orientada a eventos para el ecosistema inmobiliario global CRUSHOME.

## 🏗 Arquitectura
- **API Gateway**: Punto de entrada único (Fastify).
- **WhatsApp Service**: Integración con Meta Cloud API + Webhooks asíncronos.
- **Ads Engine (Meta)**: Microservicio encargado de la gestión automatizada de pauta en FB/IG.
- **Cognitive Core**: Motor de IA (Genkit/Gemini) para extracción de intención y ROI predictivo.
- **CRUSHOME Match Engine™**: Algoritmo propietario de emparejamiento propiedad-persona.

## 🛠 Stack Tecnológico
- **Frontend**: Next.js 14 + ShadCN UI + Tailwind.
- **Backend**: Node.js / NestJS / Fastify.
- **Mensajería**: Redis + BullMQ (Event Driven).
- **Base de Datos**: PostgreSQL 15 (RLS Multi-tenant).
- **Seguridad**: AES-256, TLS 1.3, RBAC Avanzado.

## 🚀 Despliegue Local
1. Clonar el repositorio.
2. Configurar `.env` basándose en `.env.example`.
3. Ejecutar `docker-compose up --build`.
4. Acceder al dashboard en `http://localhost:3000`.

## 🛡 Cumplimiento Legal
- **Ley 25.326 AR**: Consentimiento informado y aislamiento de datos garantizado.
- **Meta Housing Policy**: Automatización de segmentación para cumplimiento de políticas de vivienda.

---
**CRUSHOME Tech Ecosystem** — Infrastructure for the next generation of Real Estate.
