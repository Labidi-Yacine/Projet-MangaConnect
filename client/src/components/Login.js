import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setLoggedInUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [notRobot, setNotRobot] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!notRobot) {
            setError("Veuillez confirmer que vius n'etes pas un robot");
            return;
        }

        axios.post('/api/auth/login', { email, password })
            .then(res => {
                const userData = res.data.user;
                setLoggedInUser(userData.username);
                localStorage.setItem('user', JSON.stringify({ username: userData.username, isAdmin: userData.isAdmin }));
                if (userData.isAdmin) {
                    navigate('/admin/');
                } else {
                    navigate('/');
                }
            })
            .catch(err => setError('Email ou mot de passe incorrect'));
    };

    return (
        <div className="container text-light">
            <h1 className="text-center my-4">Login</h1>
            <div className="form-group">
                <label className="text-danger">*</label>
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label className="text-danger">*</label>
                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Mot de Passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form-check mb-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="notRobot"
                        checked={notRobot}
                        onChange={(e) => setNotRobot(e.target.checked)}
                    />
                    <label className="form-check-label text-danger" htmlFor="notRobot">* Je ne suis pas un robot</label>
                    </div>
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
    );
};

export default Login;
