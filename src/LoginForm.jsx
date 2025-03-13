import SocialLogin from "./components/SocialLogin";
import LoginInputField from "./components/LoginInputField";

const LoginForm = () => {
    return (
        <div className="login-container">
            <h2 className="form-title">Log in with</h2>
            <SocialLogin />
            <p className="separator"><span>or</span></p>
            <form action="#" className="login-form">
                <LoginInputField type="email" placeholder="Email address" icon="mail" />
                <LoginInputField type="password" placeholder="Password" icon="lock" />
                <a href="#" className="forgot-password-link">Forgot password?</a>
                <button type="submit" className="login-button">Log In</button>
            </form>
            <p className="signup-prompt">
                Don&apos;t have an account? <a href="#" className="signup-link">Sign up</a>
            </p>
        </div>
    )
}
export default LoginForm;