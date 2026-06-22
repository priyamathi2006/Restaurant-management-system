const BASE_URL = import.meta.env.VITE_API_URL || "http://10.101.73.97:5001/api";

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response, endpoint) => {
  if (
    response.status === 401 && 
    !endpoint.includes("/auth/login") && 
    !endpoint.includes("/auth/register")
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return { success: false, message: "Session expired. Redirecting to login..." };
  }
  return response.json();
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse(response, endpoint);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response, endpoint);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response, endpoint);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(response, endpoint);
  },
};

