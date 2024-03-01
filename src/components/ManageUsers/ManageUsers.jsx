import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useTitle from "../hooks/useTitle";
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const usersPerPage = 5; // Number of users to display per page

    useEffect(() => {
        // Fetch user emails using Axios
        axios.get('http://localhost:5000/users')
            .then(response => {
                // Assuming response.data is an array of user objects
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useTitle('Manage Users');

    const handleAdminAction = (email, isAdmin) => {
        const action = isAdmin ? 'remove' : 'make';
        Swal.fire({
            title: `Are you sure you want to ${action} admin privileges for ${email}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const endpoint = isAdmin ? 'remove-admin' : 'make-admin';
                axios.post(`http://localhost:5000/${endpoint}`, { email })
                    .then(response => {
                        console.log(`Successfully ${action === 'make' ? 'made' : 'removed'} admin privileges for ${email}`);
                        // Update the users list to reflect the change
                        setUsers(prevUsers => {
                            return prevUsers.map(user => {
                                if (user.email === email) {
                                    // Update the user object to reflect admin status
                                    return { ...user, isAdmin: !isAdmin };
                                }
                                return user;
                            });
                        });
                        Swal.fire({
                            title: 'Success!',
                            text: `Admin privileges ${action === 'make' ? 'granted' : 'removed'} successfully for ${email}`,
                            icon: 'success',
                            timer: 2000,
                            timerProgressBar: true,
                            showConfirmButton: false
                        });
                    })
                    .catch(error => {
                        console.error(`Error ${action} admin privileges:`, error);
                        Swal.fire({
                            title: 'Error',
                            text: `Failed to ${action} admin privileges. Please try again later.`,
                            icon: 'error'
                        });
                    });
            }
        });
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='font-semibold mt-10'>
            <h1 className='text-3xl font-semibold text-blue-400'>Manage Users</h1>
            <div className="overflow-x-auto mt-10">
                <table className="min-w-full divide-y divide-blue-400">
                    <thead>
                        <tr className=' text-center'>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-blue-400 uppercase tracking-wider ">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-blue-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-blue-400">
                        {currentUsers.map((user, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        className="bg-blue-400 text-white font-bold py-2 px-4 rounded transition-transform ease-in-out duration-150 active:scale-95"
                                        onClick={() => handleAdminAction(user.email, user.isAdmin)}
                                    >
                                        {user.isAdmin ? 'Remove Manager' : 'Make Manager'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ul className="pagination flex items-center justify-center gap-3 mt-10 my-5">
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
                    <li key={index} className="page-item">
                        <button onClick={() => paginate(index + 1)} className={`page-link ${currentPage === index + 1 ? 'bg-blue-400 px-2 rounded-md  text-white font-semibold' : 'text-blue-400 active:scale-95 duration-150 ease-in-out transition-transform'}`}>
                            {index + 1}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageUsers;
