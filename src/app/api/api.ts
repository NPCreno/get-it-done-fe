import { IUser } from "../interface/IUser";

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const createUser = async (payload: IUser) => {
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