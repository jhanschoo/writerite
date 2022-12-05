/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { YogaInitialContext } from 'graphql-yoga';
import { PrismaClient } from '@prisma/client';
import { Context } from '../../src/context';
import { WrServer, createGraphQLApp } from '../../src/graphqlApp';
import { mutationCreateUser, queryHealth, testContextFactory } from '../helpers';
import { cascadingDelete } from './_helpers/truncate';

describe('server', () => {
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let server: WrServer;

  beforeAll(() => {
    [, context, stopContext, { prisma }] = testContextFactory();
    server = createGraphQLApp({ context, logging: false });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  it('should be able to respond to a health check', async () => {
    expect.assertions(1);
    const response = await queryHealth(server);
    expect(response).toHaveProperty('data.health', 'OK');
  });

  it('should be able to respond to a basic create user', async () => {
    expect.assertions(1);
    const response = await mutationCreateUser(server);
    expect(response).toHaveProperty('data.finalizeOauthSignin.token', expect.any(String));
  });
});
