export const premiumPlans = [
  {
    name: 'Starter',
    price: '$25.130',
    legacyPrice: '$28.130',
    isMostSold: false,
    features: [
      { name: 'Usuarios', value: '1', included: true },
      { name: 'Inmuebles', value: '50', included: true },
      { name: 'Página Web', value: 'Full', included: true },
      { name: 'Publicar en masivo', value: '', included: false },
      { name: 'Red de inmobiliarias', value: '', included: false },
      { name: 'Publicar en portales premium', value: '', included: true },
      { name: 'Aplicaciones Android/iOS', value: '', included: true },
      { name: 'CRM', value: '', included: true },
      { name: 'Equipo comerciales', value: '', included: true },
      { name: 'Acceso a API', value: '', included: false },
      { name: 'Integración WhatsApp API Business', value: '', included: false },
    ],
  },
  {
    name: 'Starter Pro',
    price: '$34.390',
    isMostSold: true,
    features: [
      { name: 'Usuarios', value: '2', included: true },
      { name: 'Inmuebles', value: '150', included: true },
      { name: 'Página Web', value: 'Full', included: true },
      { name: 'Publicar en masivo', value: '', included: true },
      { name: 'Red de inmobiliarias', value: '', included: true },
      { name: 'Publicar en portales premium', value: '', included: true },
      { name: 'Aplicaciones Android/iOS', value: '', included: true },
      { name: 'CRM', value: '', included: true },
      { name: 'Equipo comerciales', value: '', included: true },
      { name: 'Acceso a API', value: '', included: true },
      { name: 'Integración WhatsApp API Business', value: '', included: false },
    ],
  },
  {
    name: 'Equipo',
    price: '$55.540',
    isMostSold: false,
    features: [
      { name: 'Usuarios', value: '5', included: true },
      { name: 'Inmuebles', value: '300', included: true },
      { name: 'Página Web', value: 'Full', included: true },
      { name: 'Publicar en masivo', value: '', included: true },
      { name: 'Red de inmobiliarias', value: '', included: true },
      { name: 'Publicar en portales premium', value: '', included: true },
      { name: 'Aplicaciones Android/iOS', value: '', included: true },
      { name: 'CRM', value: '', included: true },
      { name: 'Equipo comerciales', value: '', included: true },
      { name: 'Acceso a API', value: '', included: true },
      { name: 'Integración WhatsApp API Business', value: '', included: false },
    ],
  },
  {
    name: 'Empresa',
    price: '$99.360',
    isMostSold: false,
    features: [
      { name: 'Usuarios', value: '10', included: true },
      { name: 'Inmuebles', value: 'Ilimitado', included: true },
      { name: 'Página Web', value: 'Premium', included: true },
      { name: 'Publicar en masivo', value: '', included: true },
      { name: 'Red de inmobiliarias', value: '', included: true },
      { name: 'Publicar en portales premium', value: '', included: true },
      { name: 'Aplicaciones Android/iOS', value: '', included: true },
      { name: 'CRM', value: '', included: true },
      { name: 'Equipo comerciales', value: '', included: true },
      { name: 'Acceso a API', value: '', included: true },
      { name: 'Integración WhatsApp API Business', value: '', included: true },
    ],
  },
  {
    name: 'Plan Black',
    price: 'Consultá el costo',
    isMostSold: false,
    features: [
      { name: 'Usuarios', value: 'Personalizado y a tu medida', included: true },
      { name: 'Inmuebles', value: 'Para empresas que necesiten más cuentas', included: true },
    ],
    isCustom: true,
  },
];

export const iaPlans = [
  {
    name: 'Esencial',
    price: '$60.000',
    features: [
      'Primer paso para ordenar la atención y no perder consultas',
      'Whatsapp conectado e GVAMax (Sin IA)',
      'Centralización de todos tus contactos en un solo lugar',
    ],
  },
  {
    name: 'Avanzado',
    price: '$185.000',
    features: [
      'Whatsapp + Inteligencia Artificial',
      'Hasta 400 conversaciones mensuales',
      'Registra todo en GVAMax',
      'Agenda de visitas y resúmenes automáticos',
      'Soporte y Capacitación',
    ],
  },
  {
    name: 'Elite',
    price: '$295.000',
    features: [
      'Whatsapp + Inteligencia Artificial',
      'Hasta 800 conversaciones mensuales',
      'Registra todo en GVAMax',
      'Agenda de visitas y resúmenes automáticos',
      'Soporte y Capacitación',
    ],
  },
];

export const cpiPlans = [
  { name: 'CPI Free', buttonText: 'Empezar' },
  { name: 'CPI Inicio', buttonText: 'Empezar' },
];
