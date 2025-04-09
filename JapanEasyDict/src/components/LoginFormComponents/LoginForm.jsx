import React, { useState } from 'react';
import { login } from '../../auth';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import './LoginForm.css';
import LoginInputField from './LoginInputField';

const LoginForm = ({ onLoginSuccess, onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(formData.email, formData.password)) {
            onLoginSuccess();
            setError('');
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }
    };

    const togglePassword = (e) => {
        e.preventDefault(); 
        setShowPassword(!showPassword);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content">
                <button 
                    className="auth-close-button" 
                    onClick={onClose}
                    aria-label="Đóng form đăng nhập"
                >
                    <X size={24} />
                </button>
                <h2 className="auth-form-title">Đăng nhập với</h2>
                
                <div className="auth-social-login">
                    <button className="auth-social-button">
                        <img src="/google.svg" alt="Google" className="auth-social-icon" />
                        Google
                    </button>
                    <button className="auth-social-button">
                        <img src="/apple.svg" alt="Apple" className="auth-social-icon" />
                        Apple
                    </button>
                </div>

                <div className="auth-separator">
                    <span>hoặc</span>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-wrapper">
                        {/* <input
                            type="email"
                            name="email"
                            className="auth-input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <Mail className="auth-input-icon" size={20} /> */}

                        <LoginInputField
                            type="email"
                            name="email"
                            className="auth-input-field"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            icon="mail" 
                        />
                    </div>

                    <div className="auth-input-wrapper">
                        {/* <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="auth-input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            required
                        />
                        <Lock className="auth-input-icon" size={20} /> */}
                        <LoginInputField
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="auth-input-field"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            required
                            icon="lock" 
                        />
                        {/* <button 
                            type="button"
                            className="auth-eye-button"
                            onClick={togglePassword}
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button> */}
                    </div>

                    <a href="#" className="auth-forgot-link">Quên mật khẩu?</a>
                    
                    {error && <div className="auth-error">{error}</div>}
                    
                    <button type="submit" className="auth-submit-button">
                        Đăng nhập
                    </button>
                </form>

                <p className="auth-signup-prompt">
                    Chưa có tài khoản?
                    <a href="#" className="auth-signup-link">Đăng ký</a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;