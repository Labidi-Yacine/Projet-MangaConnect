import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Mangaread.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Mangaread = () => {
    const { mangaName, scan } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [topLikedComments, setTopLikedComments] = useState([]);
    const [currentTopCommentIndex, setCurrentTopCommentIndex] = useState(0);
    const [newReply, setNewReply] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [pdf, setPdf] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);
    const canvasRef = useRef(null);

    const serverUrl = `${window.location.protocol}//${window.location.hostname}:3001`;
    const scanUrl = `${serverUrl}/Mangas/${mangaName}/${scan}`;

    useEffect(() => {
        axios.get(`/api/comments/${mangaName}/${scan}/comments`)
            .then(res => {
                console.log('Response from API:', res.data);
                if (res.data.length > 0) {
                    setComments(res.data);
                }
            })
            .catch(err => console.error('Error fetching comments:', err));

        axios.get(`/api/comments/${mangaName}/${scan}/top-liked`)
            .then(res => setTopLikedComments(res.data))
            .catch(err => console.error(err));    

        axios.get('/api/auth/checkAuth', { withCredentials: true })
            .then(response => {
                setIsAuthenticated(response.data.isAuthenticated);
                if (response.data.isAuthenticated) {
                    setUsername(response.data.username);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la vérification de l\'authentification:', error);
            });
    }, [mangaName, scan]);


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTopCommentIndex((prevIndex) => (prevIndex + 1) % topLikedComments.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [topLikedComments]);

    useEffect(() => {
        const loadingTask = pdfjsLib.getDocument(scanUrl);
        loadingTask.promise.then(pdf => {
            setPdf(pdf);
            setNumPages(pdf.numPages);
            renderPage(pdf, pageNumber);
        });
    }, [scanUrl, pageNumber]);

    const renderPage = (pdf, pageNumber) => {
        pdf.getPage(pageNumber).then(page => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            page.render(renderContext);
        });
    };

    const handleNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() === '') return;
        axios.post('/api/comments/add', { mangaName, scan, comment: newComment }, { withCredentials: true })
            .then(res => {
                setComments([...comments, { ...res.data, username, replies: [] }]);
                setNewComment('');
            })
            .catch(err => console.error(err));
    };

    const handleAddReply = (commentId) => {
        if (newReply.trim() === '') return;
        axios.post('/api/comments/reply/add', { commentId, reply: newReply }, { withCredentials: true })
            .then(res => {
                const updatedComments = comments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...comment.replies || [], { ...res.data, username }]
                        };
                    }
                    return comment;
                });
                setComments(updatedComments);
                setNewReply('');
                setReplyingTo(null);
            })
            .catch(err => console.error(err));
    };

    const handleLikeComment = (commentId) => {
        if (!isAuthenticated) {
            alert('Connectez-vous pour interagir avec les autres utilisateurs.');
            return;
        }
        axios.post('/api/likes/add', { commentId }, { withCredentials: true })
            .then(() => {
                setComments(comments.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, liked: !comment.liked };
                    }
                    return comment;
                }));
            })
            .catch(err => console.error(err));
    };

    const handleReplyClick = (commentId) => {
        if (!isAuthenticated) {
            alert('Connectez-vous pour interagir avec les autres utilisateurs.');
            return;
        }
        setReplyingTo(replyingTo === commentId ? null : commentId);
    };

    const handleCanvasClick = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const halfWidth = rect.width / 2;

        if (x < halfWidth) {
            handlePrevPage();
        } else {
            handleNextPage();
        }
    };

    return (
        <div className="main-container mt-3 text-light">
            <h1 className="text-center mb-3">Lire {mangaName} Chapitre: {scan}</h1>
            {/* <h2 className='text-center mb-3'>Chapitre: {scan}</h2> */}
            <div className="manga-container mb-4" onClick={handleCanvasClick}>
                <canvas ref={canvasRef}></canvas>
            </div>

            {isAuthenticated && (
                <div>
                    <h2>Laisser un commentaire</h2>
                    <div className="form-group mb-3">
                        <textarea
                            className="form-control"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Laisser un commentaire"
                            rows="3"
                        />
                        <div className="text-end">
                            <button className="btn btn-primary mt-2" onClick={handleAddComment}>Ajouter</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2>Commentaires :</h2>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="card mb-3">
                            <div className="card-body">
                                <p><strong>{comment.username}</strong>: {comment.comment}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleLikeComment(comment.id)}
                                        style={{ border: 'none', background: 'none', color: comment.liked ? 'red' : 'blue' }}
                                    >
                                        <i className={`bi ${comment.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                    </button>
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={() => handleReplyClick(comment.id)}
                                        style={{ border: 'none', background: 'none' }}
                                    >
                                        <i className="bi bi-reply-fill fs-4 text-white"></i> 
                                    </button>
                                </div>
                                {replyingTo === comment.id && isAuthenticated && (
                                    <div className="form-group mt-2">
                                        <textarea
                                            className="form-control"
                                            value={newReply}
                                            onChange={(e) => setNewReply(e.target.value)}
                                            placeholder="Votre réponse"
                                            rows="2"
                                        />
                                        <button className="btn btn-primary mt-2" onClick={() => handleAddReply(comment.id)}>Envoyer</button>
                                    </div>
                                )}
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-3">
                                        <h6>Réponses :</h6>
                                        {comment.replies.map(reply => (
                                            <div key={reply.id} className="reply-item mt-2">
                                                <p><strong>{reply.username}</strong>: {reply.reply}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Soyez le premier à laisser un commentaire!</p>
                )}
            </div>

            {topLikedComments.length > 0 && (
                <div className="comment-bubble">
                    <strong>Top Coms :</strong> {topLikedComments[currentTopCommentIndex]?.comment}
                </div>
            )}
        </div>
    );
};

export default Mangaread;