import React from 'react';
import styles from './ImagePreview.module.css';

const ImagePreview = ( {imagePreview, alt} ) => {
    if (!imagePreview) {
        return null;
    }

    return (
        <div className={styles.previewImageContainer}>
            <img
                className={styles.previewImage}
                src={imagePreview}
                alt={alt}
            />
        </div>
    );
};

export default ImagePreview;