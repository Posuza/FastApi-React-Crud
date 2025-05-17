import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ErrorNotFound from "./pages/ErrorNotFound";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProductDetail from "./pages/ProductDetail";

const router = createBrowserRouter([
    {
        path: "/auth",
        element: <Auth />,
        errorElement: <ErrorNotFound />,
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        errorElement: <ErrorNotFound />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "items",
                element: <Items />,
            },
            {
                path: "product/:id",
                element: <ProductDetail />
            }
        ],
    },
]);

export default router;