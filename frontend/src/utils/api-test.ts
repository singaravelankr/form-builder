import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123',
};

const testForm = {
  title: 'Test Form',
  description: 'This is a test form',
  fields: [
    {
      id: '1',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      id: '2',
      type: 'email',
      label: 'Email',
      required: true,
    },
  ],
  is_published: true,
};

async function testAuthApis() {
  console.log('Testing Auth APIs...');
  
  try {
    // Test Registration
    console.log('Testing registration...');
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
    const userResponse = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.USER}`
    );
    console.log('Get user successful:', userResponse.data);

    return token;
  } catch (error) {
    console.error('Auth API test failed:', error);
    throw error;
  }
}

async function testFormApis(token: string) {
  console.log('Testing Form APIs...');
  
  try {
    // Test Create Form
    console.log('Testing create form...');
    const createResponse = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.FORMS.CREATE}`,
      testForm
    );
    console.log('Create form successful:', createResponse.data);
    const formId = createResponse.data.id;

    // Test Get Form
    console.log('Testing get form...');
    const getResponse = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.FORMS.GET(formId)}`
    );
    console.log('Get form successful:', getResponse.data);

    // Test Update Form
    console.log('Testing update form...');
    const updateResponse = await axios.put(
      `${API_BASE_URL}${API_ENDPOINTS.FORMS.UPDATE(formId)}`,
      {
        ...testForm,
        title: 'Updated Test Form',
      }
    );
    console.log('Update form successful:', updateResponse.data);

    // Test List Forms
    console.log('Testing list forms...');
    const listResponse = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.FORMS.LIST}`
    );
    console.log('List forms successful:', listResponse.data);

    // Test Delete Form
    console.log('Testing delete form...');
    const deleteResponse = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.FORMS.DELETE(formId)}`
    );
    console.log('Delete form successful:', deleteResponse.status);

    // Test Logout
    console.log('Testing logout...');
    const logoutResponse = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`
    );
    console.log('Logout successful:', logoutResponse.data);
  } catch (error) {
    console.error('Form API test failed:', error);
    throw error;
  }
}

export async function runApiTests() {
  try {
    console.log('Starting API tests...');
    const token = await testAuthApis();
    await testFormApis(token);
    console.log('All API tests completed successfully!');
  } catch (error) {
    console.error('API tests failed:', error);
  }
} 