import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
};

export async function testAuthEndpoints() {
  console.log('Testing Auth Endpoints...');
  
  try {
    // Test Registration
    console.log('Testing registration...');
    console.log('Request URL:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`);
    console.log('Request Data:', {
      ...testUser,
      password_confirmation: testUser.password,
    });
    
    const registerResponse = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
      {
        ...testUser,
        password_confirmation: testUser.password,
      }
    );
    console.log('Registration successful:', registerResponse.data);

    // Test Login
    console.log('Testing login...');
    console.log('Request URL:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`);
    console.log('Request Data:', {
      email: testUser.email,
      password: testUser.password,
    });
    
    const loginResponse = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        email: testUser.email,
        password: testUser.password,
      }
    );
    console.log('Login successful:', loginResponse.data);

    const token = loginResponse.data.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Test Get User
    console.log('Testing get user...');
    console.log('Request URL:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.USER}`);
    const userResponse = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.USER}`
    );
    console.log('Get user successful:', userResponse.data);

    // Test Logout
    console.log('Testing logout...');
    console.log('Request URL:', `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`);
    const logoutResponse = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`
    );
    console.log('Logout successful:', logoutResponse.data);

    return true;
  } catch (error: any) {
    console.error('Auth test failed:', {
      message: error.message,
      response: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      },
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
    });
    return false;
  }
} 