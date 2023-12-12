import Header from "./components/header/Header"
import { BrowserRouter, Router } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Footer from "./components/footer/Footer"
import "./styles/App.css"
import {setupAxios} from "./API/axiosConfig";
import {observer} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {checkAuth} from "./API/UserService";

const App = observer(() => {
    const { user } = useContext(Context);

    useEffect( async () => {
        try {
            await checkAuth();
            user.setUser(true);
            user.setIsAuth(true);
        } catch (error) {
            user.setUser(false);
            user.setIsAuth(false);
        }
    }, [user]);

    return (
        <BrowserRouter>
            <Header />
            <div className="mainContainer">
                <AppRouter />
            </div>
            <Footer />
        </BrowserRouter>
      );
})

export default App;
