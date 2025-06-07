import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginInputField from './LoginInputField';
import './LoginForm.css';
import { login } from '../../auth';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';

const LoginForm = ({ onLoginSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      onLoginSuccess();
      // Optionally store token in localStorage if using JWT
      if (result.token) localStorage.setItem('token', result.token);
      window.location.reload();
      navigate(result.isAdmin ? '/admin' : '/');
    } else {
      setError(result.message);
    }
  };

  const slideVariants = {
    initial: (direction) => ({
      x: direction === 'left' ? 300 : -300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (direction) => ({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="auth-modal-overlay">
      <AnimatePresence mode="wait" initial={false} custom={isLogin ? 'right' : 'left'}>
        {isLogin ? (
          <motion.div
            key="login"
            className="auth-modal-content"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom="right"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="auth-close-button" onClick={onClose}>
              <X size={24} />
            </button>

            <h2 className="auth-form-title">Login</h2>

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
              <a href="#" className="auth-forgot-link">
                Forgot Password?
              </a>
              {error && <div className="auth-error">{error}</div>}
              <button type="submit" className="auth-submit-button">
                Login
              </button>
            </form>

            <p className="auth-signup-prompt">
              Don't have an account?{' '}
              <a href="#" className="auth-signup-link" onClick={() => setIsLogin(false)}>
                Sign-up
              </a>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="register"
            className="auth-modal-content"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom="left"
            onClick={(e) => e.stopPropagation()}
          >
            <RegisterForm
              onRegisterSuccess={onLoginSuccess}
              onClose={onClose}
              switchToLogin={() => setIsLogin(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginForm;