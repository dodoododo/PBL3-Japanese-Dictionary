import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoginInputField from './LoginInputField';
import './LoginForm.css';
import { login } from '../../auth'; 
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(formData.email, formData.password);
    if (result.success) {
      onLoginSuccess(); 
      window.location.reload();
      navigate(result.isAdmin ? '/admin' : '/'); 
    } else {
      setError(result.message); 
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 className="auth-form-title">Đăng nhập với</h2>
        
        <div className="auth-social-login">
          <button className="auth-social-button">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="auth-social-icon" />
            Google
          </button>
        </div>

        <div className="auth-separator">
          <span>hoặc</span>
        </div>

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