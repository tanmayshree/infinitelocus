import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token'); // Check if the user is logged in

    return (
        <nav className="bg-white shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">

                <Link to="/" className="text-2xl font-bold text-gray-800" onClick={() => setMobileMenuOpen(false)}>
                    MyApp
                </Link>

                <div className="md:hidden">
                    <button
                        className="text-gray-800 focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>

                <div className="hidden md:flex space-x-8 items-center">
                    <Link to="/" className="text-lg text-gray-700 hover:text-gray-900 font-medium">
                        Home
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/user-dashboard" className="text-lg text-gray-700 hover:text-gray-900 font-medium">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-lg text-gray-700 hover:text-gray-900 font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="text-lg text-gray-700 hover:text-gray-900 font-medium">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden mt-4 bg-white shadow-md rounded-lg p-4">
                    <div className="flex flex-col space-y-4">
                        <Link to="/" className="text-lg text-gray-700 hover:text-gray-900 font-medium" onClick={toggleMobileMenu}>
                            Home
                        </Link>

                        {isLoggedIn ? (
                            <>
                                <Link to="/user-dashboard" className="text-lg text-gray-700 hover:text-gray-900 font-medium" onClick={toggleMobileMenu}>
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-lg text-gray-700 hover:text-gray-900 font-medium" onClick={toggleMobileMenu}>
                                    Login
                                </Link>
                                <Link to="/register" className="text-lg text-gray-700 hover:text-gray-900 font-medium" onClick={toggleMobileMenu}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>

    );
};

export default Navbar;
