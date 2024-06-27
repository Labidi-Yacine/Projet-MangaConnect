import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const deleteUser = (userId) => {
    fetch(`/api/admin/users/delete/${userId}`, {
      method: 'DELETE',
    }).then(() => setUsers(users.filter(user => user.id !== userId)));
  };

  return (
    <div className='text-light'>
      <h2 className='text-center mb-3'>Gestion des Users</h2>
      <Table striped bordered hover>
        <thead >
          <tr className='text-center'>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminUsers;
