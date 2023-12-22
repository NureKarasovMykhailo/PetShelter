import React from 'react';
import PetItem from "../petItem/PetItem";
import stl from './PetList.module.css';

const PetList = ({ pets, onDelete }) => {
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
                <h2>Тварин не знайдено</h2>
            </div>
    );
};

export default PetList;