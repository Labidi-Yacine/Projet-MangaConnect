import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CommentList = () => {
  const { mangaName, chapter, page } = useParams();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/mangas/${mangaName}/${chapter}/${page}/comments`);
      const data = await response.json();
      setComments(data);
    };

    fetchComments();
  }, [mangaName, chapter, page]);

  return (
    <ul>
      {comments.map((comment, index) => (
        <li key={index}>
          <strong>{comment.User.username}</strong>: {comment.content}
        </li>
      ))}
    </ul>
  );
};

export default CommentList;
