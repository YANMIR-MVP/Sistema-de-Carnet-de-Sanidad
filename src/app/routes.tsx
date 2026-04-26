import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { CajaDashboard } from "./pages/CajaDashboard";
import { Consultorio } from "./pages/Consultorio";
import { EmisionPDF } from "./pages/EmisionPDF";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/caja" replace /> },
      { path: "caja", element: <CajaDashboard /> },
      { path: "consultorio", element: <Consultorio /> },
      { path: "emision/:id", element: <EmisionPDF /> },
      { path: "*", element: <Navigate to="/caja" replace /> },
    ],
  },
]);
