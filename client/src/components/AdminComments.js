import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          throw new Error('Invalid data format');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  const deleteComment = (commentId) => {
    fetch(`/api/admin/comments/delete/${commentId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setComments(comments.filter(comment => comment.id !== commentId));
    })
    .catch(error => {
      setError(error.message);
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className='text-center mb-3'>Gestion des commentaires</h2>
      <Table striped bordered hover>
        <thead>
          <tr className='text-center'>
            <th>ID</th>
            <th>Utilisateur</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {comments.map(comment => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.username}</td>
              <td>{comment.comment}</td>
              <td className='text-center'>
                <Button variant="danger" onClick={() => deleteComment(comment.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminComments;
