// __mocks__/prisma.ts
export const prisma = {
    marcation: {
        findFirst: jest.fn(),
        create: jest.fn(),
    },
    costumer: {
        findUniqueOrThrow: jest.fn(),
    },
};
