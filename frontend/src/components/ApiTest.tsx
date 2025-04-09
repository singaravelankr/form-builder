import React, { useState } from 'react';
import { runApiTests } from '../utils/api-test';
import { testAuthEndpoints } from '../utils/auth-test';

export const ApiTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const handleRunTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    // Override console.log to capture test output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      setTestResults(prev => [...prev, args.join(' ')]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      setTestResults(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalConsoleError(...args);
    };

    try {
      await runApiTests();
    } finally {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      setIsTesting(false);
    }
  };

  const handleTestAuth = async () => {
    setIsTesting(true);
    setTestResults([]);

    // Override console.log to capture test output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      setTestResults(prev => [...prev, args.join(' ')]);
      originalConsoleLog(...args);
    };

    console.error = (...args) => {
      setTestResults(prev => [...prev, `ERROR: ${args.join(' ')}`]);
      originalConsoleError(...args);
    };

    try {
      await testAuthEndpoints();
    } finally {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">API Tests</h2>
      <div className="space-x-4 mb-4">
        <button
          onClick={handleTestAuth}
          disabled={isTesting}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Auth Endpoints'}
        </button>
        <button
          onClick={handleRunTests}
          disabled={isTesting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isTesting ? 'Running Tests...' : 'Run All API Tests'}
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Test Results:</h3>
        <div className="bg-gray-100 p-4 rounded">
          {testResults.map((result, index) => (
            <div key={index} className="mb-1 font-mono text-sm">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 