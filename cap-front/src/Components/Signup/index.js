import React, { useState } from 'react';
import './index.css';

const Signup = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    // User specific fields
    aadhar_number: '',
    address: '',
    date_of_birth: '',
    gender: '',
    // Police specific fields
    badge_number: '',
    station_name: '',
    jurisdiction_area: '',
    rank: '',
    // Doctor specific fields
    specialization: '',
    license_number: '',
    hospital_name: '',
    location: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Common validations
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role-specific validations
    if (formData.role === 'user') {
      if (!formData.aadhar_number.trim()) newErrors.aadhar_number = 'Aadhar number is required';
      else if (!/^\d{12}$/.test(formData.aadhar_number)) newErrors.aadhar_number = 'Aadhar number must be 12 digits';
      
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }

    if (formData.role === 'police') {
      if (!formData.badge_number.trim()) newErrors.badge_number = 'Badge number is required';
      if (!formData.station_name.trim()) newErrors.station_name = 'Station name is required';
      if (!formData.jurisdiction_area.trim()) newErrors.jurisdiction_area = 'Jurisdiction area is required';
      if (!formData.rank.trim()) newErrors.rank = 'Rank is required';
    }

    if (formData.role === 'doctor') {
      if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
      if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
      if (!formData.hospital_name.trim()) newErrors.hospital_name = 'Hospital name is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      let endpoint = '';
      let payload = {};

      if (formData.role === 'user') {
        endpoint = '/api/auth/signup/user';
        payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          aadhar_number: formData.aadhar_number,
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender
        };
      } else if (formData.role === 'police') {
        endpoint = '/api/auth/signup/police';
        payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          badge_number: formData.badge_number,
          station_name: formData.station_name,
          jurisdiction_area: formData.jurisdiction_area,
          rank: formData.rank
        };
      } else if (formData.role === 'doctor') {
        endpoint = '/api/auth/signup/doctor';
        payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          specialization: formData.specialization,
          license_number: formData.license_number,
          hospital_name: formData.hospital_name,
          location: formData.location
        };
      }

      const response = await fetch('http://localhost:5000' + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        alert('Signup successful! Please login with your credentials.');
        // Redirect to login page
        if (onNavigate) {
          onNavigate('login');
        } else {
          window.location.href = '/login';
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          aadhar_number: '',
          address: '',
          date_of_birth: '',
          gender: '',
          badge_number: '',
          station_name: '',
          jurisdiction_area: '',
          rank: '',
          specialization: '',
          license_number: '',
          hospital_name: '',
          location: ''
        });
      } else {
        alert(result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUserFields = () => (
    <>
      <div className="form-group">
        <label htmlFor="aadhar_number">Aadhar Number *</label>
        <input
          type="text"
          id="aadhar_number"
          name="aadhar_number"
          value={formData.aadhar_number}
          onChange={handleInputChange}
          placeholder="Enter 12-digit Aadhar number"
          maxLength="12"
        />
        {errors.aadhar_number && <span className="error">{errors.aadhar_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address *</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your complete address"
          rows="3"
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date_of_birth">Date of Birth *</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
          />
          {errors.date_of_birth && <span className="error">{errors.date_of_birth}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender *</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
      </div>
    </>
  );

  const renderPoliceFields = () => (
    <>
      <div className="form-group">
        <label htmlFor="badge_number">Badge Number *</label>
        <input
          type="text"
          id="badge_number"
          name="badge_number"
          value={formData.badge_number}
          onChange={handleInputChange}
          placeholder="Enter badge number"
        />
        {errors.badge_number && <span className="error">{errors.badge_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="station_name">Station Name *</label>
        <input
          type="text"
          id="station_name"
          name="station_name"
          value={formData.station_name}
          onChange={handleInputChange}
          placeholder="Enter police station name"
        />
        {errors.station_name && <span className="error">{errors.station_name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="jurisdiction_area">Jurisdiction Area *</label>
          <input
            type="text"
            id="jurisdiction_area"
            name="jurisdiction_area"
            value={formData.jurisdiction_area}
            onChange={handleInputChange}
            placeholder="Enter jurisdiction area"
          />
          {errors.jurisdiction_area && <span className="error">{errors.jurisdiction_area}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rank">Rank *</label>
          <select
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleInputChange}
          >
            <option value="">Select Rank</option>
            <option value="Constable">Constable</option>
            <option value="Sub Inspector">Sub Inspector</option>
            <option value="Inspector">Inspector</option>
            <option value="DSP">DSP</option>
            <option value="SP">SP</option>
          </select>
          {errors.rank && <span className="error">{errors.rank}</span>}
        </div>
      </div>
    </>
  );

  const renderDoctorFields = () => (
    <>
      <div className="form-group">
        <label htmlFor="specialization">Specialization *</label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleInputChange}
          placeholder="Enter medical specialization"
        />
        {errors.specialization && <span className="error">{errors.specialization}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="license_number">License Number *</label>
        <input
          type="text"
          id="license_number"
          name="license_number"
          value={formData.license_number}
          onChange={handleInputChange}
          placeholder="Enter medical license number"
        />
        {errors.license_number && <span className="error">{errors.license_number}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="hospital_name">Hospital Name *</label>
        <input
          type="text"
          id="hospital_name"
          name="hospital_name"
          value={formData.hospital_name}
          onChange={handleInputChange}
          placeholder="Enter hospital name"
        />
        {errors.hospital_name && <span className="error">{errors.hospital_name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Enter hospital location"
        />
        {errors.location && <span className="error">{errors.location}</span>}
      </div>
    </>
  );

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join our community and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="role">Account Type *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="role-select"
            >
              <option value="user">General User</option>
              <option value="police">Police Officer</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
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
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Role-specific fields */}
          {formData.role === 'user' && renderUserFields()}
          {formData.role === 'police' && renderPoliceFields()}
          {formData.role === 'doctor' && renderDoctorFields()}

          <button 
            type="submit" 
            className="signup-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <button onClick={() => onNavigate && onNavigate('login')} className="link-button" aria-label="Navigate to login page">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Add default props for safety
Signup.defaultProps = {
  onNavigate: null
};

export default Signup;
