import React, { useState } from 'react';
import { login } from '../../auth';
import './LoginForm.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginForm = ({ onLoginSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(email, password)) {
            onLoginSuccess();
            setError('');
        } else {
            setError('Email hoặc mật khẩu không đúng');
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-header">
                    <h2>Đăng nhập</h2>
                    <p>Chào mừng bạn đến với JapanEasy</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            <button 
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Ghi nhớ đăng nhập</span>
                        </label>
                        <a href="#" className="forgot-link">Quên mật khẩu?</a>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="submit-button">
                        Đăng nhập
                    </button>

                    <div className="social-login">
                        <span>Hoặc đăng nhập với</span>
                        <div className="social-buttons">
                            <button type="button" className="google-btn">
                                <img src="/google.svg" alt="Google" />
                                Google
                            </button>
                            <button type="button" className="apple-btn">
                                <img src="/apple.svg" alt="Apple" />
                                Apple
                            </button>
                        </div>
                    </div>

                    <p className="register-prompt">
                        Chưa có tài khoản? 
                        <a href="#" className="register-link">Đăng ký ngay</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;