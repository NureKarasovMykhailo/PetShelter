import React, { useContext, useEffect, useState } from 'react';
import '../styles/EmployeesPage.css';
import Button from "../components/UI/button/Button";
import Modal from "../components/UI/modal/Modal";
import AddEmployeeForm from "../components/employee/addEmployeeForm/AddEmployeeForm";
import EmployeeList from "../components/employee/eployeeList/EmployeeList";
import { fetchEmployee } from "../API/EmployeeService";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { getPagesArray } from "../utils/pagination";
import Pagination from "../components/UI/pagination/Pagination";
import Filter from "../components/filter/Filter";
import { fetchRoles } from "../API/UserService";
import Loader from "../components/UI/loader/Loader";
import MySelect from "../components/UI/input/mySelect/MySelect";
import SearchInput from "../components/UI/input/searchInput/SearchInput";
import { useTranslation } from 'react-i18next';

const EmployeesPage = observer(() => {
    const { employees } = useContext(Context);
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [isAddModalActive, setIsAddModalActive] = useState(false);
    const [addFormSuccess, setAddFormSuccess] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSort, setSelectedSort] = useState('');
    const [searchData, setSearchData] = useState('');
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [roleSuccess, setRoleSuccess] = useState(false);

    const [selectedFilter, setSelectedFilter] = useState({
        role: '',
    });

    const rolesFilterOptions = [];
    employees.getRoles().map((role) => {
        rolesFilterOptions.push({
            label: role.role,
            value: role.role_title
        })
    });

    const filters = [
        {label: t("sortingHeader"), options: rolesFilterOptions, defaultValue: t("sortingHeader"), name: 'role'}
    ];

    const sorting = [
        {label: t('ascendingSort'), value: 'asc'},
        {label: t('descendingSort'), value: 'desc'},
    ];

    useEffect(() => {
        fetchRoles().then(data => {
            employees.setRoles(data);
        });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchEmployee(limit, page, selectedFilter.role, selectedSort).then(data => {
            employees.setEmployees(data.employees);
            setTotalCount(data.pagination.totalItems);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
            setAddFormSuccess(false);
            setDeleteSuccess(false);
            setRoleSuccess(false);
        });
    }, [page, selectedFilter, selectedSort, addFormSuccess, deleteSuccess, roleSuccess]);

    const handleAddFormSuccess = (success) => {
        setAddFormSuccess(success);
        setIsAddModalActive(false);
    }

    const handleDeleteEmployee = (success) => {
        setDeleteSuccess(success);
    }

    const handleRoleFormSuccess = (success) => {
        setRoleSuccess(success);
    }

    const handleChangePage = async (newPage) => {
        setPage(newPage)
    }

    const handleSearchBtnClick = () => {
        setIsLoading(true);
        fetchEmployee(limit, page, selectedFilter.role, selectedSort, searchData).then(data => {
            employees.setEmployees(data.employees);
            setTotalCount(data.pagination.totalItems);
            setTotalPages(data.pagination.totalPages);
            setIsLoading(false);
        });
    }

    return (
        <div className={"employees-wrapper"}>
            <div className="employees-wrapper__employee-list employee-list">
                <div className={"employee-list__filter-container"}>
                    <Filter
                        filters={filters}
                        data={selectedFilter}
                        setData={setSelectedFilter}
                    />
                </div>
                <div className={"employee-list__container"}>
                    <div className={"employee-list__sort-container"}>
                        <div className={"employee-list__sorting"}>
                            <p className={"employee-list__sorting-header"}>{t('sortingHeader')}</p>
                            <MySelect
                                options={sorting}
                                onChange={(e) => setSelectedSort(e.target.value)}
                                value={selectedSort}
                                defaultValue={t('sortingHeader')}
                            />
                        </div>
                        <div className={"employee-list__find"}>
                            <SearchInput
                                data={searchData}
                                onChange={(search) => setSearchData(search)}
                                placeholder={t('searchPlaceholder')}
                                onClick={handleSearchBtnClick}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : employees.getEmployees().length > 0 ? (
                        <EmployeeList employees={employees.getEmployees()} onDelete={handleDeleteEmployee} onSuccess={handleRoleFormSuccess} />
                    ) : (
                        <div className={"employee-list__empty"}>
                            <p>{t('noEmployeesFound')}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="employees-wrapper__add-container">
                <div className="employee-wrapper__button-container">
                    {user.user.roles.includes('subscriber', 'workerAdmin') && (
                        <Button
                            buttonText={t('addEmployee')}
                            onClick={() => setIsAddModalActive(true)}
                        />
                    )}
                </div>
            </div>
            <div className="employee-wrapper__pagination-container">
                <Pagination
                    pagesArray={getPagesArray(totalPages)}
                    currentPage={page}
                    onClick={handleChangePage}
                />
            </div>

            <Modal
                active={isAddModalActive}
                setActive={setIsAddModalActive}
            >
                <AddEmployeeForm onSuccess={handleAddFormSuccess}/>
            </Modal>
        </div>
    );
});

export default EmployeesPage;
