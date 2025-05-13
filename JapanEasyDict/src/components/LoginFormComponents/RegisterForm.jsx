import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginInputField from './LoginInputField';
import './LoginForm.css';
// import { register } from '../../auth'; // bạn cần tự định nghĩa hàm này

const RegisterForm = ({ onRegisterSuccess, onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // const result = register(formData.email, formData.password); // bạn định nghĩa hàm `register` ở `auth.js`
    // if (result.success) {
    //   onRegisterSuccess();
    //   window.location.reload();
    // } else {
    //   setError(result.message);
    // }
  };

  // Đoạn trong RegisterForm.jsx
    return (
    <>
        <button className="auth-close-button" onClick={onClose}>
        <X size={24} />
        </button>
        <h2 className="auth-form-title">Tạo tài khoản</h2>
        <form onSubmit={handleSubmit} className="auth-form">
            <LoginInputField
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            icon="mail"
            />
            <LoginInputField
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mật khẩu"
            required
            icon="lock"
            />
            <LoginInputField
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu"
            required
            icon="lock"
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-button">
            Đăng ký
            </button>
        </form>
        <p className="auth-signup-prompt">
        Đã có tài khoản?
        <a href="#" className="auth-signup-link" onClick={switchToLogin}>Đăng nhập</a>
        </p>
    </>
    );

};

export default RegisterForm;
