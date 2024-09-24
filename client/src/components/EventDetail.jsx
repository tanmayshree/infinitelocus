import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const EventDetail = () => {
      const { id } = useParams();
      const [event, setEvent] = useState(null);
      const [loading, setLoading] = useState(true);
      const [message, setMessage] = useState('');
      const navigate = useNavigate();

      const { user } = useContext(AuthContext);
      const [displayRegisterBtn, setDisplayRegisterBtn] = useState(true);

      useEffect(() => {
            const fetchEvent = async () => {
                  try {
                        const res = await fetch(`/api/events/${id}`, {
                              method: 'GET',
                              headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authentication
                              },
                        });
                        const data = await res.json();

                        if (res.ok) {
                              setEvent(data);
                              console.log("620555", data)
                              console.log("6205551", user.id)

                              setDisplayRegisterBtn(data.registrations.filter((it) => it == user.id).length == 0);
                        } else {
                              setMessage(data.message);
                        }
                  } catch (err) {
                        setMessage('Error fetching event details.');
                  } finally {
                        setLoading(false);
                  }
            };

            fetchEvent();
      }, [id]);

      // Handle event registration
      const registerForEvent = async () => {
            try {
                  const res = await fetch(`/api/events/${id}/register`, {
                        method: 'POST',
                        headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                  });

                  if (res.ok) {
                        setMessage('Successfully registered!');
                        setDisplayRegisterBtn(false)
                  } else {
                        const data = await res.json();
                        setMessage(data.message || 'Error registering for event.');
                  }
            } catch (err) {
                  setMessage('Error registering for event.');
            }
      };

      if (loading) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-gray-200">
                        <p className="text-lg text-gray-700">Loading event...</p>
                  </div>
            );
      }

      if (!event) {
            return (
                  <div className="min-h-screen flex items-center justify-center bg-gray-200">
                        <p className="text-lg text-gray-700">{message || 'Event not found.'}</p>
                  </div>
            );
      }


      return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200 py-10">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                              {event.title}
                        </h1>
                        <p className="text-gray-700 text-lg mb-4">
                              {event.description}
                        </p>
                        <p className="text-gray-600 mb-2">
                              <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 mb-6">
                              <span className="font-semibold">Location:</span> {event.location}
                        </p>
                        {
                              displayRegisterBtn ? (
                                    <button
                                          onClick={registerForEvent}
                                          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                          Register
                                    </button>
                              ) : (
                                    <p className="text-green-600 mt-4">
                                          {message.length === 0 ? "Already registered" : message}
                                    </p>
                              )
                        }
                  </div>
            </div>

      );
};

export default EventDetail;
