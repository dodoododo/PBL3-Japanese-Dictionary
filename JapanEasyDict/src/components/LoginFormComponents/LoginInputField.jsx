import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginInputField = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case 'mail':
        return <Mail className="auth-input-icon" size={20} />;
      case 'lock':
        return <Lock className="auth-input-icon" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="auth-input-wrapper">
      {getIcon()}
      <input
        type={showPassword ? 'text' : type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="auth-input-field"
      />
      
      {type === 'password' && (
        <button 
          type="button"
          className="auth-eye-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};

export default LoginInputField;