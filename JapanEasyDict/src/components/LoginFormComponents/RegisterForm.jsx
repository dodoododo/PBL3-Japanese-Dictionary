import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginInputField from './LoginInputField';
import './LoginForm.css';
import { register } from '../../auth';

const RegisterForm = ({ onRegisterSuccess, onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    const result = await register(formData.email, formData.password);
    if (result.success) {
      onRegisterSuccess();
      window.location.reload();
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <button className="auth-close-button" onClick={onClose}>
        <X size={24} />
      </button>
      <h2 className="auth-form-title">Create Account</h2>
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
          placeholder="Password"
          required
          icon="lock"
        />
        <LoginInputField
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          icon="lock"
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="auth-submit-button">
          Sign-up
        </button>
      </form>
      <p className="auth-signup-prompt">
        Already have an account?{' '}
        <a href="#" className="auth-signup-link" onClick={switchToLogin}>
          Login
        </a>
      </p>
    </>
  );
};

export default RegisterForm;