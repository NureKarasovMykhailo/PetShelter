import React, {useState} from 'react';
import EmployeeItem from "../employeeItem/EmployeeItem";

const EmployeeList = ({ employees, onDelete, onSuccess }) => {

    const handleDelete = (success) => {
        onDelete(success);
    }
    const handleSuccess = (success) => {
        onSuccess(success)
    }

    return (
        employees.map((employee) => (
            <EmployeeItem key={employee.id} employee={employee} onDelete={handleDelete} onSuccess={handleSuccess} />
        ))
    );
};

export default EmployeeList;
