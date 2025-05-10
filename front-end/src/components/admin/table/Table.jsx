import React from 'react';
import stl from './Table.module.css';
import Loader from "../../UI/loader/Loader";

const Table = ({isLoading, headers, data }) => {
    return (
        isLoading
            ?
            <div> <Loader /></div>
            :
            <div>
                <table className={stl.table}>
                    <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {headers.map((header, colIndex) => (
                                <td key={colIndex}>{item[header]}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
};

export default Table;