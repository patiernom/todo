export function makeBasePrismaStub() {
  return {
    $disconnect: async () => Promise.resolve(),
    $queryRaw: async (..._args: any[]) => Promise.resolve([]),
  };
}

export function attachPrismaNoOps(app: { prisma?: any }) {
  const existing = app.prisma ?? {};
  app.prisma = {
    ...existing,
    $disconnect: async () => Promise.resolve(),
    $queryRaw: async (..._args: any[]) => Promise.resolve([]),
  };
}
