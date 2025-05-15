import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorNotFound from "./pages/ErrorNotFound";
import Dashboard from "./pages/Dashboard";
import DataMain from "./pages/DataMain";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorNotFound />,
        children: [
            {
                index : true,
                element: <Dashboard />
            },
            {
                path: "data-main",
                element: <DataMain  />
            }
        ]
     
    },
]);

export default router; 