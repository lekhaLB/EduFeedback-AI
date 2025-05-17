// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import History from './History.tsx';
// import AddCourse from './AddCourse.tsx';
// import AddQuestion from './AddQuestion.tsx';
// import SignIn from './pages/SignIn.tsx';
// import SignUp from './pages/SignUp.tsx';
// import ProtectedRoute from './components/ProtectedRoute.tsx';
// import './index.css';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Navigate to="/signin" replace />,
//   },
//   {
//     path: "/signin",
//     element: <SignIn />,
//   },
//   {
//     path: "/signup",
//     element: <SignUp />,
//   },
//   {
//     path: "/history",
//     element: (
//       <ProtectedRoute allowedRole="student">
//         <History />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: "/add-course",
//     element: (
//       <ProtectedRoute allowedRole="teacher">
//         <AddCourse />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: "/add-question",
//     element: (
//       <ProtectedRoute allowedRole="teacher">
//         <AddQuestion />
//       </ProtectedRoute>
//     ),
//   },
//   // Catch-all redirect to appropriate home page based on role
//   {
//     path: "*",
//     element: <Navigate to="/signin" replace />,
//   },
// ]);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import History from './History.tsx';
import AddCourse from './AddCourse.tsx';
import AddQuestion from './AddQuestion.tsx';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import SummaryFeedback from './SummaryFeedback.tsx';
import Bloom from './bloom.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/signin" replace />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute allowedRole="student">
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: "/summary",
    element: (
      <ProtectedRoute allowedRole="student">
        <SummaryFeedback />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-course",
    element: (
      <ProtectedRoute allowedRole="teacher">
        <AddCourse />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-question",
    element: (
      <ProtectedRoute allowedRole="teacher">
        <AddQuestion />
      </ProtectedRoute>
    ),
  },
  {
    path: "/blooms",
    element: (
      <ProtectedRoute allowedRole="teacher">
        <Bloom />
      </ProtectedRoute>
    ),
  },
  // Catch-all redirect to appropriate home page based on role
  {
    path: "*",
    element: <Navigate to="/signin" replace />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);