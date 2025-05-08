import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ pagesArray, currentPage, onClick }) => {
    console.log(pagesArray)
    const displayPages = pagesArray.filter(
        (page) => Math.abs(currentPage - page) <= 2
    );
    const renderEllipsis = (side) => (
        <span key={side} className={styles.ellipsis}>
      ...
        </span>
    );

    return (
        <div className={styles.pagination}>
            {currentPage > 1 && renderEllipsis('start')}
            {displayPages.map((page, index) => (
                <span
                    key={index}
                    className={currentPage === page ? styles.active : styles.page}
                    onClick={() => onClick(page)}
                >
          {page}
        </span>
            ))}
            {currentPage < pagesArray[pagesArray.length - 1] && renderEllipsis('end')}
        </div>
    );
};

export default Pagination;
