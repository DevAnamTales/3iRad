export async function getAllUsers() {
  const res = await fetch('/data')
  const data = await res.json()
  return data
}

export async function addUser() {
  let response = await fetch('/data', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "id": 4,
      "name": "Anders",
      "age": 47,
      "list": []
    })
  })

  response = await response.json()
  console.log(response);
}

export async function getOneUser(userId) {
  const res = await fetch('/data/' + userId)
  const data = await res.json()
  return data;
}

export async function updateUser(userId, updatedUser) {
  try {
    const response = await fetch(`/data/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
      console.error('Failed to update user. Response:', response);
      throw new Error('Failed to update user');
    }

    const updatedUserData = await response.json();

    console.log('User updated successfully. Updated data:', updatedUserData);

    // Return the updated user data
    return updatedUserData;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
