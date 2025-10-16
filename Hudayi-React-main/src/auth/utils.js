import CryptoJS from 'crypto-js';
import React from 'react';

// routes
import { PATH_AUTH } from '../routes/paths';
// utils
import axios from '../utils/axios';
// ----------------------------------------------------------------------

export const imageLink = 'https://www.hidayetnuru.org';

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    // localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    // tokenExpired(exp);
  } else {
    // sessionStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export const setUser = (user) => {
  if (user) {
    sessionStorage.setItem('user', user);
  } else {
    // sessionStorage.removeItem('user');
  }
};

export const getUser = () => {
  const user = sessionStorage.getItem('user');
  // const passphrase = 'J7t$PfUv*Q1#z3&yT2@k%L*!cG9^H+wA0^mS8*eI6!D4%pK5$';
  // const userString = decryptString(user, passphrase);
  return JSON.parse(user);
};

export const getToken = () => {
  try {
    const token = sessionStorage.getItem('accessToken');
    // const passphrase = 'J7t$PfUv*Q1#z3&yT2@k%L*!cG9^H+wA0^mS8*eI6!D4%pK5$';
    // const userToken = decryptString(token, passphrase);
    return token;
  } catch (error) {
    // sessionStorage.removeItem('accessToken');
    // sessionStorage.removeItem('user');
    return null;
  }
};

export const encryptString = (text, passphrase) => {
  const encrypted = CryptoJS.AES.encrypt(text, passphrase).toString();
  return encrypted;
};

export const decryptString = (cipherText, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
