import CryptoJS from 'crypto-js';
import { appLink, directory, version } from './varibles';
import { HOST_API_KEY as ENV_HOST_API_KEY } from '../config-global';
import localStorageAvailable from './localStorageAvailable';

// تعريف رابط الأساس للAPI
const BASE_API_URL = ENV_HOST_API_KEY || `${appLink}/${directory}/${version}`;

// ----------------------------------------------------------------------

export const decryptString = (cipherText, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const getToken = () => {
  try {
    const token = sessionStorage.getItem('accessToken');
    return token;
  } catch (error) {
    return null;
  }
};

export default async function post(query, object, image) {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';

  const myHeaders = new Headers();
  if (image == null) {
    myHeaders.append('Content-Type', 'application/json');
  }
  myHeaders.append('Content-Type', 'application/json');
  if (query !== 'login') myHeaders.append('Authorization', `Bearer ${accessToken}`);
  const raw = JSON.stringify(object || {});
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: image == null ? raw : undefined,
    redirect: 'follow',
  };
  const url = `${BASE_API_URL.replace(/\/$/, '')}/${query}`;
  try {
    console.log('[API POST] url:', url);
    console.log('[API POST] body:', raw);
  } catch (err) {
  }

  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return {
          api: 'ERROR',
          status: response.status,
          raw: text,
          message: 'Non-JSON response from API',
        };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}

export async function putAsObject(query, object) {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  myHeaders.append('Content-Type', 'application/json');
  const raw = JSON.stringify(object);
  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const url = `${BASE_API_URL.replace(/\/$/, '')}/${query}`;
  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return { api: 'ERROR', status: response.status, raw: text };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}

export async function put(query, id) {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    redirect: 'follow',
  };

  const url = id != null ? `${BASE_API_URL.replace(/\/$/, '')}/${query}/${id}` : `${BASE_API_URL.replace(/\/$/, '')}/${query}`;
  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return { api: 'ERROR', status: response.status, raw: text };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}

export async function postFormData(query, object, image) {
  const myHeaders = new Headers();
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';
  myHeaders.append('Authorization', `Bearer ${accessToken}`);
  const formData = new FormData();
  const keys = Object.keys(object);

  keys.forEach((key) => {
    if (object[key] !== undefined && object[key] !== null) {
      if (key.startsWith('user__')) {
        const modifiedKey = `user[${key.substring(key.indexOf('__') + 2)}]`;

        formData.append(modifiedKey, object[key]);
      } else {
        formData.append(key, object[key]);
      }
    } else {
      console.log('Value is null or undefined');
    }
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
    redirect: 'follow',
  };
  const url = `${BASE_API_URL.replace(/\/$/, '')}/${query}`;
  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return { api: 'ERROR', status: response.status, raw: text };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}

export async function get(query, id, enqueueSnackbar) {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  const url = id != null ? `${BASE_API_URL.replace(/\/$/, '')}/${query}/${id}` : `${BASE_API_URL.replace(/\/$/, '')}/${query}`;
  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.api === 'FAILED') {
          const message = data.hints && (data.hints['0'] || data.hints['1'] || data.hints['2']) ? data.hints['0'] || data.hints['1'] || data.hints['2'] : data.api;
          if (enqueueSnackbar) enqueueSnackbar(message, { variant: 'error' });
        }
        return data;
      } catch (err) {
        return { api: 'ERROR', status: response.status, raw: text };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}

export async function convertTimeToDateTime(timeString) {
  const date = new Date();
  const [hours, minutes] = timeString.split(':');

  date.setFullYear(2023, 0, 1);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);

  const formattedDateTime = date.toLocaleString();
  return formattedDateTime;
}

export function sqlTime(time) {
  const dateString = time;
  const dateObject = new Date(dateString);

  const formattedDate = dateObject.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return formattedDate;
}
export function filterDate(time) {
  const dateString = time;
  const dateObject = new Date(dateString);

  const formattedDate = dateObject.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [month, day, year] = formattedDate.split('/');

  return `${year}-${month}-${day}`;
}

export const extractErrorMessage = (errorString) => {
  const startIdx = errorString.indexOf("'") + 1;
  const endIdx = errorString.indexOf("'", startIdx);
  return errorString.slice(startIdx, endIdx);
};

export async function deleteFunc(query, id) {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${accessToken}`);

  const requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow',
  };

  const baseUrl = ENV_HOST_API_KEY || `${appLink}/${directory}/${version}`;
  const url = `${baseUrl.replace(/\/$/, '')}/${query}/${id}`;
  return fetch(url, requestOptions)
    .then(async (response) => {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        return { api: 'ERROR', status: response.status, raw: text };
      }
    })
    .catch((error) => ({ api: 'ERROR', message: String(error) }));
}
