import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
      const [formData, setFormData] = useState({
            title: '',
            description: '',
            date: '',
            location: ''
      });
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false); // State for loader
      const navigate = useNavigate();

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
                  const response = await fetch('http://127.0.0.1:5000/api/events/create', {
                        method: 'POST',
                        headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass the token for authentication
                        },
                        body: JSON.stringify(formData)
                  });

                  if (response.ok) {
                        // Redirect to the organizer dashboard if the event is successfully created
                        navigate(-1);
                  } else {
                        const data = await response.json();
                        setError(data.error || 'Failed to create event');
                  }
            } catch (err) {
                  console.error('Error:', err);
                  setError('Something went wrong');
            } finally {
                  setLoading(false); // Stop loader when the API call is done
            }
      };

      return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                  <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                              Create New Event
                        </h2>

                        {/* Error Message */}
                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        {/* Loading State */}
                        {loading ? (
                              <div className="flex justify-center items-center">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-gray-800"></div>
                              </div>
                        ) : (
                              <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                          <input
                                                type="text"
                                                name="title"
                                                placeholder="Title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                          />
                                    </div>

                                    <div>
                                          <textarea
                                                name="description"
                                                placeholder="Description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                                rows="4"
                                          />
                                    </div>

                                    <div>
                                          <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                          />
                                    </div>

                                    <div>
                                          <input
                                                type="text"
                                                name="location"
                                                placeholder="Location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                                          />
                                    </div>

                                    <button
                                          type="submit"
                                          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors"
                                    >
                                          Create Event
                                    </button>
                              </form>
                        )}
                  </div>
            </div>
      );
};

export default CreateEvent;
