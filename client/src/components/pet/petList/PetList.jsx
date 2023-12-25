import React from 'react';
import PetItem from "../petItem/PetItem";
import stl from './PetList.module.css';
import { useTranslation} from "react-i18next";

const PetList = ({ pets, onDelete }) => {
    const { t } = useTranslation();

    return (
        pets.length !== 0 ?
           <div className={stl.petList}>
               {pets.map((pet) =>
                   <PetItem
                       key={pet.id}
                       pet={pet}
                       onDelete={(deleteSuccess) => onDelete(deleteSuccess)}
                   />
               )}
           </div>
            :
            <div className={stl.petEmptyContainer}>
                <h2>{t('noPets')}</h2>
            </div>
    );
};

export default PetList;