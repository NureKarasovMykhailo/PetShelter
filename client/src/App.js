// App.jsx
import React, { useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { checkAuth } from "./API/UserService";
import Header from "./components/header/Header";
import AppRouter from "./components/AppRouter";
import Footer from "./components/footer/Footer";
import "./styles/App.css";

const App = observer(() => {
    const { user } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await checkAuth();
                user.setUser(userData);
                user.setIsAuth(true);
            } catch (error) {
                user.setUser(false);
                user.setIsAuth(false);
            }
            console.log(user.isAuth);
        };

        fetchData().then();
    }, []);

    return (
        <BrowserRouter>
            <Header className="app-header" />
            <div className="app-main-container">
                <AppRouter className="app-router" />
            </div>
            <Footer className="app-footer" />
        </BrowserRouter>
    );
});

export default App;
