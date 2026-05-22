

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const getHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const api = {
  post: async (endpoint, body, includeAuth = true) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(includeAuth),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },
};

