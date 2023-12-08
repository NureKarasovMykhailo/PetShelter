import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Subscribe from "./pages/Subscribe";
import Registration from "./pages/Registration";
import { AUTH_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, SUBSCRIBE_ROUTE } from "./utils/const";

export const authRoutes = [
    {
        path: SUBSCRIBE_ROUTE,
        Element: Subscribe
    }
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