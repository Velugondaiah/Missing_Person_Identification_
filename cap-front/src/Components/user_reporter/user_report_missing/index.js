
import React, { useState } from 'react';
import './index.css';

const initialState = {
  full_name: '',
  age_when_missing: '',
  gender: '',
  last_seen_location: '',
  last_seen_date: '',
  image: null,
  guardian_name: '',
  relationship: '',
  phone_number: '',
  email: '',
};

const UserReportMissing = () => {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);
    // Validate all fields are filled
    for (const [key, value] of Object.entries(form)) {
      if ((key === 'image' && !value) || (key !== 'image' && !value.trim())) {
        setError('All fields are mandatory. Please fill out every field.');
        window.alert('All fields are mandatory. Please fill out every field.');
        setSubmitting(false);
        return;
      }
    }
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'image' && v) data.append('image', v);
        else if (k !== 'image') data.append(k, v);
      });
      // Always use user.id for user_id
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) data.append('user_id', user.id);
      // Debug: log FormData keys/values
      for (let pair of data.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/report_missing', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setSuccess('Report submitted successfully!');
        setForm(initialState);
      } else {
        setError(result.message || 'Submission failed.');
      }
    } catch (err) {
      setError('Network or server error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="missing-report-root">
      <form className="missing-report-form" onSubmit={handleSubmit}>
        <h2>Report Missing Person</h2>
        <div className="missing-report-fields">
          <div className="missing-report-group">
            <label>Full Name<span style={{color: '#ef4444'}}>*</span></label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Age When Missing<span style={{color: '#ef4444'}}>*</span></label>
            <input name="age_when_missing" type="number" min="0" value={form.age_when_missing} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Gender<span style={{color: '#ef4444'}}>*</span></label>
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="missing-report-group">
            <label>Last Seen Location<span style={{color: '#ef4444'}}>*</span></label>
            <input name="last_seen_location" value={form.last_seen_location} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Last Seen Date<span style={{color: '#ef4444'}}>*</span></label>
            <input name="last_seen_date" type="date" value={form.last_seen_date} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Photo (Image)<span style={{color: '#ef4444'}}>*</span></label>
            <input name="image" type="file" accept="image/*" onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Guardian Name<span style={{color: '#ef4444'}}>*</span></label>
            <input name="guardian_name" value={form.guardian_name} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Relationship<span style={{color: '#ef4444'}}>*</span></label>
            <input name="relationship" value={form.relationship} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Phone Number<span style={{color: '#ef4444'}}>*</span></label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} required />
          </div>
          <div className="missing-report-group">
            <label>Email<span style={{color: '#ef4444'}}>*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>
        <button className="missing-report-submit" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
        {success && <div className="missing-report-success">{success}</div>}
        {error && <div className="missing-report-error">{error}</div>}
      </form>
    </div>
  );
};

export default UserReportMissing;
