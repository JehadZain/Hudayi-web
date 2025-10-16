import { useContext, createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// utils

import post, { get } from '../utils/functions';
import axios from '../utils/axios';

import localStorageAvailable from '../utils/localStorageAvailable';
import { appLink, directory, version } from '../utils/varibles';

import { encryptString, getToken, getUser, isValidToken, setSession, setUser } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  const storageAvailable = localStorageAvailable();

  const accessToken = storageAvailable ? getToken() : '';
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? getToken() : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = getUser() || {};
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const response = await post('login', {
      username: email,
      password,
    });

    // Defensive checks: post() may return { api: 'ERROR', ... } or a non-standard shape
    if (!response) throw new Error('Empty response from authentication service');
    if (response.api === 'ERROR') {
      const msg = response.message || response.raw || 'Authentication service error';
      throw new Error(msg);
    }

    // Some backends return token/user at top-level, others under data
    const data = response.data || response;
    const { token, user, role } = data;
    if (!token) {
      throw new Error(response.message || 'Invalid login response: missing token');
    }
    const userData =
      role === 'teacher' ? { ...(data.user || {}), role, teacher_id: data.teacher_id } : { ...(data.user || {}), role };
    // const passphrase = 'J7t$PfUv*Q1#z3&yT2@k%L*!cG9^H+wA0^mS8*eI6!D4%pK5$';

    // const originalToken = JSON.stringify(token);
    // const encryptedToken = encryptString(originalToken, passphrase);
    setSession(token);

    const originalText = JSON.stringify(userData);
    // const encryptedText = encryptString(originalText, passphrase);
    setUser(originalText);
    dispatch({
      type: 'LOGIN',
      payload: {
        isAuthenticated: true,
        user: userData,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user, role } = response.data;

    sessionStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
        role,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
