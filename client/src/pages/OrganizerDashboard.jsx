import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteEvent from '../components/DeleteEvent';
import { AuthContext } from '../components/AuthContext';
import { socket } from '../components/Home';

const OrganizerDashboard = () => {
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);

      const { user } = useContext(AuthContext); // Get user info
      const [notifications, setNotifications] = useState("");

      useEffect(() => {
            // Join user's room to receive notifications
            if (user && user.id) {
                  socket.emit('join', user.id);
                  console.log("user", user.id);
            }

            // Listen for new notifications
            socket.on('newNotification', async (message) => {
                  console.log("newNotification", message);
                  setNotifications([message]);
            });

            return () => {
                  socket.off('newNotification');
                  // socket.on("disconnect");
            };

      }, [socket, user]);

      useEffect(() => {
            const fetchEvents = async () => {
                  setLoading(true);
                  const res = await fetch('/api/events', {
                        method: 'GET',
                        headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authentication
                        },
                  });
                  const data = await res.json();
                  if (Array.isArray(data)) {
                        setEvents(data);
                  }
                  setLoading(false);
            };

            fetchEvents();
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
                        <p className="text-gray-600">Check back later or create a new event.</p>
                        <Link
                              to="/create-event"
                              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 mt-4"
                        >
                              Create New Event
                        </Link>
                  </div>
            );
      }

      return (
            <div className="min-h-screen bg-gray-100 p-8">
                  <div className="container mx-auto">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                              Organizer Dashboard
                        </h1>

                        <h1>Welcome, {user.name}</h1>

                        <div className="notifications">
                              <h2>Notifications</h2>
                              {notifications.length > 0 ? (
                                    <p>{notifications}</p>
                              ) : (
                                    <p>No new notifications</p>
                              )}
                        </div>

                        <div className="flex justify-center mb-6">
                              <Link
                                    to="/create-event"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                              >
                                    Create New Event
                              </Link>
                        </div>

                        <ul className="space-y-4">
                              {events.map(event => (
                                    <li key={event._id} className="bg-white p-6 rounded shadow-md flex justify-between items-center">
                                          <div>
                                                <Link
                                                      to={`/events/${event._id}`}
                                                      className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300"
                                                >
                                                      {event.title}
                                                </Link>
                                          </div>
                                          <div className="flex space-x-4">
                                                <Link
                                                      to={`/events/${event._id}/edit`}
                                                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                                                >
                                                      Edit
                                                </Link>
                                                <DeleteEvent eventId={event._id} events={events} setEvents={setEvents} />
                                          </div>
                                    </li>
                              ))}
                        </ul>
                  </div>
            </div>
      );
};

export default OrganizerDashboard;
