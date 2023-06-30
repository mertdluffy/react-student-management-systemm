import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from './Login';
import MainPage from "./MainPage";


const App = () => {
    return (
        <Router>
            <Helmet>
                <title>Student Management</title>
            </Helmet>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
};

export default App;
