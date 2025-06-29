import { CreateTaskDto } from "../interface/dto/create-task-dto";
import { UpdateTaskDto } from "../interface/dto/update-task-dto";
import { getAccessToken } from "../utils/utils";

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export const createTaskApi = async (payload: CreateTaskDto) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/tasks/create`, 
        { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export const updateTaskApi = async (payload: UpdateTaskDto) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/tasks/${payload.task_id}`, 
        { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export const deleteTaskApi = async (taskId: string) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/tasks/${taskId}`, 
        { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
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

export const getTasksByUser= async (userId: string, startDate: string, endDate: string) => {
  try {
    const token = getAccessToken();
    let data;
    const response = await fetch(`${apiUrl}/tasks/getTasksByUser/${userId}?startDate=${startDate}&endDate=${endDate}`, 
        { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

    });
    if (response.ok) {
      data = await response.json();
    }
    else{
      data = []
    }

    return data;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
};

export const getTasksByProject= async (project_id: string, startDate: string, endDate: string) => {
  try {
    const token = getAccessToken();
    const response = await fetch(`${apiUrl}/tasks/getTasksByProj/${project_id}?startDate=${startDate}&endDate=${endDate}`, 
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

export const getDashboardData= async (userId: string, startDate: string, endDate: string) => {
  try {
    const token = getAccessToken();
    let data;
    const response = await fetch(`${apiUrl}/tasks/getDashboardData/${userId}?startDate=${startDate}&endDate=${endDate}`, 
        { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

    });
    if (response.ok) {
      data = await response.json();
    }
    else{
      data = {}
    }

    return data;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    throw err;
  }
};

export const getTaskCompletionTrend= async (userId: string, startDate: string, endDate: string) => {
  try {
    const token = getAccessToken();
    let data;
    const response = await fetch(`${apiUrl}/tasks/completion-trend/${userId}?startDate=${startDate}&endDate=${endDate}`, 
        { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

    });
    if (response.ok) {
      data = await response.json();
    }
    else{
      data = {}
    }

    return data;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    throw err;
  }
};

export const getTaskDistributionData= async (userId: string, month: string, year: string) => {
  try {
    const token = getAccessToken();
    let data;
    const response = await fetch(`${apiUrl}/tasks/task-distribution/${userId}?month=${month}&year=${year}`, 
        { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },

    });
    if (response.ok) {
      data = await response.json();
    }
    else{
      data = {}
    }

    return data;
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    throw err;
  }
};