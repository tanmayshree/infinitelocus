import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Use Link for navigation
import { AuthContext } from './AuthContext';
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000");

const Home = () => {
      const { user } = useContext(AuthContext);

      const [count, setCount] = useState("");

      useEffect(() => {
            socket.on("countUpdate", (data) => {
                  setCount(data)
                  console.log("Count data received:", data);
            });

            return () => {
                  socket.off("countUpdate");
            }
      }, [socket, user]);

      return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-8">
                  <h1 className="text-4xl font-bold text-gray-800 mb-8">
                        Welcome to Event Management Dashboard
                  </h1>

                  <div className="space-y-6">
                        <Link to={user.role === "user" ? "/user-dashboard" : "/organizer-dashboard"}>
                              <button className="mx-auto flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                                    </svg>
                                    <span className="text-lg font-medium">Browse Events</span>
                              </button>
                        </Link>

                        <div className="flex items-center justify-center space-x-2 text-gray-700">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M19 8v4m0 4h-7a3 3 0 00-3-3H5v-1h7a3 3 0 013-3h4V7a1 1 0 00-1-1h-1" />
                              </svg>
                              <p className="text-lg font-medium">
                                    No. of Registrations:
                                    <span className="font-semibold text-gray-900 ml-2">{count}</span>
                              </p>
                        </div>
                  </div>
            </div>
      );
};

export default Home;
