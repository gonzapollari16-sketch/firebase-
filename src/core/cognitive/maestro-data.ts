/**
 * @fileOverview Manual Maestro CRUSHOME — Base de Conocimiento Estructurada
 * Datos maestros para RAG, Onboarding y Entrenamiento IA.
 */

export const MANUAL_MAESTRO = {
  version: "1.0.0",
  lastUpdated: "2026-01-28",
  modules: [
    {
      id: "mod-properties",
      name: "Gestión de Propiedades",
      articles: [
        {
          id: "art-pub-correct",
          title: "Publicación Correcta",
          objective: "Lograr visibilidad y cero duplicados.",
          steps: [
            "Confirmar ubicación exacta en el mapa.",
            "Subir mínimo 8 fotos de alta calidad.",
            "Ejecutar ACM antes de fijar precio."
          ],
          commonErrors: ["Dirección incompleta", "Fotos verticales", "Sobreprecio"],
          businessImpact: "Reduce el tiempo de venta en un 35%."
        }
      ]
    },
    {
      id: "mod-crm",
      name: "CRM y Leads",
      articles: [
        {
          id: "art-lead-conversion",
          title: "Conversión de Leads",
          objective: "Maximizar tasa de cierre.",
          steps: [
            "Responder en menos de 3 minutos vía WhatsApp.",
            "Calificar intención inmediata.",
            "Agendar visita en el primer contacto."
          ],
          commonErrors: ["Respuesta tardía", "Falta de seguimiento", "No registrar objeciones"],
          businessImpact: "Duplica la probabilidad de cierre real."
        }
      ]
    },
    {
      id: "mod-dominance",
      name: "Estrategias de Dominación",
      articles: [
        {
          id: "art-supply-lockin",
          title: "Supply Lock-In",
          objective: "Capturar inventario exclusivo.",
          steps: [
            "Ofrecer fee reducido por exclusividad de 90 días.",
            "Activar boost algorítmico de visibilidad.",
            "Garantizar reporte semanal de performance."
          ],
          commonErrors: ["No explicar beneficios del boost", "Falta de reportes"],
          businessImpact: "Garantiza el 60% de los cierres del tenant."
        }
      ]
    }
  ]
};
