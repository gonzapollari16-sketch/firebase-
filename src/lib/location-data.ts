/**
 * @fileOverview Dataset Geográfico Exhaustivo de Argentina.
 * Proporciona la jerarquía Provincia -> Ciudad -> Barrio para normalización.
 */

export const geoHierarchy: Record<string, Record<string, string[]>> = {
  "Buenos Aires": {
    "La Plata": ["Casco Urbano", "Tolosa", "Ringuelet", "Villa Elvira", "Los Hornos", "City Bell", "Gonnet", "Villa Elisa", "Abasto", "Olmos"],
    "Mar del Plata": ["Centro", "La Perla", "Playa Grande", "Punta Mogotes", "Constitución", "San Juan", "Bosque Peralta Ramos", "Los Troncos", "Chauvin"],
    "Bahía Blanca": ["Centro", "Palihue", "Villa Mitre", "Noroeste", "Bella Vista", "Villa Rosas"],
    "Tandil": ["Centro", "Cerro Leones", "Villa Italia", "Movediza", "Tunitas"],
    "Quilmes": ["Quilmes Centro", "Bernal", "Don Bosco", "Ezpeleta", "San Francisco Solano"],
    "Tigre": ["Tigre Centro", "Nordelta", "Don Torcuato", "General Pacheco", "Benavídez"],
    "Pilar": ["Pilar Centro", "Del Viso", "Manzanares", "La Lonja", "Fátima"]
  },
  "CABA": {
    "Ciudad Autónoma de Buenos Aires": [
      "Agronomía", "Almagro", "Balvanera", "Barracas", "Belgrano", "Boedo", "Caballito", "Chacarita", "Coghlan", "Colegiales",
      "Constitución", "Flores", "Floresta", "La Boca", "La Paternal", "Liniers", "Mataderos", "Monte Castro", "Monserrat", "Nueva Pompeya",
      "Núñez", "Palermo", "Parque Avellaneda", "Parque Chacabuco", "Parque Chas", "Parque Patricios", "Puerto Madero", "Recoleta",
      "Retiro", "Saavedra", "San Cristóbal", "San Nicolás", "San Telmo", "Vélez Sársfield", "Versalles", "Villa Crespo", "Villa del Parque",
      "Villa Devoto", "Villa General Mitre", "Villa Lugano", "Villa Luro", "Villa Ortúzar", "Villa Pueyrredón", "Villa Real", "Villa Riachuelo",
      "Villa Santa Rita", "Villa Soldati", "Villa Urquiza"
    ]
  },
  "Córdoba": {
    "Córdoba Capital": ["Centro", "Nueva Córdoba", "General Paz", "Alberdi", "Alta Córdoba", "Cerro de las Rosas", "Urca", "Jardín", "Pueyrredón", "Argüello", "San Vicente", "Villa Belgrano", "Empalme", "Los Boulevares"],
    "Villa Carlos Paz": ["Centro", "Costa Azul", "Villa Independencia", "Santa Rita", "La Quinta", "Sol y Lago"],
    "Río Cuarto": ["Centro", "Banda Norte", "Las Quintas", "Alberdi", "Abilene"],
    "Villa María": ["Centro", "Barrio Ameghino", "Almirante Brown", "San Juan Bautista"]
  },
  "Santa Fe": {
    "Rosario": ["Centro", "Echesortu", "Alberdi", "Fisherton", "Pichincha", "Arroyito", "Refinería", "Empalme Graneros", "Bella Vista", "Parque España", "Lourdes"],
    "Santa Fe Capital": ["Centro", "Candioti", "Barrio Constituyentes", "Guadalupe", "Alto Verde", "Barrio Roma", "Barranquitas"],
    "Rafaela": ["Centro", "Barrio 9 de Julio", "Villa Rosas", "Barrio Pizzurno"]
  },
  "Mendoza": {
    "Mendoza Capital": ["Centro", "Ciudad", "Cuarta Sección", "Quinta Sección", "La Favorita", "San Martín"],
    "Godoy Cruz": ["Centro", "Bombal", "Trapiche", "Villa Hipódromo", "Las Tortugas"],
    "Guaymallén": ["Villa Nueva", "Rodeo de la Cruz", "San José", "Dorrego"],
    "Luján de Cuyo": ["Chacras de Coria", "Carrodilla", "Vistalba", "Perdriel"]
  }
};

export const provincias = Object.keys(geoHierarchy).map(p => ({ value: p, text: p }));

export const propertyTypes = [
  "Casa", "Duplex", "Triplex", "Chalet", "Casa Quinta", "Cabaña", 
  "Prefabricada", "Departamento", "PH", "Terreno / Lote", "Local comercial", 
  "Oficina", "Galpón", "Campo", "Tiempo compartido", "Cocheras"
];

export const operations = ["Venta", "Alquiler", "Alquiler temporario", "Tiempo Compartido"];
