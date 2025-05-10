import React, { useContext } from "react";
import {Routes, Route} from 'react-router-dom';
import {adminRoutes, authRoutes, publicRoutes, shelterRoutes} from "../routes";
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import adminPanel from "../pages/AdminPanel";

const AppRouter = observer(() => {
    const { user } = useContext(Context);
    console.log(user.user.roles)
    return (
        <Routes>
            {publicRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}
            {user.isAuth === true && authRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}
            {user.user.shelterId && shelterRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}
            {(user.user.roles && user.user.roles.indexOf('systemAdmin') !== -1 )
                && adminRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}

        </Routes>
    );
})

export default AppRouter;