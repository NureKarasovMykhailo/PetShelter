import React from 'react';
import LinkIcon from '../images/linkIcon.png'

const Link = (props) => {
    const {linkText} = props;
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <a href={"#"} style={{fontSize: 22, color: "#0C2375", textAlign: "center"}}>{linkText}</a>
            <img src={LinkIcon} alt={'Image not found'} style={{width: 25, height: 25, marginLeft: 7}}/>
        </div>
    );
};

export default Link;