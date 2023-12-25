import React from 'react';
import AdoptionOffersTable from "./tables/AdoptionOffersTable";
import ApplicationForAdoptionTable from "./tables/ApplicationForAdoptionTable";
import CollarInfoTable from "./tables/CollarInfoTable";
import CollarTable from "./tables/CollarTable";
import FeederInfoTable from "./tables/FeederInfoTable";
import FeederTable from "./tables/FeederTable";
import PetInfoTable from "./tables/PetInfoTable";
import PetTable from "./tables/PetTable";
import RoleTable from "./tables/RoleTable";
import ShelterTable from "./tables/ShelterTable";
import UserTable from "./tables/UserTable";
import WorkOffersTable from "./tables/WorkOffersTable";
import stl from './AdminRouter.module.css';

const AdminRouter = ( {selectedTable} ) => {

    let componentToRender;

    switch (selectedTable) {
        case 'adoption_offers':
            componentToRender = < AdoptionOffersTable />;
            break;
        case 'application_for_adoptions':
            componentToRender = < ApplicationForAdoptionTable />;
            break;
        case 'collar_infos':
            componentToRender = < CollarInfoTable />;
            break;
        case 'collars':
            componentToRender = < CollarTable />;
            break;
        case 'feeder_infos':
            componentToRender = < FeederInfoTable />;
            break;
        case 'feeders':
            componentToRender = < FeederTable />;
            break;
        case 'pet_characteristics':
            componentToRender = < PetInfoTable />;
            break;
        case 'pets':
            componentToRender = < PetTable />;
            break;
        case 'roles':
            componentToRender = < RoleTable />;
            break;
        case 'shelters':
            componentToRender = < ShelterTable/>;
            break;
        case 'users':
            componentToRender = < UserTable />;
            break;
        case 'work_offers':
            componentToRender = < WorkOffersTable />;
            break;
    }

    return (
        <div className={stl.adminRouterContainer} >
            {componentToRender}
        </div>
    );
};

export default AdminRouter;