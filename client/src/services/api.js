export const registerUser = async (userData) => {
      const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
      });
      return await response.json();
};

export const loginUser = async (userData) => {
      const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
      });
      return await response.json();
};
