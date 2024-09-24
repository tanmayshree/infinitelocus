import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Create context
export const AuthContext = createContext();

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details including role
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);

          if (location.pathname === "/login" || location.pathname === "/register") {
            if (data.role === "organizer")
              navigate("/organizer-dashboard")
            else
              navigate("/user-dashboard")
          }
        } else {
          if (location.pathname === "/register")
            navigate("/register")
          else
            navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const login = async (credentials, setError) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token in localStorage
        console.log("user", user)
        setUser(data)
        if (data.role === "organizer")
          navigate('/organizer-dashboard'); // Redirect to user dashboard
        else
          navigate('/user-dashboard'); // Redirect to user dashboard
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err);
    }
  };

  const register = async (credentials, setError) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token in localStorage
        console.log("user", user)
        setUser(data)
        if (data.role === "organizer")
          navigate('/organizer-dashboard'); // Redirect to user dashboard
        else
          navigate('/user-dashboard'); // Redirect to user dashboard
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError(err);
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
