import React from 'react';
import MyInput from "../../UI/input/MyInput/MyInput";
import stl from './AddFeture.module.css';
import Button from "../../UI/button/Button";
import DeleteButton from "../../UI/button/DeleteButton";

const AddFeature = ({info, data, setData, petData, setPetData}) => {
    const changeInfo = (e) => {
        const { name, value } = e.target;
        data.map(d => {
             if (d.number === info.number) {
                 d[name] = value;
             }
        });
        setData(data);
        setPetData(prevState => ({
            ...prevState,
            info: data
        }))
    };
    // TODO пофиксить то что не удаляеться из данных (если будет время)
    const removeInfo = (e) => {
        e.preventDefault();
        const updatedData = data.filter((d) => d.number !== info.number);
        setData(updatedData);
        setPetData((prevData) => ({
            ...prevData,
            info: updatedData,
        }));
        console.log(petData);

    }

    return (
        <div className={stl.container}>
            <MyInput
                placeholder={"Колір"}
                label={"Назва"}
                name={'title'}
                value={data['title']}
                onChange={changeInfo}
            />
            <MyInput
                placeholder={"Чорний"}
                label={"Опис"}
                name={'description'}
                value={data['description']}
                onChange={changeInfo}
            />
            <div className={stl.deleteBtn}>
                <DeleteButton
                    buttonText={"Видалити"}
                    onClick={removeInfo}
                />
            </div>
        </div>
    );
};

export default AddFeature;