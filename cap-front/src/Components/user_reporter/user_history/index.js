import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

const UserHistory = () => {
  const [reports, setReports] = useState({
    missingRelatives: { active: [], found: [] },
    unknownPersons: { reports: [] }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('missing');
  const [activeStatus, setActiveStatus] = useState('active');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [triggeringFaceDetection, setTriggeringFaceDetection] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/all-reports', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        } else {
          throw new Error(data.error);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch reports');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Auto-refresh reports every 30 seconds to catch automatic updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/all-reports', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        }
      } catch (err) {
        console.log('Auto-refresh failed:', err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getReportCount = (type, status) => {
    if (type === 'missing') {
      return reports.missingRelatives[status]?.length || 0;
    } else {
      return reports.unknownPersons.reports?.length || 0;
    }
  };

  const handleMarkAsFound = async (reportId) => {
    if (updatingStatus === reportId) return;
    
    setUpdatingStatus(reportId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/mark-person-found/${reportId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        }
        // No body needed since we're only updating status
      });

      if (response.ok) {
        // Refresh the reports after successful update
        const token = localStorage.getItem('token');
        const refreshResponse = await fetch('http://localhost:5000/api/all-reports', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setReports(refreshData.data);
        }
      } else {
        console.error('Failed to mark person as found');
      }
    } catch (err) {
      console.error('Error marking person as found:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleTriggerFaceDetection = async (reportId) => {
    if (triggeringFaceDetection === reportId) return;
    
    setTriggeringFaceDetection(reportId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/trigger-face-detection/${reportId}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        // Refresh the reports after successful face detection
        const token = localStorage.getItem('token');
        const refreshResponse = await fetch('http://localhost:5000/api/all-reports', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        });
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setReports(refreshData.data);
        }
        alert('Face detection completed! Person marked as found.');
      } else {
        alert(result.message || 'Face detection failed');
      }
    } catch (err) {
      console.error('Error triggering face detection:', err);
      alert('Failed to trigger face detection');
    } finally {
      setTriggeringFaceDetection(null);
    }
  };

  const renderHeader = () => (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="page-title">Report Management</h1>
          <p className="page-subtitle">Track and manage your missing person reports</p>
        </div>
        <div className="header-right">
          <button 
            className="primary-button"
            onClick={() => navigate(activeTab === 'missing' ? '/report_missing' : '/report_unknown')}
          >
            <span className="button-icon">+</span>
            New Report
          </button>
        </div>
      </div>
    </header>
  );

  const renderStats = () => (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-header">
            <div className="stat-icon primary">📊</div>
            <div className="stat-trend positive">+12%</div>
          </div>
          <div className="stat-number">{getReportCount('missing', 'active')}</div>
          <div className="stat-label">Active Cases</div>
          <div className="stat-description">Currently being investigated</div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-header">
            <div className="stat-icon success">✅</div>
            <div className="stat-trend positive">+8%</div>
          </div>
          <div className="stat-number">{getReportCount('missing', 'found')}</div>
          <div className="stat-label">Resolved Cases</div>
          <div className="stat-description">Successfully closed</div>
        </div>
        
        <div className="stat-card info">
          <div className="stat-header">
            <div className="stat-icon info">👁️</div>
            <div className="stat-trend neutral">0%</div>
          </div>
          <div className="stat-number">{getReportCount('spotted')}</div>
          <div className="stat-label">Unknown Persons</div>
          <div className="stat-description">Spotted individuals</div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-header">
            <div className="stat-icon warning">⏱️</div>
            <div className="stat-trend negative">-3%</div>
          </div>
          <div className="stat-number">24</div>
          <div className="stat-label">Avg. Response Time</div>
          <div className="stat-description">Hours to first response</div>
        </div>
      </div>
    </section>
  );

  const renderTabs = () => (
    <section className="tabs-section">
      <div className="tabs-container">
        <div className="tab-group">
          <button 
            className={`tab-button ${activeTab === 'missing' ? 'active' : ''}`}
            onClick={() => setActiveTab('missing')}
          >
            <span className="tab-icon">🔍</span>
            Missing Relatives
            <span className="tab-badge">{getReportCount('missing', 'active') + getReportCount('missing', 'found')}</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'spotted' ? 'active' : ''}`}
            onClick={() => setActiveTab('spotted')}
          >
            <span className="tab-icon">📸</span>
            Unknown Persons
            <span className="tab-badge">{getReportCount('spotted')}</span>
          </button>
        </div>
        
        {activeTab === 'missing' && (
          <div className="status-filters">
            <button 
              className={`status-filter ${activeStatus === 'active' ? 'active' : ''}`}
              onClick={() => setActiveStatus('active')}
            >
              <span className="status-dot active"></span>
              Active Cases
              <span className="filter-count">{getReportCount('missing', 'active')}</span>
            </button>
            <button 
              className={`status-filter ${activeStatus === 'found' ? 'active' : ''}`}
              onClick={() => setActiveStatus('found')}
            >
              <span className="status-dot found"></span>
              Found Cases
              <span className="filter-count">{getReportCount('missing', 'found')}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const renderReportCards = () => {
    let displayReports = [];
    
    if (activeTab === 'missing') {
      displayReports = reports.missingRelatives[activeStatus] || [];
    } else {
      displayReports = reports.unknownPersons.reports || [];
    }

    if (displayReports.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3 className="empty-title">No Reports Found</h3>
          <p className="empty-description">
            {activeTab === 'missing' 
              ? `No ${activeStatus} missing person reports found.`
              : 'No unknown person reports found.'}
          </p>
          <button 
            className="empty-action"
            onClick={() => navigate(activeTab === 'missing' ? '/report_missing' : '/report_unknown')}
          >
            Create Your First Report
          </button>
        </div>
      );
    }

    return (
      <div className="reports-grid">
        {displayReports.map(report => (
          <div key={report.id} className="report-card">
            <div className="card-header">
              <div className="report-info">
                <div className="report-image">
                  {report.image_url ? (
                    <img 
                      src={report.image_url} 
                      alt={report.full_name || 'Unknown Person'} 
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>👤</span>
                    </div>
                  )}
                </div>
                <div className="report-details">
                  <h3 className="report-name">
                    {activeTab === 'missing' ? report.full_name : (report.name || 'Unknown Person')}
                  </h3>
                  {activeTab === 'missing' && (
                    <div className="report-status">
                      <span className={`status-badge ${report.status}`}>
                        {report.status === 'active' ? 'Active' : 'Found'}
                      </span>
                      <span className="report-id">ID: #{report.id}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-actions">
                <button className="action-button secondary" title="View Details">
                  <span className="action-icon">👁️</span>
                </button>
                <button className="action-button secondary" title="Edit Report">
                  <span className="action-icon">✏️</span>
                </button>
                {activeTab === 'missing' && report.status === 'active' && (
                  <>
                    <button 
                      className="action-button success" 
                      title="Mark as Found"
                      onClick={() => handleMarkAsFound(report.id)}
                      disabled={updatingStatus === report.id}
                    >
                      <span className="action-icon">
                        {updatingStatus === report.id ? '⏳' : '✅'}
                      </span>
                    </button>
                    {report.image_url && (
                      <button 
                        className="action-button info" 
                        title="Trigger Face Detection"
                        onClick={() => handleTriggerFaceDetection(report.id)}
                        disabled={triggeringFaceDetection === report.id}
                      >
                        <span className="action-icon">
                          {triggeringFaceDetection === report.id ? '⏳' : '🤖'}
                        </span>
                      </button>
                    )}
                  </>
                )}
                <button className="action-button primary" title="Take Action">
                  <span className="action-icon">⚡</span>
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <div className="info-grid">
                {activeTab === 'missing' ? (
                  <>
                    <div className="info-item">
                      <label>Age</label>
                      <span>{report.age_when_missing} years</span>
                    </div>
                    <div className="info-item">
                      <label>Last Seen</label>
                      <span>{report.last_seen_location}</span>
                    </div>
                    <div className="info-item">
                      <label>Date Missing</label>
                      <span>
                        {new Date(report.last_seen_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Contact</label>
                      <span>{report.phone_number}</span>
                    </div>
                    <div className="info-item">
                      <label>Reported By</label>
                      <span>{report.users_table?.name || 'Unknown'} ({report.users_table?.email || 'No email'})</span>
                    </div>
                    {report.status === 'found' && (
                      <div className="info-item">
                        <label>Status</label>
                        <span className="status-found">Person has been found and is safe</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <label>Location</label>
                      <span>{report.location}</span>
                    </div>
                    <div className="info-item">
                      <label>Date Spotted</label>
                      <span>
                        {new Date(report.date_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="card-footer">
              <div className="footer-left">
                <span className="last-updated">
                  Last updated: {new Date(report.updated_at || report.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="footer-right">
                <button className="footer-button">View Full Report</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      {renderHeader()}
      {renderStats()}
      {renderTabs()}
      
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="error-action" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : (
          renderReportCards()
        )}
      </main>
    </div>
  );
};

export default UserHistory;
