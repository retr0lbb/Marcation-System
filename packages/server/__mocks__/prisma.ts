// __mocks__/prisma.ts
export const prisma = {
    appointment: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn()
    },
    costumer: {
        findUniqueOrThrow: jest.fn(),
    },
};
