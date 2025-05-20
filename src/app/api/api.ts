import { CreateUserDto } from "../interface/dto/create-user-dto";
import { UpdateUserDto } from "../interface/dto/update-user-dto";

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getAccessToken = () => {
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1];
  return value || null;
};

export const createUser = async (payload: CreateUserDto) => {
  try {
    const response = await fetch(`${apiUrl}/user/create`, 
        { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const loginEmail = async (email: string, password: string) => {
  try {
    const payload = {
      email,
      password
    }

    const response = await fetch(`${apiUrl}/user/loginEmail`, 
        { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const loginUsername = async (username: string, password: string) => {
  try {
    const payload = {
      username,
      password
    }

    const response = await fetch(`${apiUrl}/user/loginUsername`, 
        { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

export const getUser = async (userId: string) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/user/get/${userId}`, 
        { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};



export const updateUser = async (userid: string, payload: UpdateUserDto) => {
  try {
    const token = getAccessToken();
    // Remove fields with empty string values
    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== "")
    );
    const response = await fetch(`${apiUrl}/user/update/${userid}`, 
        { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedPayload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};