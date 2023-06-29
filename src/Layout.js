import React from 'react';
import './Layout.css';

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <header className="header">
                <h2 className="app-title">Student Management</h2>
            </header>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default AppLayout;
