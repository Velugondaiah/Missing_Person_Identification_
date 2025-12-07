import React, { useState } from 'react';
import './index.css';

const Login = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Make an API call to your backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
      const result = await response.json();

      if (result.success) {
        // Save token and user info for later use (e.g., in localStorage)
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        alert(`Welcome back! Logged in as ${formData.role}`);

        // Redirect to the correct dashboard
        if (onNavigate) {
          if (result.data.user.role === 'user') onNavigate('user_dashboard');
          else if (result.data.user.role === 'doctor') onNavigate('doctor_dashboard');
          else if (result.data.user.role === 'police') onNavigate('police_dashboard');
          else onNavigate('login');
        }

        setFormData({
          email: '',
          password: '',
          role: 'user'
        });
      } else {
        alert(result.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'user':
        return 'General User';
      case 'police':
        return 'Police Officer';
      case 'doctor':
        return 'Doctor';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'user':
        return '👤';
      case 'police':
        return '👮';
      case 'doctor':
        return '👨‍⚕️';
      default:
        return '👤';
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="role">Account Type *</label>
            <div className="role-selector">
              {['user', 'police', 'doctor'].map((role) => (
                <button
                  key={role}
                  type="button"
                  className={`role-option ${formData.role === role ? 'active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, role }))}
                >
                  <span className="role-icon">{getRoleIcon(role)}</span>
                  <span className="role-text">{getRoleDisplayName(role)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <button onClick={() => onNavigate && onNavigate('signup')} className="link-button" aria-label="Navigate to signup page">Sign Up</button>
          </p>
        </div>

        <div className="social-login">
          <div className="divider">
            <span>Or continue with</span>
          </div>
          <div className="social-buttons">
            <button type="button" className="social-button google">
              <span className="social-icon">🔍</span>
              Google
            </button>
            <button type="button" className="social-button facebook">
              <span className="social-icon">📘</span>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add default props for safety
Login.defaultProps = {
  onNavigate: null
};

export default Login;
