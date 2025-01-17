import React, { useState, useEffect } from 'react';
import BhubaneswarStreetLightDashboard from './BhubaneswarStreetLightDashboard';
import './App.css';


const LoginSystem = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userInputCode, setUserInputCode] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const generateCode = () => {
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(generatedCode);
    setTimeLeft(60); // Start the expiration timer (60 seconds)
    alert(`Simulated Email:\n\nTo: ${email}\nSubject: Your Verification Code\n\nYour verification code for LightWatch BMC is: ${generatedCode}\n\nThis code will expire in 60 seconds.`);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    generateCode(); // Generate and send the verification code
    setStep('verify');
  };

  const handleVerification = (e) => {
    e.preventDefault();

    if (userInputCode === verificationCode && timeLeft > 0) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      onLogin(); // Trigger successful login
    } else if (timeLeft === 0) {
      setError('The verification code has expired. Please resend the code.');
    } else {
      setError('Incorrect verification code. Please try again.');
      setUserInputCode('');
    }
  };

  const handleResendCode = () => {
    setError('');
    setUserInputCode('');
    generateCode(); // Regenerate and resend the code
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">LightWatch BMC</h2>
        <p className="text-center text-gray-600 mb-6">Street Light Monitoring System</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send Verification Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={userInputCode}
                onChange={(e) => setUserInputCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
                maxLength="6"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Please enter the verification code sent to {email}.
              </p>
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in: <span className="font-bold text-red-500">{timeLeft}s</span>
                </p>
              ) : (
                <p className="text-sm text-red-500">The verification code has expired. Please resend the code.</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors mb-3"
              disabled={timeLeft === 0}
            >
              Verify Code
            </button>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setError('');
                  setUserInputCode('');
                }}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                ← Back to Email
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn ? (
        <LoginSystem onLogin={handleLogin} />
      ) : (
        <div>
          <div className="p-4 bg-white shadow">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">LightWatch BMC Dashboard</h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {localStorage.getItem('userEmail')}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto p-4">
            <BhubaneswarStreetLightDashboard />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
