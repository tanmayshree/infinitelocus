import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrganizerDashboard from './pages/OrganizerDashboard';
import UserDashboard from './pages/UserDashboard';
import EventDetail from './components/EventDetail';
import EditEvent from './components/EditEvent';
import CreateEvent from './components/CreateEvent';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import OrganizerRoute from './components/OrganizerRoute'; // Import OrganizerRoute
import UserRoute from './components/UserRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Organizer Routes */}
            <Route
              path="/create-event"
              element={
                <OrganizerRoute>
                  <CreateEvent />
                </OrganizerRoute>
              }
            />
            <Route
              path="/events/:id/edit"
              element={
                <OrganizerRoute>
                  <EditEvent />
                </OrganizerRoute>
              }
            />
            <Route
              path="/organizer-dashboard"
              element={
                <OrganizerRoute>
                  <OrganizerDashboard />
                </OrganizerRoute>
              }
            />

            <Route path="/user-dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              } />

            <Route path="/events/:id" element={<EventDetail />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
