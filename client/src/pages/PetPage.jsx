import React, {useContext, useEffect, useState} from 'react';
import '../styles/PetPage.css';
import {observer} from "mobx-react-lite";
import {fetchKinds, fetchPets} from "../API/PetService";
import {Context} from "../index";
import PetList from "../components/pet/petList/PetList";
import Loader from "../components/UI/loader/Loader";
import Pagination from "../components/UI/pagination/Pagination";
import {getPagesArray} from "../utils/pagination";
import Filter from "../components/filter/Filter";
import MySelect from "../components/UI/input/mySelect/MySelect";
import SearchInput from "../components/UI/input/searchInput/SearchInput";
import {fetchEmployee} from "../API/EmployeeService";
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AddPetForm from "../components/pet/addPetForm/AddPetForm";

const PetPage = observer(() => {

    const { pets, user } = useContext(Context);
    const [addModalActive, setAddModalActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(4);
    const [selectedSort, setSelectedSort] = useState('');
    const [search, setSearch] = useState('');
    const [isAddSuccess, setIsAddSuccess] = useState(false);
    const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState({
        gender: '',
    });

    const petKinds = [];
    pets.getKinds().map((kinds) => {
        petKinds.push({
            label: kinds.pet_kind,
            value: kinds.pet_kind
        });
    })

    const filters = [
        {
            label: "Стать: ",
            defaultValue: "Стать",
            name: 'gender',
            options: [
                { label: "Самка", value: "самка" },
                { label: "Самець", value: "самець" },
            ]
        },
        {
            label: "Вид: ",
            defaultValue: "Вид",
            name: "petKind",
            options: petKinds
        }
    ];

    const sorting = [
        {label: 'Вік 0 - 99', value: 'asc', name: 'sortByAge'},
        {label: 'Вік: 99 - 0', value: 'desc', name: 'sortByAge'},
    ]

    const handleAddPet = (success) => {
        setIsAddSuccess(success);
        setAddModalActive(false);
    }

    useEffect(() => {
        setIsLoading(true);
        fetchPets(
            limit,
            page,
            selectedFilter.petKind,
            selectedFilter.gender,
            selectedSort
        ).then(data => {
           pets.setPets(data.pets);
            setTotalCount(data.pagination.totalItems)
            setTotalPages(data.pagination.totalPages)
        });
        fetchKinds().then(data => {
            pets.setKinds(data.message)
        })

        setIsLoading(false);
        setIsAddSuccess(false);
        setIsDeleteSuccess(false);
    }, [page, selectedFilter, selectedSort, isAddSuccess, isDeleteSuccess]);

    const handleSearchBtnClick = () => {
        setIsLoading(true);
        fetchPets(
            limit,
            page,
            selectedFilter.petKind,
            selectedFilter.gender,
            selectedSort,
            search
        ).then(data => {
            pets.setPets(data.pets);
            setTotalCount(data.pagination.totalItems)
            setTotalPages(data.pagination.totalPages)
        });
        fetchKinds().then(data => {
            pets.setKinds(data.message)
        })

        setIsLoading(false);
    }

    return (
        isLoading ?
            <div className={"pet-wrapper__loader"}>
                <Loader />
            </div>
            :
            <div className={"pet-wrapper"}>
                <div className="pet-wrapper__pet-list">
                    <div className={"pet-wrapper__filter"}>
                        <Filter
                            filters={filters}
                            setData={setSelectedFilter}
                            data={selectedFilter}
                        />
                    </div>
                    <div className={"pet-wrapper__pet-list-container"}>
                        <div className={"pet-wrapper__filter-sort-container"}>
                            <div className={"pet-wrapper__sort-container"}>
                                <h3 className={"pet-wrapper__sort-header"}>Сортування</h3>
                                <MySelect
                                    options={sorting}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    value={selectedSort}
                                    defaultValue={"Сортування"}
                                />
                            </div>
                            <SearchInput
                                placeholder={"кличка.."}
                                data={search}
                                onChange={(search) => setSearch(search)}
                                onClick={handleSearchBtnClick}
                            />
                        </div>
                        <PetList
                            pets={pets.getPets()}
                            onDelete={(success) => setIsDeleteSuccess(success)}
                        />
                        {(user.user.roles.includes('subscriber') || user.user.roles.includes('petAdmin')) &&
                            <div className={"pet-wrapper__add-pet"}>
                                <div className="pet-wrapper__add-pet-btn">
                                    <Button
                                        buttonText={"Додати тварину"}
                                        onClick={() => setAddModalActive(true)}
                                    />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="pet-wrapper__pagination-container">
                    <Pagination
                        pagesArray={getPagesArray(totalPages)}
                        currentPage={page}
                        onClick={(newPage) => setPage(newPage)}
                    />
                </div>
                <Modal
                    active={addModalActive}
                    setActive={setAddModalActive}
                >
                    <AddPetForm onAddSuccess={handleAddPet}/>
                </Modal>
            </div>
    );
});

export default PetPage;