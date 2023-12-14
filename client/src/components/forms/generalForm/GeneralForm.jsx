import React from 'react';
import MyInput from "../../UI/input/MyInput";
import Button from "../../UI/button/Button";
import styles from './GeneralForm.module.css';
import FormError from "../../UI/error/formError/FormError";

const GeneralForm = ({
    header,
    inputs,
    onChange,
    onClick,
    submitButtonText,
    errorsList,
    userData,
    children
}) => {
    return (
        <form className={styles.generalForm}>
            <div className={styles.generalFormHeader}>
                <h2>{header}</h2>
            </div>
            <div>
                {inputs.map((input, index) => (
                    <div key={index}>
                        {input.type !== 'file' ? (
                            <MyInput
                                label={input.label}
                                id={input.id}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={onChange}
                                value={userData[input.name]}
                            />
                        ) : (
                            <MyInput
                                label={input.label}
                                id={input.id}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={onChange}
                            />
                        )}
                        {errorsList && <FormError errors={errorsList.filter(error => error.path === input.name)} />}
                    </div>
                ))}
            </div>
            {children}
            <div>
                <Button
                    buttonText={submitButtonText}
                    onClick={onClick}
                />
            </div>
        </form>
    );
};

export default GeneralForm;
