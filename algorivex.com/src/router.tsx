import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Surveys from "./pages/surveys";
import Login from "./pages/login";
import Register from "./pages/register";
import GuestLayout from "./layouts/guest-layout";
import DefaultLayout from "./layouts/default-layout";
import CreateSurvey from "./pages/create-survey";
import UpdateSurvey from "./pages/update-survey";
import PublicSurvey from "./pages/public-survey";
import SurveyAnswers from "./pages/survey-answers";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Navigate to="/" />,
            },
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/surveys",
                element: <Surveys />,
            },
            {
                path: "/surveys/create",
                element: <CreateSurvey />,
            },
            {
                path: "/surveys/:id",
                element: <UpdateSurvey />,
            },
            {
                path: "/surveys/:id/answers",
                element: <SurveyAnswers />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Register />,
            },
        ],
    },
    {
        path: "/survey/public/:slug",
        element: <PublicSurvey />,
    },
]);

export default router;
