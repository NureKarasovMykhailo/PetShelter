import Header from "./components/header/Header"
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Footer from "./components/footer/Footer"
import "./styles/App.css"
import {observer} from "mobx-react-lite";
import {useContext, useEffect} from "react";
import {Context} from "./index";
import {checkAuth} from "./API/UserService";

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
            console.log(user.isAuth)
        };

        fetchData();
    }, []);

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
