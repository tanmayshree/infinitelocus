import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const [event, setEvent] = useState(null);
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [date, setDate] = useState('');
      const [location, setLocation] = useState('');
      const [loading, setLoading] = useState(true);
      const [message, setMessage] = useState('');

      // Fetch event details to prefill the form
      useEffect(() => {
            const fetchEvent = async () => {
                  try {
                        const res = await fetch(`/api/events/${id}`, {
                              method: 'GET',
                              headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                              },
                        });
                        const data = await res.json();

                        if (res.ok) {
                              setEvent(data);
                              setTitle(data.title);
                              setDescription(data.description);
                              setDate(new Date(data.date).toISOString().split('T')[0]);
                              setLocation(data.location);
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

      const handleSubmit = async (e) => {
            e.preventDefault();
            setMessage('');

            try {
                  const res = await fetch(`/api/events/${id}`, {
                        method: 'PUT',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ date, location }),
                  });

                  if (res.ok) {
                        const data = await res.json();
                        setMessage('Event updated successfully');
                        navigate(-1);
                  } else {
                        const data = await res.json();
                        setMessage(data.message || 'Error updating event.');
                  }
            } catch (err) {
                  setMessage('Error updating event.');
            }
      };

      if (loading) {
            return <p>Loading event details...</p>;
      }

      if (!event) {
            return <p>{message || 'Event not found'}</p>;
      }

      return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200 py-10">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                              Edit Event
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                              <div>
                                    <label className="block text-gray-700 mb-2">Title:</label>
                                    <input
                                          type="text"
                                          value={title}
                                          disabled
                                          readOnly
                                          className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                                    />
                              </div>
                              <div>
                                    <label className="block text-gray-700 mb-2">Description:</label>
                                    <textarea
                                          value={description}
                                          disabled
                                          readOnly
                                          className="w-full p-3 border border-gray-300 rounded bg-gray-100"
                                    />
                              </div>
                              <div>
                                    <label className="block text-gray-700 mb-2">Date:</label>
                                    <input
                                          type="date"
                                          value={date}
                                          onChange={(e) => setDate(e.target.value)}
                                          required
                                          className="w-full p-3 border border-gray-300 rounded"
                                    />
                              </div>
                              <div>
                                    <label className="block text-gray-700 mb-2">Location:</label>
                                    <input
                                          type="text"
                                          value={location}
                                          onChange={(e) => setLocation(e.target.value)}
                                          required
                                          className="w-full p-3 border border-gray-300 rounded"
                                    />
                              </div>
                              <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                              >
                                    Update Event
                              </button>
                        </form>

                        {message && (
                              <p className="text-green-600 mt-4 text-center">
                                    {message}
                              </p>
                        )}
                  </div>
            </div>

      );
};

export default EditEvent;
