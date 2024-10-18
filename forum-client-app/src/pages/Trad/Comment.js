import React, { useState } from 'react';
import { getToggleResult, getToken } from '../../utils';
import { commentUrl, likeCommentUrl, unlikeCommentUrl } from '../../urls';

const Comment = ({ initialComment, user, deleteComment }) => {
    const [comment, setComment] = useState(initialComment);

    const handleLike = async () => {
        if (comment == null)
            return;

        const route = comment.isLiked
            ? unlikeCommentUrl(comment.id)
            : likeCommentUrl(comment.id);

        const result = await getToggleResult(route);

        if (result) {
            setComment(prevComment => ({
                ...prevComment,
                isLiked: !prevComment.isLiked,
                likesCount: prevComment.isLiked ? prevComment.likesCount - 1 : prevComment.likesCount + 1
            }));
        }
    };

    const DeleteComment = async () => {
        const token = getToken();
        try {
            const commentId = comment.id;
            const response = await fetch(commentUrl(commentId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if (result) {
                console.log('удаление поста');

                deleteComment(commentId);
            }

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };


    return (
        <div className="comment">
            <div className="comment-header">
                <span className="comment-author">
                    <a href={`/profile/${comment.author.id}`} className="text-dark">
                        <img
                            src={`data:image/${comment.author.image.imageExtension};base64,${comment.author.image.imageData}`}
                            alt={comment.author.image.imageName}
                            className="mini-user-image"
                        />
                        {comment.author.nickName}
                    </a>

                </span>
                {user && (
                    <div className="thread-meta d-flex align-items-center mt-3 ml-auto">
                        <button
                            onClick={handleLike}
                            className={`btn btn-xs d-flex align-items-center mr-2 small-btn ${comment.isLiked ? 'btn-outline-primary-mh' : 'btn-outline-primary-m'}`}
                        >
                            <i className="fas fa-thumbs-up"></i>
                            <span className="ml-1">Like</span>
                        </button>
                        {user.id === comment.author.id && (
                            <button
                                onClick={DeleteComment}
                                className="btn btn-xs btn-outline-danger d-flex align-items-center small-btn"
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="comment-content">{comment.content}</p>
            <div className="thread-stats d-flex justify-content-start mt-2">
                <span className="mr-3">
                    <i className="fas fa-id-badge"></i> {comment.id}
                </span>
                <span className="mr-3">
                    <i className="fas fa-clock"></i> {comment.createdAt}
                </span>
                <span>
                    <i className="fas fa-thumbs-up"></i> <span>{comment.likesCount}</span> likes
                </span>
            </div>
            {comment.image && (
                <div className="wrapper">
                    <div className="image-container image-container-comment">
                        <img className=" mr-3" src={`data:image/${comment.image.imageExtension};base64,${comment.image.imageData}`} alt={comment.image.imageName} />
                    </div>
                </div>
            )}
        </div>
    );
};


export default Comment;
