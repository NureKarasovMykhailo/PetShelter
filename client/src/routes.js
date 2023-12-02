import Subscribe from "./pages/Subscribe";
import {AUTH_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, SUBSCRIBE_ROUTE} from "./utils/consts";
import Main from "./pages/Main";
import Auth from "./pages/Auth";

export const authRoutes = [
    {
        path: SUBSCRIBE_ROUTE,
        Component: <Subscribe />
    },
]

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: < Main />
    },
    {
        path: AUTH_ROUTE,
        Component: <Auth />
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth />
    },
]