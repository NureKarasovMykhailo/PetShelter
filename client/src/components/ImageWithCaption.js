import React from 'react';


const ImageWithCaption = (props) => {
    const {image, caption} = props;
    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: 300}}>
            <img src={image} alt={'Image not found'} style={{width: 250, height: 180, borderRadius: 5}} />
            <p style={{fontSize: 24, fontWeight: "bold", justifyContent: "center"}}>{caption}</p>
        </div>
    );
};

export default ImageWithCaption;