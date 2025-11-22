const BASE_URL = 'https://api.shl-hr.com/api/v1';

// Common headers for ngrok
const getHeaders = () => ({
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
});

// Create a new team
export const createTeam = async (teamData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: teamData.teamName,
        managerName: teamData.manager,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create team';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

// Fetch all teams
export const fetchTeams = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch teams';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    // Assuming data is array of teams with employeeCount updated
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Fetch all teams (for overview)
export const fetchAllTeams = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }
    const response = await fetch(`${BASE_URL}/employees/teams`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      let errorMessage = 'Failed to fetch teams';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Update an existing team
export const updateTeam = async (id, teamData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams/${id}`, {
      method: 'PUT', // Assuming PUT for update; adjust if PATCH
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: teamData.teamName,
        managerName: teamData.manager,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update team';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

// Delete a team by ID
export const deleteTeam = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams/${id}`, {
      method: 'DELETE',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete team';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Assuming successful deletion returns no content or a success message
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

// Fetch all employees for team assignment
export const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch employees';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Add an employee to a team
export const addEmployeeToTeam = async (teamId, employeeId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams/${teamId}/members/${employeeId}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to add employee to team';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        if (response.status === 409 && errorMessage.includes('already a member')) {
          // Don't throw for already a member, let the component handle it
          return { success: false, message: errorMessage };
        }
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error adding employee to team:', error);
    throw error;
  }
};

// Remove an employee from a team
export const removeEmployeeFromTeam = async (teamId, employeeId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams/${teamId}/members/${employeeId}`, {
      method: 'DELETE',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to remove employee from team';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return true;
  } catch (error) {
    console.error('Error removing employee from team:', error);
    throw error;
  }
};

// Fetch team members
export const fetchTeamMembers = async (teamId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Auth token not found; please log in again.');
    }

    const response = await fetch(`${BASE_URL}/employees/teams/${teamId}/members`, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch team members';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};
