import Auth from "./pages/Auth";
import Main from "./pages/Main";
import Subscribe from "./pages/Subscribe";
import Registration from "./pages/Registration";
import {
    ADMIN_PANEL,
    ADOPTION_OFFER_ROUTE, ALL_ADOPTION_OFFER_ROUTE, ALL_WORK_OFFER_ROUTE, APPLICATION_FOR_ADOPTION_PAGE,
    AUTH_ROUTE,
    CHANGE_EMAIL_ROUTE,
    CHANGE_PASSWORD_PAGE,
    CHANGE_PHONE_ROUTE,
    CHECK_AUTH_ROUTE, COLLAR_ROUTE,
    EMPLOYEES_ROUTE,
    ENTER_EMAIL_PAGE, FEEDER_ROUTE, GENERAL_ADOPTION_OFFER_ROUTE,
    MAIN_ROUTE, ONE_ADOPTION_OFFER_ROUTE, ONE_PET_ROUTE, PET_ROUTE,
    PROFILE_ROUTE, PUBLIC_ONE_WORK_OFFER_ROUTE, PUBLIC_WORK_OFFER_ROUTE,
    REGISTRATION_ROUTE, SHELTER_ONE_WORK_OFFER_ROUTE,
    SHELTER_ROUTE, SHELTER_WORK_OFFER_ROUTE,
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
import AdoptionOfferPage from "./pages/AdoptionOfferPage";
import OneAdoptionOfferPage from "./pages/OneAdoptionOfferPage";
import AllAdoptionOfferPage from "./pages/AllAdoptionOfferPage";
import GeneralAdoptionOfferPage from "./pages/GeneralAdoptionOfferPage";
import ApplicationForAdoptionPage from "./pages/ApplicationForAdoptionPage";
import ShelterWorkOffersPage from "./pages/ShelterWorkOffersPage";
import ShelterOneWorkOfferPage from "./pages/ShelterOneWorkOfferPage";
import PublicWorkOfferPage from "./pages/PublicWorkOfferPage";
import singleWorkOfferPage from "./pages/SingleWorkOfferPage";
import AdminPanel from "./pages/AdminPanel";

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
    {
        path: ALL_ADOPTION_OFFER_ROUTE,
        Element: AllAdoptionOfferPage,
    },
    {
        path: GENERAL_ADOPTION_OFFER_ROUTE,
        Element: GeneralAdoptionOfferPage,
    },
    {
        path: PUBLIC_WORK_OFFER_ROUTE,
        Element: PublicWorkOfferPage
    },
    {
        path: PUBLIC_ONE_WORK_OFFER_ROUTE,
        Element: singleWorkOfferPage
    }
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
    {
        path: ADOPTION_OFFER_ROUTE,
        Element: AdoptionOfferPage
    },
    {
        path: ONE_ADOPTION_OFFER_ROUTE,
        Element: OneAdoptionOfferPage,
    },
    {
        path: APPLICATION_FOR_ADOPTION_PAGE,
        Element: ApplicationForAdoptionPage,
    },
    {
        path: SHELTER_WORK_OFFER_ROUTE,
        Element: ShelterWorkOffersPage,
    },
    {
        path: SHELTER_ONE_WORK_OFFER_ROUTE,
        Element: ShelterOneWorkOfferPage,
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

export const adminRoutes = [
    {
        path: ADMIN_PANEL,
        Element: AdminPanel,
    },
]