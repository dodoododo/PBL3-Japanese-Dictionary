const API_URL = "http://localhost:8082/api/users";

export const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

export const isAdmin = () => {
  return localStorage.getItem("isAdmin") === "true";
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email, // nếu backend yêu cầu username
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Đăng ký thất bại");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", data.role === 2 ? "true" : "false");
      localStorage.setItem("userId", data.id.toString()); // Store user ID
      return { success: true, isAdmin: data.role === 2, userId: data.id };
    } else {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("userId");
};