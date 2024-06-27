import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { username, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Validation côté client pour le mot de passe
            const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{12,}$/;
            if (!passwordRegex.test(password)) {
                setError('Le mot de passe doit contenir au moins un nombre, une majuscule et un caractère spécial et faire au moins 12 caractères');
                return;
            }

            const res = await axios.post('/api/auth/register', { username, email, password });
            console.log('Success:', res.data);
            navigate('/login');
        } catch (err) {
            console.error('Error:', err.response ? err.response.data : err.message);
            setError(err.response ? err.response.data.message : 'Registration failed');
        }
    };

    return (
        <div className="container text-light">
            <h1 className="text-center my-4">Inscription</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label className="text-danger">*</label>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Username"
                        name="username"
                        value={username}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="text-danger">*</label>
                    <input
                        type="email"
                        className="form-control mb-2"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="text-danger">*</label>
                    <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="text-danger">*</label>
                    <input
                        type="password"
                        className="form-control mb-2"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
    );
};

export default Register;
