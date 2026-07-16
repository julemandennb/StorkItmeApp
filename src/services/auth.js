import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';



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
  await saveInfo(API_URL, apiUrl);
  await saveInfo(ACCESS_TOKEN, data.accessToken);
  await saveInfo(REFRESH_TOKEN, data.refreshToken);

  const expiresAt = Date.now() + data.expiresIn * 1000;

  await saveInfo(EXPIRES_AT, expiresAt.toString());
}

export async function getAccessToken() {
  const expiresAt = Number(
    await getInfo(EXPIRES_AT)
  );

  // refresh if less than 60 seconds remaining
  if (Date.now() >= expiresAt - 60000) {
    await refreshAccessToken();
  }

  return getInfo(ACCESS_TOKEN);
}

export async function refreshAccessToken() {
  const apiUrl = await getInfo(API_URL);
  const refreshToken = await getInfo(REFRESH_TOKEN);

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

async function saveInfo(key, data) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, data);
        } else { // mobile
            await SecureStore.setItemAsync(key, data.toString());
        }
    } catch (error) {
        console.error("Error saving data:", error); 
    }
}

async function getInfo(key) {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        }
        else { // mobile
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
}

export async function logout() {
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(API_URL);
        await AsyncStorage.removeItem(ACCESS_TOKEN);
        await AsyncStorage.removeItem(REFRESH_TOKEN);
        await AsyncStorage.removeItem(EXPIRES_AT);
    } else { // mobile
        await SecureStore.deleteItemAsync(API_URL);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(EXPIRES_AT);
    }
}
