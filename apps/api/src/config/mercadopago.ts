
/**
 * @fileOverview Configuración y cliente de MercadoPago.
 */
export const mp = {
  preferences: {
    create: async (data: any) => ({
      id: 'mp_pref_mock',
      init_point: 'https://www.mercadopago.com.ar/checkout/mock'
    })
  },
  payment: {
    get: async (id: string) => ({
      id,
      status: 'approved',
      external_reference: 'tenant-id-mock'
    })
  }
};
