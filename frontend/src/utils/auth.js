const TOKEN_KEY = "user_api_token";
const USER_KEY = "user_api_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function updateStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}
