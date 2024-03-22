import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    // Here you can add authentication logic, e.g., check if user is logged in
    const isAuthenticated = true; // Placeholder, replace with actual logic

    return (
        <Route
            {...rest}
            render={(props) => isAuthenticated ? <Component {...props} /> : <Redirect to="/" />}
        />
    );
};

export default PrivateRoute;
