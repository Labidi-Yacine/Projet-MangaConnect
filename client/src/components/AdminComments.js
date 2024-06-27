import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const AdminComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch('/api/admin/comments')
      .then(response => response.json())
      .then(data => setComments(data));
  }, []);

  const deleteComment = (commentId) => {
    fetch(`/api/admin/comments/delete/${commentId}`, {
      method: 'DELETE',
    }).then(() => setComments(comments.filter(comment => comment.id !== commentId)));
  };

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
