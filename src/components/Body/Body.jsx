import React, { useState, useContext, useEffect, useRef } from 'react';
import { AiFillBell, AiOutlineBell, AiOutlineClose, AiOutlineMenu, AiOutlineNotification } from 'react-icons/ai';
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
    const [openBox, setOpenBox] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:5000/users/${user.email}`)
            .then(response => {
                const userData = response.data;
                const isAdmin = userData.length > 0 && userData[0].isAdmin;
                setIsAdmin(isAdmin);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [user]);



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
            {isAdmin && (<li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskAssignment'} className={location.pathname === '/taskAssignment' ? 'text-blue-400' : 'text-white'}>
                    Task Assignment
                </Link>
            </li>)}

            {isAdmin && ( // Check if user is admin
                <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                    <Link to={'/manageUsers'} className={location.pathname === '/manageUsers' ? 'text-blue-400' : 'text-white'}>
                        Manage Users
                    </Link>
                </li>
            )}
            <li className='transition-transform ease-in-out duration-150 active:scale-95'>
                <Link to={'/taskStatusTracking'} className={location.pathname === '/taskStatusTracking' ? 'text-blue-400' : 'text-white'}>
                    Task Status Tracking
                </Link>
            </li>

        </>
    );

    console.log(user.isAdmin)

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
                <div>
                    <button
                        className="fixed left-0 top-0 m-4 p-2 bg-blue-400 shadow-2xl text-white rounded-full z-50 transition-transform ease-in-out duration-150 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent click event from propagating
                            setIsOpen(!isOpen);
                        }}
                    >
                        {isOpen ? <AiOutlineClose /> : <AiOutlineMenu></AiOutlineMenu>}
                    </button>
                </div>
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
                <div className='absolute top-0 right-0 z-10'>
                    <button onClick={() => setOpenBox(!openBox)} className='bg-blue-400 shadow-2xl m-4 p-2 text-white rounded-full z-10 transition-transform ease-in-out duration-150 active:scale-95'>
                        {openBox ? <AiOutlineClose></AiOutlineClose> : <AiOutlineBell></AiOutlineBell>}
                    </button>
                    <div className='relative'>
                        {
                            openBox && (
                                <div className='w-80 h-60 z-10 absolute right-10 bg-white p-3 font-semibold rounded-lg overflow-auto shadow-2xl '>

                                </div>
                            )
                        }
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
