import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

import HomePage from "./app/Home/HomePage.jsx";
import LoginPage from "./app/Login/LoginPage.jsx";
import RegistrationPage from "./app/Registration/RegistrationPage.jsx";
import DashboardPage from "./app/Dashboard/DashboardPage.jsx";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
]);

function App() {
  return (
    <>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </>
  );
}

export default App;
