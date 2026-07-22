import { storeGetInfo, storeRemoveItem, storeSaveInfo } from './StorageSystem';



const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const EXPIRES_AT = 'expiresAt';
const API_URL = 'apiUrl';

export async function login(apiUrl, email, password) {

  const response = await fetch(`${apiUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();

  await saveTokens(apiUrl, data);

  return data;
}

async function saveTokens(apiUrl, data) {
  await storeSaveInfo(API_URL, apiUrl);
  await storeSaveInfo(ACCESS_TOKEN, data.accessToken);
  await storeSaveInfo(REFRESH_TOKEN, data.refreshToken);

  const expiresAt = Date.now() + data.expiresIn * 1000;

  await storeSaveInfo(EXPIRES_AT, expiresAt.toString());
}

export async function getAccessToken() {
  const expiresAt = Number(
    await storeGetInfo(EXPIRES_AT)
  );

  const accessToken  = await storeGetInfo(ACCESS_TOKEN);

  if(accessToken   == null)
    return null;

  // refresh if less than 60 seconds remaining
  if (Date.now() >= expiresAt - 60000) {
    await refreshAccessToken();
  }

  return accessToken 
}

export async function refreshAccessToken() {
  const apiUrl = await storeGetInfo(API_URL);
  const refreshToken = await storeGetInfo(REFRESH_TOKEN);

  if (!apiUrl || !refreshToken) {
    throw new Error('Not logged in');
  }

  const response = await fetch(`${apiUrl}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = await response.json();

  await saveTokens(apiUrl, data);

  return data.accessToken;
}

export async function logout() {

    storeRemoveItem(ACCESS_TOKEN);
    storeRemoveItem(REFRESH_TOKEN);
    storeRemoveItem(EXPIRES_AT);

}