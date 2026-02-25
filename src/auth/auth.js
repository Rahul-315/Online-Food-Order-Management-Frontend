import { jwtDecode } from "jwt-decode";
export const getToken = () => {
  return localStorage.getItem("token");
};

export const setAuth = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("authChange"));
};
export const logout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChange"));
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    logout(); 
    return false;
  }

  return true;
};
export const getRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
export const getUsername = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.username || "User";
  } catch {
    return null;
  }
};
