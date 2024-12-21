import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children, ...rest }: any) => {
  return (
    <Route
      {...rest}
      element={token ? children : <Navigate to="/auth/sign-in" />}
    />
  );
};

export default ProtectedRoute;
