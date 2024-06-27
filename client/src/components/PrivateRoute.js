import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        user && user.isAdmin ? (
            <Routes>
                <Route {...rest} element={<Component />} />
            </Routes>
        ) : (
            <Navigate to="/login" />
        )
    );
};

export default PrivateRoute;
