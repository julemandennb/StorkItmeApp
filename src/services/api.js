import { storeGetInfo } from './StorageSystem';
import { getAccessToken } from './auth';

export async function apiGet(path) {
  
  try
  {
    const apiUrl = await storeGetInfo('apiUrl');
    if (!apiUrl) {
      return null;
    }
    
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return null;
    }
    
    const response = await fetch(`${apiUrl}${path}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    return response.json();
  }catch (error) {
    console.error('API GET error:', error);
    return null;
  }
  
}

export async function apiPost(path, data) {
  try {
    const apiUrl = await storeGetInfo('apiUrl');

    const accessToken = await getAccessToken();

    if (!apiUrl) {
      return null;
    }

    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${apiUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    return response.json();

  } catch (error) {
    console.error('API POST error:', error);
    return null;
  }
}

export async function apiPut(path, data) {
  try {
    const apiUrl = await storeGetInfo('apiUrl');
    const accessToken = await getAccessToken();

    if (!apiUrl) {
      return null;
    }
    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${apiUrl}${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API PUT error:', error);
    return null;
  }
}

export async function GetApiUrl() {
  const apiUrl = await storeGetInfo('apiUrl');
  return apiUrl;
}