export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const login = (email, password) => {
  const demoUsers = [
    { email: 'admin@japaneasy.com', password: 'admin123', isAdmin: true },
    { email: 'user@japaneasy.com', password: 'user123', isAdmin: false },
  ];

  const user = demoUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('isAdmin', user.isAdmin.toString());
    return { success: true, isAdmin: user.isAdmin };
  } else {
    return { success: false, message: 'Email hoặc mật khẩu không đúng.' };
  }
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('isAdmin');
};
