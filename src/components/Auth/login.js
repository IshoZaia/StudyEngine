import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../index.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8000/auth/login`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ UserName: email, password: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if(data.token){
        localStorage.setItem('token', data.token)
        window.location.href = '/dashboard'}
        else{
          alert('Invalid username or password')
      }})
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Navigate to the registration page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <label className="block">Username</label>
            <input 
              type="text" 
              placeholder="Enter your Username" 
              id="email" 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="mt-4">
            <label className="block">Password</label>
            <input 
              type="password" 
              placeholder="Password" 
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <span className="text-xs text-gray-600">Forgot password?</span>
            <a href="#" className="text-xs text-blue-600 hover:underline">Click here</a>
          </div>
          <div className="flex items-baseline justify-between">
            <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
            <button type="button" onClick={handleRegisterRedirect} className="text-sm text-blue-600 hover:underline">
              Don't have an account?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
