const TOKEN_KEY = "user_api_token";
const USER_KEY = "user_api_user";
const LOGIN_LOADER_KEY = "show_home_loader";

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

export function markLoginTransition() {
  sessionStorage.setItem(LOGIN_LOADER_KEY, "true");
}

export function consumeLoginTransition() {
  const shouldShow = sessionStorage.getItem(LOGIN_LOADER_KEY) === "true";

  if (shouldShow) {
    sessionStorage.removeItem(LOGIN_LOADER_KEY);
  }

  return shouldShow;
}
