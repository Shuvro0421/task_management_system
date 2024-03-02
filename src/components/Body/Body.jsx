import React, { useState, useContext, useEffect, useRef } from 'react';
import { AiFillBell, AiOutlineBell, AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
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
    const [openBox, setOpenBox] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
    const [notificationCount, setNotificationCount] = useState(0); // State for notification count
    const [userUserId, setUserUserId] = useState([])
    const [contentBox, setContentBox] = useState([])

    useEffect(() => {
        if (!user) return;
        axios.get(`http://localhost:5000/users/${user.email}`)
            .then(response => {
                const userData = response.data;
                const isAdmin = userData.length > 0 && userData[0].isAdmin;
                setIsAdmin(isAdmin);
                setUserUserId(userData);

                // Fetch new task assignments after setting userUserId
                fetchNewTaskAssignments(userData);
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [user]);

    // Function to fetch new task assignments
    const fetchNewTaskAssignments = (userData) => {
        axios.get('http://localhost:5000/assign-tasks')
            .then(response => {
                const newTasks = response.data.filter(task => task?.userId === userData[0]?._id); // Exclude tasks sent by the current user
                let approachingDeadlineCount = 0;

                // Check deadline for each task
                newTasks.forEach(task => {
                    // Calculate the difference between the current date and the deadline
                    const deadlineDate = new Date(task.dueDate);
                    const currentDate = new Date();
                    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
                    const daysDifference = timeDifference / (1000 * 3600 * 24);

                    if (daysDifference <= 3) {
                        // If the deadline is within 3 days, modify the content to indicate the approaching deadline
                        task.title = `${task.title} - Deadline Approaching`;
                        approachingDeadlineCount++;
                    }
                });

                // Update notification count with tasks approaching deadline
                setNotificationCount(notificationCount => notificationCount + approachingDeadlineCount);
                setContentBox(newTasks);
            })
            .catch(error => {
                console.error('Error fetching new task assignments:', error);
            });
    };


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
                <div className='fixed top-0 right-0 z-10'>
                    <button onClick={() => setOpenBox(!openBox)} className='bg-blue-400 relative shadow-2xl m-4 p-2 text-white rounded-full z-10 transition-transform ease-in-out duration-150 active:scale-95'>
                        {openBox ? <AiOutlineClose /> : <AiOutlineBell />}
                        {notificationCount > 0 && <h1 className='absolute top-0 right-5 font-semibold px-1 rounded-full text-xs bg-blue-400 text-white'>{notificationCount}</h1>}
                    </button>
                    <div className='relative'>
                        {openBox && (
                            <div className='w-80 h-60 z-10 absolute right-10 bg-white p-3 font-semibold rounded-lg overflow-auto shadow-2xl'>
                                {
                                    contentBox.map((content, index) => (
                                        <div key={index}>
                                            <div className='p-2  my-2 border-b-2'>
                                                <h1 className=''>{content?.title}</h1>
                                                <h1 className='text-xs'>
                                                    {content?.description.length >= 40
                                                        ? content?.description.slice(0, 40) + '...'
                                                        : content?.description
                                                    }
                                                </h1>
                                                {/* Display deadline if provided */}
                                                {content.deadline && (
                                                    <p className="text-sm">Deadline: {content.deadline}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
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
