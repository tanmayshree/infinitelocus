import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Register = () => {
      const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: ''
      });
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const { register } = useContext(AuthContext);

      const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);

            try {
                  register(formData, setError)
            } catch (err) {
                  setError('Something went wrong');
            } finally {
                  setLoading(false);
            }
      };

      return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200 p-4">
                  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                              Register
                        </h2>

                        {/* Error Message */}
                        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

                        {/* Loading Spinner */}
                        {loading ? (
                              <div className="flex justify-center items-center mb-4">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-indigo-600"></div>
                              </div>
                        ) : (
                              <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                          <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition"
                                          />
                                    </div>
                                    <div className="mb-4">
                                          <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition"
                                          />
                                    </div>
                                    <div className="mb-6">
                                          <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 transition"
                                          />
                                    </div>
                                    <button
                                          type="submit"
                                          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                          Register
                                    </button>
                              </form>
                        )}
                  </div>
            </div>

      );
};

export default Register;
