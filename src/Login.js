import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Layout from "./Layout";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigate();

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = (e) => {
        navigation('/main');
    };

    return (
        <Layout>
            <div className="login-page">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn">Login</button>
                </form>
            </div>
        </Layout>
    );
};

export default Login;
