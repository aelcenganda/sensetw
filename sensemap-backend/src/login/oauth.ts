import { Client, User, Token, AuthorizationCode } from 'oauth2-server';
import OAuthServer = require('express-oauth-server');
import { context } from '../context';
import * as U from '../types/user';

const { db } = context({ req: null });

export const hypothesisClient = {
  id: '00e468bc-c948-11e7-9ada-33c411fb1c8a',
  grants: ['authorization_code'],
  name: 'Hypothesis API',
  redirectUris: ['http://localhost:3000/', 'https://h.sense.tw/oauth/authorize'],
};

const getClient = async (id: string, secret?: string): Promise<Client> => {
  if (id === hypothesisClient.id) {
    return hypothesisClient;
  } else {
    return null;
  }
};

const getUser = async (id: string): Promise<User> => {
  return U.getUser(db, id);
};

const getAccessToken = async (accessToken: string): Promise<Token> => {
  const rows = await db.select('*').from('oauth_token').where('accessToken', accessToken);
  if (rows.length === 0) {
    return null;
  }
  return {
    ...rows[0],
    client: getClient(rows[0].clientId),
    user: getUser(rows[0].userId),
  };
};

const saveToken = async (token: Token, client: Client, user: User): Promise<Token> => {
  const rows = db('oauth_token').insert({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    clientId: client.id,
    userId: user.id,
  }).returning('*');
  return rows[0];
};

const getAuthorizationCode = async (authorizationCode: string): Promise<AuthorizationCode> => {
  const rows = await db.select('*').from('oauth_authorization_code').where('authorizationCode', authorizationCode);
  if (rows.length === 0) {
    return null;
  }
  return {
    ...rows[0],
    client: getClient(rows[0].clientId),
   user: getUser(rows[0].userId),
  };
};

const saveAuthorizationCode = async (code: AuthorizationCode, client: Client, user: User): Promise<AuthorizationCode> => {
  const values = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    client,
    user,
  };
  const rows = db('oauth_authorization_code').insert({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    clientId: client.id,
    userId: user.id,
  });
  return values;
};

const verifyScope = async (token: Token, scope: string): Promise<boolean> => {
  return true;
}

const model = {
  getClient,

  getAccessToken,
  saveToken,

  getAuthorizationCode,
  saveAuthorizationCode,

  verifyScope,
};

const oauth = new OAuthServer({ model });

export default oauth;
