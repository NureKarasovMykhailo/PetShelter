import React, {useContext, useState} from 'react';
import styles from './EmployeeItem.module.css';
import Button from "../../UI/button/Button";
import {deleteEmployee} from "../../../API/EmployeeService";
import Modal from "../../UI/modal/Modal";
import ErrorString from "../../UI/error/errorString/ErrorString";
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import EmployeeRole from "../employeeRole/EmployeeRole";

const EmployeeItem = observer(( {employee, onDelete, onSuccess} ) => {
    const handleDeleteBtnClick = async () => {
        try {
            await deleteEmployee(employee.id);
            onDelete(true);
        } catch (error) {
            setIsModalActive(true);
            setErrorString(error.response.data.message);
        }
    }
    const handleSuccess = (success) => {
        onSuccess(success)
    }
    const [isModalActive, setIsModalActive] = useState(false);
    const [isRoleModalActive, setRoleModalActive] = useState(false);
    const [errorString, setErrorString] = useState('');
    const { user } = useContext(Context);

    return (
        <div className={styles.employeeItemContainer}>
            <div className={styles.employeeItemImageContainer}>
                <img
                    className={styles.employeeItemImage}
                    src={process.env.REACT_APP_API_URL + employee.user_image}
                    alt={"Image not found"}
                />
            </div>
            <div className={styles.employeeItemInfoContainer}>
                <p>Домений адрес: {employee.domain_email}</p>
                <p>Email: {employee.email}</p>
                <p>{employee.full_name}</p>
                <p>{employee.phone_number}</p>
            </div>
            <div className={styles.employeeItemButtonsContainer}>
                {user.user.roles.includes('subscriber', 'workerAdmin') &&
                    <div className={styles.employeeItemButtonsContainer}>
                        <div className={styles.employeeItemButton}>
                            <Button
                                buttonText={"Видалити"}
                                onClick={handleDeleteBtnClick}
                            />
                        </div>
                        <div className={styles.employeeItemButton}>
                            <Button
                                buttonText={"Подробиці"}
                                onClick={() => setRoleModalActive(true)}
                            />
                        </div>
                    </div>
                }
            </div>
            <Modal
                setActive={setIsModalActive}
                active={isModalActive}
            >
                <ErrorString
                    errorText={errorString}
                />
            </Modal>
            <Modal
                setActive={setRoleModalActive}
                active={isRoleModalActive}
            >
                <EmployeeRole
                    employee={employee}
                    onSuccess={handleSuccess}
                />
            </Modal>
        </div>
    );
});

export default EmployeeItem;