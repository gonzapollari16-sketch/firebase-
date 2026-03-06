export const CrushomeGateConfig = {
  brand: "CRUSHOME",
  plans: ["free", "starter", "pro", "enterprise"],

  planHierarchy: {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3
  },

  featureMatrix: {
    "search-ai": "starter",
    "upload-auto": "pro",
    "mls-sync": "pro",
    "heatmap": "enterprise",
    "embeddings": "enterprise"
  },

  defaultLimits: {
    free: 5,
    starter: 50,
    pro: 500,
    enterprise: Infinity
  },

  upgradeUrl: "/pricing", // Assuming a pricing page exists or will exist
  whiteLabel: false,
  enableABTesting: true,
  enableTelemetry: true,
  enableBehaviorEmbeddings: true,
  enableAutoCopyAI: true
};

export const CopyTemplates = {
  limit: [
    {
      title: "Alcanzaste tu límite de consultas",
      desc: "Para seguir operando sin fricción y cerrar más rápido, necesitás pasar a un plan superior.",
      benefits: [
        "Consultas ilimitadas",
        "IA de carga automática",
        "Embeddings geo avanzados",
        "Soporte prioritario"
      ]
    },
    {
      title: "Tu plan se quedó corto 🚀",
      desc: "Estás operando al máximo. Desbloqueá todo el potencial de CRUSHOME con un upgrade.",
      benefits: [
        "Resultados instantáneos",
        "Cargas automáticas premium",
        "Difusión MLS sin fricción",
        "Analytics de conversión"
      ]
    }
  ],
  feature: {
    "search-ai": {
      title: "Buscador IA conversacional",
      desc: "Tus clientes buscan como hablan. La IA entiende intención real.",
      benefits: [
        "Match semántico",
        "Contexto histórico",
        "Recomendaciones dinámicas",
        "Feedback loop"
      ]
    },
    "upload-auto": {
      title: "Carga automática IA premium",
      desc: "Subí fotos y descripción: la IA completa todo por vos en segundos.",
      benefits: [
        "Carga 10× más rápida",
        "Normalización inteligente",
        "Detección automática de barrio",
        "Confidence score por campo"
      ]
    },
    "heatmap": {
      title: "Heatmap predictivo de zonas",
      desc: "Visualizá oportunidades ocultas con datos reales de cierre.",
      benefits: [
        "Zonas calientes en tiempo real",
        "ML de absorción",
        "Scoring por barrio",
        "Comparables automáticos"
      ]
    },
    "mls-sync": {
      title: "Sincronización MLS automática",
      desc: "Publicá y compartí propiedades en múltiples redes sin fricción.",
      benefits: [
        "Difusión multicanal",
        "Links firmados",
        "Branding CRUSHOME",
        "Analytics viral"
      ]
    },
    "embeddings": {
      title: "Embeddings geo profesionales",
      desc: "Modelo propietario de similitud territorial para precisión extrema.",
      benefits: [
        "Matching por microlocalización",
        "Drift detection",
        "Feature store regional",
        "Federated learning"
      ]
    }
  }
};
