import React from 'react';
import { Outlet } from 'react-router-dom';
import Body from '../Body/Body';

const Home = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Home;