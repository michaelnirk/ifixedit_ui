import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/containers/HomePage.jsx";
import ContactPage from "@/containers/Contact.jsx";
import NotFoundPage from "@/containers/NotFoundPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "*", 
    element: <NotFoundPage />
  },
]);