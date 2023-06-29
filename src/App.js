import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import MainPage from "./MainPage";


const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/main" element={<MainPage />} />
            </Routes>
        </Router>
    );
};

export default App;
