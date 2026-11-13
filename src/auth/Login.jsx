
import React from "react";
import "./Login.css";

function Login() {
    return (
        <div className="login-page">

            <div className="login-container">

                {/* Logo */}
                <div className="login-logo">
                    picklequeue<span>.</span>
                </div>

                {/* Header */}
                <div className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your account to continue.</p>
                </div>

                {/* Login Form */}
                <form onSubmit={(e) => e.preventDefault()}>

                    {/* Email */}
                    <div className="login-form-group">
                        <label htmlFor="email">
                            Email address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="login-form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="login-options">

                        <label className="remember-option">
                            <input type="checkbox" name="remember" />
                            <span>Remember me</span>
                        </label>

                        <a href="#forgot-password">
                            Forgot password?
                        </a>

                    </div>

                    {/* Login Button */}
                    <button type="submit" className="login-button">
                        Sign in
                    </button>

                    {/* Register Link */}
                    <div className="login-signup">
                        Don't have an account?
                        <a href="#register"> Sign up</a>
                    </div>

                </form>

            </div>

        </div>
    );
}

export default Login;
