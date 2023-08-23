import { config } from 'tailchat-server-sdk';
import type { StrategyType } from './types';
import got from 'got';

const clientInfo = {
  id: process.env.IAM_CAS_ID,
  secret: process.env.IAM_CAS_SECRET,
};

const authorize_uri = process.env.IAM_CAS_URI_AUTHORIZE;
const access_token_uri = process.env.IAM_CAS_URI_ACCESS_TOKEN;
const userinfo_uri = process.env.IAM_CAS_URI_USERINFO;
const redirect_uri = `${config.apiUrl}/api/plugin:com.msgbyte.iam/cas/redirect`;

export const CASStrategy: StrategyType = {
  name: 'cas',
  type: 'oauth',
  icon: '/images/avatar/alert-logo.png',
  checkAvailable: () => !!clientInfo.id && !!clientInfo.secret,
  getUrl: () => {
    return `${authorize_uri}?client_id=${clientInfo.id}&redirect_uri=${redirect_uri}&response_type=code`;
  },
  getUserInfo: async (code) => {
    console.log('[cas oauth] authorization code:', code);

    const tokenResponse = await got
      .post(access_token_uri, {
        searchParams: {
          client_id: clientInfo.id,
          client_secret: clientInfo.secret,
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code',
        },
        headers: {
          accept: 'application/json',
        },
      })
      .json<{ access_token: string }>();

    const accessToken = tokenResponse.access_token;
    console.log(`[cas oauth] access token: ${accessToken}`);

    const result = await got
      .get(userinfo_uri + `?access_token=${accessToken}`, {
        headers: {
          accept: 'application/json',
        },
      })
      .json<{
        id: string;
        attributes: {
          accountID: string;
          realName: string;
          userNO: string;
          avatar_url: string;
          email: string;
        };
      }>();

    console.log(`[cas oauth] user info:`, result);
    return {
      id: String(result.id),
      nickname: result.attributes.realName ?? result.attributes.userNO,
      username: result.attributes.userNO,
      email: result.attributes.email,
      avatar: result.attributes.avatar_url,
    };
  },
};
