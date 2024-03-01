import React, { useState, useContext, useEffect, useRef } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { AuthContext } from '../AuthProvider/AuthProvider';
import axios from 'axios';

const Body = () => {
    useTitle('Home');
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const drawerRef = useRef(null);




    const links = (
        <>
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/'} className={location.pathname === '/' ? 'text-blue-400' : 'text-white'}>
                    Create Task
                </Link>
            </li>
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskCategories'} className={location.pathname === '/taskCategories' ? 'text-blue-400' : 'text-white'}>
                    Task Categories
                </Link>
            </li>
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskLists'} className={location.pathname === '/taskLists' ? 'text-blue-400' : 'text-white'}>
                    Task Lists
                </Link>
            </li>
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskAssignment'} className={location.pathname === '/taskAssignment' ? 'text-blue-400' : 'text-white'}>
                    Task Assignment
                </Link>
            </li>

            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/manageUsers'} className={location.pathname === '/manageUsers' ? 'text-blue-400' : 'text-white'}>
                    Manage Users
                </Link>
            </li>
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskStatusTracking'} className={location.pathname === '/taskStatusTracking' ? 'text-blue-400' : 'text-white'}>
                    Task Status Tracking
                </Link>
            </li>

        </>
    );

    const handleLogOut = () => {
        logOut()
            .then(() => {
                console.log('logged out')
                navigate('/login')
            })
            .catch(error => {
                console.log(error)
            })
    }


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <div>
            <div className="relative" ref={drawerRef}>
                <button
                    className="fixed left-0 top-0 m-4 p-2 bg-blue-400 shadow-2xl text-white rounded-full z-10 transition-transform ease-in-out duration-150 active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from propagating
                        setIsOpen(!isOpen);
                    }}
                >
                    {isOpen ? <AiOutlineClose /> : <AiOutlineMenu></AiOutlineMenu>}
                </button>

                <div className={`fixed left-0 top-0 h-full w-64 bg-blue-900 bg-opacity-70 backdrop-blur-md shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className='text-center text-white font-semibold mt-20  mx-6 h-[500px] custom-scrollbar overflow-auto'>
                        {user && (
                            <div className=''>
                                <img src={user?.photoURL} alt="User" className="w-20 border-2 border-white h-20 mx-auto rounded-full mb-2" />
                                <div className="text-lg">{user.displayName}</div>
                                <div className="text-sm">{user.email}</div>
                            </div>
                        )}
                        <ul className='space-y-2 mt-10'>
                            {links}
                        </ul>

                        {/* Logout button positioned at the bottom of the drawer */}
                        {user && (
                            <button onClick={handleLogOut} className="text-white bg-blue-400 px-4 py-2 w-11/12 rounded-md transition-transform ease-in-out duration-150 active:scale-95 absolute bottom-4 left-0 right-0 m-auto ">Logout</button>
                        )}
                    </div>
                </div>
            </div>
            {/* outlet */}
            <div className='md:pt-20 w-full lg:w-[1200px] 2xl:w-[1400px] mx-auto px-10 md:px-5 pt-10'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Body;
