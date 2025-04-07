export const ADMIN_CREDENTIALS = {
  email: 'admin@japaneasy.com',
  password: 'admin123'
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const login = (email, password) => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAdmin', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('isAdmin');
}; 