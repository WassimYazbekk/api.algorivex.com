import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/login";
import GuestLayout from "./layouts/guest-layout";
import DefaultLayout from "./layouts/default-layout";
import Loading from "./pages/loading";
import { lazy, Suspense } from "react";
import NotFound from "./pages/404";

const CreateSurvey = lazy(() =>
    import("./pages/create-survey").then((module) => ({
        default: module.default,
    })),
);
const Register = lazy(() =>
    import("./pages/register").then((module) => ({
        default: module.default,
    })),
);
const Surveys = lazy(() =>
    import("./pages/surveys").then((module) => ({
        default: module.default,
    })),
);
const PublicSurvey = lazy(() =>
    import("./pages/public-survey").then((module) => ({
        default: module.default,
    })),
);
const UpdateSurvey = lazy(() =>
    import("./pages/update-survey").then((module) => ({
        default: module.default,
    })),
);

const SurveyAnswers = lazy(() =>
    import("./pages/survey-answers").then((module) => ({
        default: module.default,
    })),
);
const Dashboard = lazy(() =>
    import("./pages/dashboard").then((module) => ({
        default: module.default,
    })),
);

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
                element: (
                    <Suspense fallback={<Loading />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: "/surveys",
                element: (
                    <Suspense fallback={<Loading />}>
                        <Surveys />
                    </Suspense>
                ),
            },
            {
                path: "/surveys/create",
                element: (
                    <Suspense fallback={<Loading />}>
                        <CreateSurvey />
                    </Suspense>
                ),
            },
            {
                path: "/surveys/:id",
                element: (
                    <Suspense fallback={<Loading />}>
                        <UpdateSurvey />
                    </Suspense>
                ),
            },
            {
                path: "/surveys/:id/answers",
                element: (
                    <Suspense fallback={<Loading />}>
                        <SurveyAnswers />
                    </Suspense>
                ),
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
                path: "/register",
                element: (
                    <Suspense fallback={<Loading />}>
                        <Register />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "/survey/public/:slug",
        element: (
            <Suspense fallback={<Loading />}>
                <PublicSurvey />
            </Suspense>
        ),
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
