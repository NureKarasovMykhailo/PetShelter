import React, {useState} from 'react';
import '../styles/AdminPanel.css';
import AdminRouter from "../components/admin/AdminRouter";

const AdminPanel = () => {

    const tables = [
        'adoption_offers',
        'application_for_adoptions',
        'collar_infos',
        'collars',
        'feeder_infos',
        'feeders',
        'pet_characteristics',
        'pets',
        'roles',
        'shelters',
        'users',
        'work_offers',
    ];

    const [selectedTable, setSelectedTable] = useState(tables[0]);

    return (
        <div className={"admin-panel__wrapper"}>
            <div className="admin-panel__navigation navigation">
                <div className={"navigation__header"}>
                    <p>Tables: </p>
                </div>
                {tables.map(table =>
                    <div
                        className={"navigation__element"}
                        key={table}
                        onClick={() => setSelectedTable(table)}
                    >
                        <p>{table}</p>
                    </div>
                )}
            </div>
            <div className={"admin-panel__table"}>
                <AdminRouter
                    selectedTable={selectedTable}
                />
            </div>
        </div>
    );
};

export default AdminPanel;