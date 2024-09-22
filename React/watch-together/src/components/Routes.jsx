import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import AnimeList from "../pages/AnimeList";
import AnimePage from "../pages/AnimePage";
import WatchRoom from "../pages/WatchRoom";
import TestPage from "../pages/TestPage";
import Logout from "../pages/Logout";

const Routes = () => {
  const { token } = useAuth();

  // Define public routes accessible to all users
  const routesForPublic = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/series-list",
        element: <AnimeList />,
    },
    {
        path: "/anime/:id",
        element: <AnimePage />,
    },
    {
        path: "/room/:roomId",
        element: <WatchRoom />,
    },
    {
        path: "/test",
        element: <TestPage />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
            path: "/profile",
            element: <div>User Profile</div>,
        },
        {
            path: "/logout",
            element: <Logout />,
        },
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;