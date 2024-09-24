import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../components/AuthContext';
import { socket } from '../components/Home';

const UserDashboard = () => {
      const [events, setEvents] = useState([]); // State to store events
      const [loading, setLoading] = useState(true); // Loading state

      const navigate = useNavigate();

      const { user } = useContext(AuthContext); // Get user info
      const [notifications, setNotifications] = useState("");

      useEffect(() => {
            // Join user's room to receive notifications
            if (user && user.id) {
                  socket.emit('join', user.id);
                  console.log("joined")
            }

            // Listen for new notifications
            socket.on("newNotification", async (message) => {
                  console.log("first")
                  // alert()
                  setNotifications((prev) => [...prev, message]);
            });

            return () => {
                  socket.off('newNotification');
            };
      }, [user, socket]);

      // Fetch events from the backend
      useEffect(() => {
            const fetchEvents = async () => {
                  try {
                        const response = await fetch('/api/events', {
                              method: 'GET',
                              headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authentication
                              },
                        });
                        const data = await response.json();
                        if (Array.isArray(data))
                              setEvents(data); // Store events in state
                  } catch (err) {
                        console.error('Error fetching events:', err);
                  } finally {
                        setLoading(false); // Set loading to false after fetch completes
                  }
            };

            fetchEvents(); // Call the function to fetch events
      }, []);

      if (loading) {
            return (
                  <div className="flex justify-center items-center min-h-screen">
                        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-indigo-600"></div>
                        <span className="ml-2 text-gray-700">Loading events...</span>
                  </div>
            );
      }

      if (events.length === 0) {
            return (
                  <div className="flex flex-col items-center justify-center min-h-screen">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">No Events Available</h2>
                        <p className="text-gray-600">Check back later.</p>
                  </div>
            );
      }


      return (
            <div className="min-h-screen bg-gray-100 p-8">
                  <div className="container mx-auto">
                        <h1>Welcome, {user.name}</h1>

                        <div className="notifications">
                              <h2>Notifications</h2>
                              {notifications.length > 0 ? (
                                    <p>{notifications}</p>
                              ) : (
                                    <p>No new notifications</p>
                              )}
                        </div>

                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                              Event List
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                              {events.map((event) => (
                                    <div
                                          key={event._id}
                                          className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                          onClick={() => navigate(`/events/${event._id}`)}
                                    >
                                          <h3 className="text-xl font-semibold text-gray-900">
                                                {event.title}
                                          </h3>
                                          <p className="text-gray-700 mt-2">
                                                {event.description}
                                          </p>
                                          <p className="text-gray-600 mt-4">
                                                <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                                          </p>
                                          <p className="text-gray-600 mt-2">
                                                <span className="font-semibold">Location:</span> {event.location}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  </div>
            </div>

      );
};

export default UserDashboard;
