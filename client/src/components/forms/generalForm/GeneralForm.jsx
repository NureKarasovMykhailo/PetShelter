import React, {useState} from 'react';
import MyInput from "../../UI/input/MyInput/MyInput";
import Button from "../../UI/button/Button";
import {PhoneInput} from "react-international-phone";
import styles from './GeneralForm.module.css';
import FormError from "../../UI/error/formError/FormError";
import PasswordInput from "../../UI/input/passwordInput/PasswordInput";
import ImagePreview from "../../UI/image/ImagePreview";

const GeneralForm = ({
    header,
    inputs,
    onClick,
    submitButtonText,
    errorsList,
    data,
    setData,
    isDisabled = false,
    children
}) => {

    const [imagePreview, setImagePreview] = useState('')

    const handleChange = (e) => {
        if (e.target === undefined) {
            setData({ ...data, phoneNumber: e });
        } else {
            const { name, type } = e.target;
            const value = type === 'file' ? e.target.files[0] : e.target.value;

            if (type === 'file') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(e.target.files[0]);
            }

            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    }

    return (
        <form className={styles.generalForm}>
            <div className={styles.generalFormHeader}>
                <h2>{header}</h2>
            </div>
            <div className={styles.inputsContainer}>
                {inputs.map((input, index) => (
                    <div key={index}>
                        {input.type === 'password' ? (
                            <PasswordInput
                                label={input.label}
                                id={input.id}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={handleChange}
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
                                    onChange={handleChange}
                                />
                            </div>
                        ) : input.type === 'file' ? (
                            <div>
                                <MyInput
                                    label={input.label}
                                    id={input.id}
                                    name={input.name}
                                    onChange={handleChange}
                                    type={input.type}
                                />
                                <ImagePreview
                                    imagePreview={imagePreview}
                                    alt={"Image not found"}
                                />
                            </div>
                        ) : (
                            <MyInput
                                label={input.label}
                                id={input.id}
                                type={input.type}
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={handleChange}
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
                <Button buttonText={submitButtonText} onClick={onClick} isDisable={isDisabled}/>
            </div>
        </form>
    );
};

export default GeneralForm;