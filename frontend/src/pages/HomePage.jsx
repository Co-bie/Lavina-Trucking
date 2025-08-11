import React, { useEffect, useState } from 'react';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState('signup'); // Start with signup form as default
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirmation: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }

    fetch('http://127.0.0.1:8000/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
    setErrors({});
  };

  const showLogin = () => {
    setActiveForm('login');
    setErrors({});
  };

  const showSignup = () => {
    setActiveForm('signup');
    setErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLoginDataChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleTrackingSubmit = (e) => {
    e.preventDefault();
    // Handle tracking logic here
    alert(`Tracking shipment: ${trackingNumber}`);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Create name from first_name and last_name
      const signupData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim()
      };

      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toggleModal();
        // Refresh users list
        fetch('http://127.0.0.1:8000/api/users')
          .then(response => response.json())
          .then(data => setUsers(data));
      } else {
        setErrors(data.errors || { general: data.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        toggleModal();
      } else {
        setErrors(data.errors || { general: data.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      position: 'relative',
      width: '100vw',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {/* Header with gradient */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100vw',
        zIndex: 50,
        background: 'linear-gradient(to right, #fbbf24, #10b981, #0d9488)',
        padding: '16px 24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Company Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              color: 'black', 
              fontWeight: 'bold', 
              fontSize: '18px',
              margin: 0 
            }}>
              Nonoy Lavina Trucking Services
            </h1>
            <span style={{ color: 'black', fontWeight: '500' }}>Booking</span>
          </div>
          
          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ color: 'black' }}>🔔</span>
            </div>
            <span style={{ color: 'black', fontWeight: '500' }}>Contact us</span>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                style={{ 
                  color: 'black', 
                  fontWeight: '500', 
                  background: 'none',
                  border: '1px solid black',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            ) : (
              <button 
                onClick={toggleModal}
                style={{ 
                  color: 'black', 
                  fontWeight: '500', 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Sign up/Log in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div style={{ height: '64px' }}></div>

      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)', // Account for header and footer
        padding: '32px 20px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ 
            fontSize: window.innerWidth < 768 ? '48px' : '96px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '48px',
            lineHeight: '1.1'
          }}>
            Nonoy Lavina Trucking Services
          </h2>
          
          {/* Tracking Section */}
          <div style={{ marginTop: '64px' }}>
            <h3 style={{ 
              fontSize: '32px',
              color: '#374151',
              marginBottom: '24px',
              fontWeight: '400'
            }}>
              Track your shipment
            </h3>
            <form onSubmit={handleTrackingSubmit} style={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              flexWrap: window.innerWidth < 768 ? 'wrap' : 'nowrap'
            }}>
              <input
                type="text"
                placeholder="Tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  width: window.innerWidth < 768 ? '100%' : '320px',
                  fontSize: '18px',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#0d9488',
                  color: 'white',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  width: window.innerWidth < 768 ? '100%' : 'auto'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#0f766e'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#0d9488'}
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '32px 20px',
        width: '100vw',
        maxWidth: '100%',
        boxSizing: 'border-box',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
          gap: '32px'
        }}>
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>Let's Connect</h3>
            <p style={{ margin: '0 0 8px 0' }}>0917 132 9002</p>
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '24px' }}>📘</span>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>Opening hours</h3>
            <p style={{ margin: '0 0 4px 0' }}>5:00 AM - 8:00 PM</p>
            <p style={{ margin: '0' }}>Daily</p>
          </div>
          
          <div>
            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' }}>Visit us</h3>
            <p style={{ margin: '0 0 4px 0' }}>P-5 Poblacion Valencia</p>
            <p style={{ margin: '0' }}>City Bukidnon</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            padding: '24px',
            width: '100%',
            maxWidth: '448px',
            margin: '16px'
          }}>
            {/* Close Button */}
            <button 
              onClick={toggleModal}
              style={{
                float: 'right',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            
            {/* Tab Buttons */}
            <div style={{ display: 'flex', marginBottom: '24px' }}>
              <button 
                onClick={showSignup}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  textAlign: 'center',
                  fontWeight: '500',
                  backgroundColor: activeForm === 'signup' ? '#0d9488' : '#e5e7eb',
                  color: activeForm === 'signup' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '8px 0 0 8px',
                  cursor: 'pointer'
                }}
              >
                Sign up
              </button>
              <button 
                onClick={showLogin}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  textAlign: 'center',
                  fontWeight: '500',
                  backgroundColor: activeForm === 'login' ? '#0d9488' : '#e5e7eb',
                  color: activeForm === 'login' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '0 8px 8px 0',
                  cursor: 'pointer'
                }}
              >
                Log in
              </button>
            </div>

            {/* Error Display */}
            {Object.keys(errors).length > 0 && (
              <div style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '4px',
                color: '#dc2626'
              }}>
                {errors.general && <div>{errors.general}</div>}
                {errors.email && <div>Email: {errors.email[0]}</div>}
                {errors.password && <div>Password: {errors.password[0]}</div>}
                {errors.first_name && <div>First Name: {errors.first_name[0]}</div>}
                {errors.last_name && <div>Last Name: {errors.last_name[0]}</div>}
              </div>
            )}

            {/* Forms */}
            {activeForm === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={loginData.email}
                  onChange={handleLoginDataChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={loginData.password}
                  onChange={handleLoginDataChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <a href="#" style={{ color: '#6b7280', fontSize: '14px', textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#9ca3af' : '#0d9488',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '4px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleFormDataChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '16px' }}>
                  <input 
                    type="text" 
                    name="first_name"
                    placeholder="First Name" 
                    value={formData.first_name}
                    onChange={handleFormDataChange}
                    required
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input 
                    type="text" 
                    name="last_name"
                    placeholder="Last Name" 
                    value={formData.last_name}
                    onChange={handleFormDataChange}
                    required
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleFormDataChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input 
                  type="password" 
                  name="password_confirmation"
                  placeholder="Confirm Password" 
                  value={formData.password_confirmation}
                  onChange={handleFormDataChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#9ca3af' : '#0d9488',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '4px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Sign up'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
