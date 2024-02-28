import React, { useContext } from 'react';
import { AuthContext } from '../AuthProvider/AuthProvider';
import useTitle from '../hooks/useTitle';


const Body = () => {
    useTitle('Home');
    const { logOut } = useContext(AuthContext);

    const handleLogout = () => {
        logOut()
            .then(() => {
                console.log('Logged out successfully');
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div>
            <h1>Hello</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Body;
