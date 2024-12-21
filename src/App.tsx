import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import Calendar from './pages/Calendar';
// import Chart from './pages/Chart';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
const Error404 = lazy(() => import('./pages/Errors/Error404'));
const Error403 = lazy(() => import('./pages/Errors/Error403'));
import UnitReport from './pages/Report/Unit/UnitReport';
import UnitStock from './pages/Report/Unit/UnitStock';
import UnitStockDetail from './pages/Unit/Detail/UnitStockDetail';
import UnitHistory from './pages/Report/Unit/UnitHistory';
import DefaultLayout from './layout/DefaultLayout';

import routes from './routes';
const SignIn = lazy(() => import('./pages/Authentication/Signin'));

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
        containerStyle={{
          marginRight: 20,
          zIndex: 9999999,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Routes>
          <Route
            path="/auth/sign-in"
            element={authenticated ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route
            path="/"
            element={
              authenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/auth/sign-in" />
              )
            }
          />
          <Route element={<DefaultLayout />}>
            {/* Units Routes */}
            {routes.map((routes, index) => {
              const { path, component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      {React.createElement(component)}
                    </Suspense>
                  }
                />
              );
            })}
            {/* end of unit Routes */}
            {/* Event Routes */}
            {/* <Route path="events/event-list" element={<EventList />} />
            <Route
              path="events/event-list/:id"
              element={<DetailMasterEvent />}
            />
            <Route path="events/transfer-event" element={<TransferEvent />} />
            <Route
              path="events/transfer-event/form"
              element={<TransferEventForm />}
            />
            <Route
              path="events/transfer-event/:id"
              element={<TransferEventDetail />}
            />
            <Route path="events/return-event" element={<ReturnEvent />} />
            <Route
              path="events/return-event/:id"
              element={<ReturnEventDetail />}
            />
            <Route
              path="events/return-event/form"
              element={<ReturnEventForm />}
            /> */}
            {/* End Of Event Routes */}
            {/* Start of Neq Route */}
            {/* <Route
              path="neqs/transfer-neq/form"
              element={<TransferNeqForm />}
            />
            <Route path="neqs/transfer-neq" element={<TransferNeq />} />
            <Route
              path="neqs/transfer-neq/:id"
              element={<TransferNeqDetail />}
            />
            <Route path="neqs/return-neq/form" element={<ReturnNeqForm />} />
            <Route path="neqs/return-neq" element={<ReturnNeq />} />
            <Route path="neqs/return-neq/:id" element={<ReturnNeqDetail />} /> */}
            {/* End of Neq Route */}
            {/* Transaction Routes */}
            {/* <Route
              path="transaction/indent-instance"
              element={<IndentInstance />}
            />
            <Route
              path="transaction/indent-regular"
              element={<IndentRegular />}
            />
            <Route
              path="transaction/indent-regular/form"
              element={<AddIndentRegular />}
            />
            <Route
              path="transaction/indent-regular/:id"
              element={<IndentRegularDetail />}
            />
            <Route
              path="transaction/spk-regular/form"
              element={<AddSpkRegular />}
            />
            <Route path="transaction/spk-instance" element={<SpkInstance />} />
            <Route path="transaction/spk-regular" element={<SpkRegular />} />
            <Route path="transaction/cro" element={<CroCheck />} />
            <Route
              path="transaction/spk-regular/:id"
              element={<SpkRegularDetail />}
            /> */}
            {/* end of Transaction Routes */}
            {/* Report Routes */}
            <Route path="report/report-unit" element={<UnitReport />} />
            <Route path="report/stock-unit" element={<UnitStock />} />
            <Route
              path="report/stock-unit/:status"
              element={<UnitStockDetail />}
            />
            {/* end of Report Routes */}
            <Route path="report/history-unit" element={<UnitHistory />} />
          </Route>
          <Route path="*" element={<Error404 />} />
          <Route path="/403" element={<Error403 />} />
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
