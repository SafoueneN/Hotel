import { useSyncExternalStore } from 'react';
import keycloak from './keycloak';

const listeners = new Set();
keycloak.onAuthSuccess = () => listeners.forEach((l) => l());
keycloak.onAuthLogout = () => listeners.forEach((l) => l());
keycloak.onAuthRefreshSuccess = () => listeners.forEach((l) => l());

function subscribe(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return keycloak.authenticated ? keycloak.token : null;
}

export function useAuth() {
  useSyncExternalStore(subscribe, getSnapshot);

  const authenticated = !!keycloak.authenticated;
  const roles = keycloak.tokenParsed?.realm_access?.roles || [];

  return {
    authenticated,
    username: keycloak.tokenParsed?.preferred_username,
    email: keycloak.tokenParsed?.email,
    roles,
    isAdmin: roles.includes('ADMIN'),
    login: () => keycloak.login(),
    logout: () => keycloak.logout({ redirectUri: window.location.origin }),
  };
}
