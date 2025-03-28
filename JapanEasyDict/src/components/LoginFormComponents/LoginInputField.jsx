import { useState } from "react";

const LoginInputField = ({ type, placeholder, icon }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  
  return (
    <div className="input-wrapper">
      <input
        type={isPasswordShown ? 'text' : type}
        placeholder={placeholder}
        className="login-input-field"
        required
      />
      <i className="material-symbols-rounded">{icon}</i>
      {type === 'password' && (
        <i 
          onClick={() => setIsPasswordShown(prevState => !prevState)} 
          className="material-symbols-rounded eye-icon"
        >
          {isPasswordShown ? 'visibility' : 'visibility_off'}
        </i>
      )}
    </div>
  )
}

export default LoginInputField; 