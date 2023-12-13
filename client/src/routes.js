import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Subscribe from "./pages/Subscribe";
import Registration from "./pages/Registration";
import {
    AUTH_ROUTE,
    MAIN_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    SUBSCRIBE_ROUTE,
    SUBSCRIBE_SUCCEED
} from "./utils/const";
import Profile from "./pages/Profile";

export const authRoutes = [
    {
        path: SUBSCRIBE_ROUTE,
        Element: Subscribe
    },
    {
        path: PROFILE_ROUTE,
        Element: Profile
    },

];

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Element: Main
    },
    {
        path: AUTH_ROUTE,
        Element: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Element: Registration
    },
];