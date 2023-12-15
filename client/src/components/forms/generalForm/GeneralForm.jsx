import React from 'react';
import MyInput from "../../UI/input/MyInput";
import Button from "../../UI/button/Button";
import {PhoneInput} from "react-international-phone";
import styles from './GeneralForm.module.css';
import FormError from "../../UI/error/formError/FormError";
import PasswordInput from "../../UI/input/passwordInput/PasswordInput";

const GeneralForm = ({
                         header,
                         inputs,
                         onChange,
                         onClick,
                         submitButtonText,
                         errorsList,
                         data,
                         children
                     }) => {
    return (
        <form className={styles.generalForm}>
            <div className={styles.generalFormHeader}>
                <h2>{header}</h2>
            </div>
            <div className={styles.inputsContainer}>
                {inputs.map((input, index) => (
                    <div key={index}>
                        {/* Используем условные операторы для выбора соответствующего компонента */}
                        {input.type === 'password' ? (
                            <PasswordInput
                                label={input.label}
                                id={input.id}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={onChange}
                                value={data[input.name]}
                            />
                        ) : input.type === 'phoneNumber' ? (
                            <div>
                                <p className={styles.phoneInputLabel}>{input.label}</p>
                                <PhoneInput
                                    style={{marginBottom: 16}}
                                    inputStyle={{width: '100%', fontSize: 16, padding: 5}}
                                    defaultCountry="ua"
                                    value={data[input.name]}
                                    onChange={onChange}
                                />
                            </div>
                        ) : input.type === 'file' ? (
                            <MyInput
                                label={input.label}
                                id={input.id}
                                name={input.name}
                                onChange={onChange}
                                type={input.type}
                            />
                        ) : (
                            <MyInput
                                label={input.label}
                                id={input.id}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={onChange}
                                value={data[input.name]}
                            />
                        )}
                        {errorsList && (
                            <FormError errors={errorsList.filter(error => error.path === input.name)} />
                        )}
                    </div>
                ))}
            </div>
            {children}
            <div>
                <Button buttonText={submitButtonText} onClick={onClick} />
            </div>
        </form>
    );
};

export default GeneralForm;

