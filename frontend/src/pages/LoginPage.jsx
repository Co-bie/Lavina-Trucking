import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const response = await fetch('http://127.0.0.1:8000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				const data = await response.json();
				localStorage.setItem('token', data.token);
				alert('Login successful!');
				// Redirect to dashboard
			} else {
				alert('Login failed!');
			}
		} catch (error) {
			alert('Network error: ' + error.message);
		}
	};

	return (
		<div style={{ 
			maxWidth: 400, 
			margin: '0 auto', 
			padding: 20,
			backgroundColor: '#f8f9fa',
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center'
		}}>
			<div style={{
				backgroundColor: 'white',
				padding: 40,
				borderRadius: 10,
				boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
				width: '100%'
			}}>
				<h1 style={{ 
					textAlign: 'center', 
					color: '#1e40af',
					marginBottom: 30,
					fontSize: 28
				}}>
					Lavina Trucking Login
				</h1>
				
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: 20 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
							Email:
						</label>
						<input
							type="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							required
							style={{ 
								width: '100%', 
								padding: 12,
								border: '2px solid #e2e8f0',
								borderRadius: 6,
								fontSize: 16
							}}
						/>
					</div>
					<div style={{ marginBottom: 25 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
							Password:
						</label>
						<input
							type="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							required
							style={{ 
								width: '100%', 
								padding: 12,
								border: '2px solid #e2e8f0',
								borderRadius: 6,
								fontSize: 16
							}}
						/>
					</div>
					<button 
						type="submit" 
						style={{ 
							width: '100%', 
							padding: 15,
							backgroundColor: '#1e40af',
							color: 'white',
							border: 'none',
							borderRadius: 6,
							fontSize: 18,
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
					>
						Sign In
					</button>
				</form>

				<div style={{ textAlign: 'center', marginTop: 20 }}>
					<Link to="/signup" style={{ color: '#1e40af', textDecoration: 'none' }}>
						Don't have an account? Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
