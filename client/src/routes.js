import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Subscribe from "./pages/Subscribe";
import Registration from "./pages/Registration";
import {
    AUTH_ROUTE,
    CHANGE_EMAIL_ROUTE,
    CHANGE_PASSWORD_PAGE,
    CHANGE_PHONE_ROUTE,
    CHECK_AUTH_ROUTE, COLLAR_ROUTE,
    EMPLOYEES_ROUTE,
    ENTER_EMAIL_PAGE, FEEDER_ROUTE,
    MAIN_ROUTE, ONE_PET_ROUTE, PET_ROUTE,
    PROFILE_ROUTE,
    REGISTRATION_ROUTE,
    SHELTER_ROUTE,
    SUBSCRIBE_ROUTE,
    SUBSCRIBE_SUCCEED_ROUTE,
} from "./utils/const";
import Profile from "./pages/Profile";
import CheckAuthPage from "./pages/CheckAuthPage";
import ChangeEmail from "./pages/ChangeEmail";
import EnterEmailPage from "./pages/EnterEmailPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ChangePhonePage from "./pages/ChangePhonePage";
import ShelterPage from "./pages/ShelterPage";
import SubscribeSucceed from "./pages/SubscribeSucceed";
import EmployeesPage from "./pages/EmployeesPage";
import FeederPage from "./pages/FeederPage";
import PetPage from "./pages/PetPage";
import OnePetInfoPage from "./pages/OnePetInfoPage";
import CollarPage from "./pages/CollarPage";

export const authRoutes = [
    {
        path: SUBSCRIBE_ROUTE,
        Element: Subscribe
    },
    {
        path: PROFILE_ROUTE,
        Element: Profile
    },
    {
        path: CHECK_AUTH_ROUTE,
        Element: CheckAuthPage
    },
    {
        path: CHANGE_EMAIL_ROUTE,
        Element: ChangeEmail
    },
    {
        path: CHANGE_PHONE_ROUTE,
        Element: ChangePhonePage
    },

    {
        path: SHELTER_ROUTE,
        Element: ShelterPage
    },

];

export const shelterRoutes = [
    {
        path: EMPLOYEES_ROUTE,
        Element: EmployeesPage
    },
    {
        path: FEEDER_ROUTE,
        Element: FeederPage
    },
    {
        path: PET_ROUTE,
        Element: PetPage
    },
    {
        path: ONE_PET_ROUTE,
        Element: OnePetInfoPage
    },
    {
        path: COLLAR_ROUTE,
        Element: CollarPage
    },
]

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
    {
        path: ENTER_EMAIL_PAGE,
        Element: EnterEmailPage
    },
    {
        path: CHANGE_PASSWORD_PAGE,
        Element: ChangePasswordPage
    },
];