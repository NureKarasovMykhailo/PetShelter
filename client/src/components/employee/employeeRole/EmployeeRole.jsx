import React, { useContext, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Context } from "../../../index";
import styles from './EmployeeRole.module.css';
import Button from "../../UI/button/Button";
import {addRoles, deleteRoles} from "../../../API/EmployeeService";
import ErrorString from "../../UI/error/errorString/ErrorString";
import errorString from "../../UI/error/errorString/ErrorString";

const EmployeeRole = ({ employee, onSuccess }) => {
    const { employees } = useContext(Context);

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [error, setError] = useState('');

    const roleTitle = {
        employee: 'Працівник',
        petAdmin: 'Адмін тварин',
        adoptionAdmin: 'Адміністратор з опеки',
        workerAdmin: 'Адміністратор робітників',
        subscriber: 'Підписник',
        systemAdmin: 'Системний адміністратор',
    };

    const roles = {
        petAdmin: 'Адмін тварин',
        adoptionAdmin: 'Адміністратор з опеки',
        workerAdmin: 'Адміністратор робітників',
    }

    const handleRoleChange = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter((r) => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleAddRoles = async () => {
        try {
            console.log(selectedRoles)
            await addRoles(employee.id, selectedRoles);
            onSuccess(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteRole = async (e) => {
        try {
            await deleteRoles(employee.id, e.target.name)
            onSuccess(true);
        } catch (error) {
            setError(error.response.data.message)
        }
    }


    return (
        <div className={styles.roleContainer}>
            <div className={styles.roleContainerHeader}>
                <h3>Ролі:</h3>
            </div>
            <div className={styles.rolesListContainer}>
                {employee.role.map((employeeRole) =>
                    <div className={styles.roleItem}>
                        <p className={styles.role}>{roleTitle[employeeRole]}</p>
                        <div className={styles.button}>
                            <Button
                                buttonText={"Видалити"}
                                onClick={handleDeleteRole}
                                value={employeeRole}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div>
                <hr></hr>
            </div>
            <div className={styles.rolesListContainer}>
                <div className={styles.roleContainerHeader}>
                    <h3>Додати роль:</h3>
                </div>
                {Object.keys(roles).map((roleKey) => (
                    <div key={roleKey} className={styles.roleToAdd}>
                        <input
                            type="checkbox"
                            id={roleKey}
                            checked={selectedRoles.includes(roleKey)}
                            onChange={() => handleRoleChange(roleKey)}
                        />
                        <label htmlFor={roleKey} className={styles.roleLabel}>
                            {roles[roleKey]}
                        </label>
                    </div>
                ))}
            </div>
            <div className={styles.addRoleContainer}>
                <div className={styles.addRoleBtn}>
                    <ErrorString errorText={error}/>
                    <Button buttonText={"Додати роль"} onClick={handleAddRoles} isDisable={selectedRoles.length === 0}/>
                </div>
            </div>
        </div>
    );
};

export default observer(EmployeeRole);
