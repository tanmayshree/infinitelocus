import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Use Auth Context

const UserRoute = ({ children }) => {
      const { user } = useAuth(); // Get the user from context

      if (user?.role !== 'user') {
            return <Navigate to="/login" />; // Redirect if not an organizer
      }

      return children; // Render the component if the user is an organizer
};

export default UserRoute;
