/**
 * @fileOverview Mock Database Package Entry Point.
 * Provides a minimal interface for the billing service and other modules.
 */

export const db = {
  subscriptions: {
    update: async (args: any) => ({ success: true, ...args }),
    findMany: async (args: any) => [] as any[],
  },
  auditLogs: {
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock-log-id', ...args }),
  },
  $transaction: async (fn: (tx: any) => Promise<any>) => {
    const mockTx = {
      subscriptions: { update: async () => ({}) },
      auditLogs: { create: async () => ({}) },
    };
    return fn(mockTx);
  },
  pool: {
    connect: async () => ({
      query: async (sql: string, params?: any[]) => ({ rows: [] as any[], rowCount: 0 }),
      release: () => {},
    }),
  },
  query: async (sql: string, params?: any[]) => ({ rows: [] as any[], rowCount: 0 }),
};