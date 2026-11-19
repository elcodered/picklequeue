import React, {useEffect, useState} from 'react';
import {authenticatedUser, startSession} from './session';
import './Login.css';

function Login() {
    const [error, setError] = useState('');
    const username = import.meta.env.VITE_DEMO_USERNAME;
    const password = import.meta.env.VITE_DEMO_PASSWORD;

    useEffect(() => {
        if (authenticatedUser()) window.location.replace('/');
    }, []);

    function submitLogin(event) {
        event.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Demo login is not configured. Add the credentials to .env.local and restart the app.');
            return;
        }

        const form = new FormData(event.currentTarget);
        const enteredUsername = form.get('username').trim();
        const enteredPassword = form.get('password');
        if (enteredUsername.toLowerCase() !== username.trim().toLowerCase() || enteredPassword !== password) {
            setError('Incorrect username or password.');
            return;
        }

        try {
            startSession(username, form.get('remember') === 'on');
            window.location.replace('/');
        } catch {
            setError('Could not save your login in browser storage. Check your browser settings and try again.');
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-logo">
                    picklequeue<span>.</span>
                </div>
                <div className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in as the club administrator to continue.</p>
                </div>
                <form onSubmit={submitLogin}>
                    <div className="login-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="login-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <div className="login-options">
                        <label className="remember-option">
                            <input type="checkbox" name="remember" />
                            <span>Remember me</span>
                        </label>
                    </div>
                    {error && <p className="login-error" role="alert">{error}</p>}
                    <button type="submit" className="login-button">
                        Sign in
                    </button>
                </form>
                <p className="login-demo-note">
                    Demo login only. Credentials are bundled with the browser app and do not secure a production deployment.
                </p>
            </div>
        </div>
    );
}

export default Login;
