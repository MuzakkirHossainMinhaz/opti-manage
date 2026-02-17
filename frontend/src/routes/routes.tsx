import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/dashboard/Dashboard";
import ActivityLog from "../pages/dashboard/ActivityLog";
import EyeGlasses from "../pages/dashboard/EyeGlasses";
import Invoice from "../pages/dashboard/sales/Invoice";
import SalesHistory from "../pages/dashboard/SalesHistory";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    element: <App />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "eye-glasses",
        element: <EyeGlasses />,
      },
      {
        path: "sales-history",
        element: <SalesHistory />,
      },
      {
        path: "activity-log",
        element: <ActivityLog />,
      },
      {
        path: "invoice-download/:id",
        element: <Invoice />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
