import { IUser } from "../interface/IUser";

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const createUser = async (payload: IUser) => {
  try {
    console.log("payload: ", payload)
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
