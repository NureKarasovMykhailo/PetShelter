import React, {useContext, useState} from 'react';
import styles from './UserImageForm.module.css';
import Button from "../../UI/button/Button";
import {changeUserImage, checkAuth} from "../../../API/UserService";
import {Context} from "../../../index";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const UserImageForm = observer(() => {
    const [image, setImage] = useState(null);
    const [userImage, setUserImage] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const { user } = useContext(Context);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
            setIsButtonDisabled(false);
        }
    }

    const handleChangeImageBtnClick = async (e) => {
        e.preventDefault();
        try {
            const response = await changeUserImage(userImage);
            console.log(response)
            if (response.status === 200) {
                console.log(response.data.newToken.token)
                localStorage.setItem('token', response.data.newToken.token);
                const newUserData = await checkAuth();
                user.setUser(newUserData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form encType="muliple/form-data" className={styles.form}>
            <p className={styles.formHeader}>Зміна фото профіля: </p>
            <div className={image ? styles.imagePreviewContainerActive : styles.imagePreviewContainer}>
                <img
                    className={styles.image}
                    alt="Image not found"
                    src={image}
                />
                <img
                    className={styles.imageRound}
                    alt="Image not found"
                    src={image}
                />
            </div>
            <p>Оберіть фото:</p>
            <input type="file" name="newUserImage" id="newUserImage" onChange={handleImageChange}/>
            <div className={styles.buttonContainer}>
                <Button
                    buttonText="Змінити фото профіля"
                    onClick={handleChangeImageBtnClick}
                    isDisable={isButtonDisabled}
                />
            </div>
        </form>
    );
});

export default UserImageForm;