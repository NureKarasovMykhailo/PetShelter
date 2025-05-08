import React from 'react';
import stl from './TextArea.module.css';

const TextArea = ({label, text, setText}) => {

    const handleChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div className={stl.textAreaContainer}>
            <label htmlFor="textArea" className={stl.label}>
                {label}
            </label>
            <textarea
                id="textArea"
                className={stl.textArea}
                placeholder="Напишіть тут..."
                value={text}
                onChange={handleChange}
            />
        </div>
    );
};

export default TextArea;
