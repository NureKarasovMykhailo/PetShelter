import React, { useContext } from "react";
import {Routes, Route, Navigate} from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes";
import { MAIN_ROUTE } from "../utils/const";
import {Context} from '../index';
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context);
    return (
        <Routes>
            {publicRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}
            {user.isAuth === true && authRoutes.map(({path, Element}) =>
                <Route key={path} path={path} element={<Element />} />
            )}

        </Routes>
    );
})

export default AppRouter;