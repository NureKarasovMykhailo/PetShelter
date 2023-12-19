import React, { useContext } from "react";
import {Routes, Route} from 'react-router-dom';
import {authRoutes, publicRoutes, shelterRoutes} from "../routes";
import {Context} from '../index';
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const { user } = useContext(Context);
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

        </Routes>
    );
})

export default AppRouter;