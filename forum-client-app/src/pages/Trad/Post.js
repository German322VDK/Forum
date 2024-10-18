import React, { useState } from 'react';
import {getToggleResult, getToken} from '../../utils';
import {postUrl, likePostUrl, unlikePostUrl} from '../../urls';
import AddComment from './components/AddComment';
import Comment from './Comment';

const Post = ({ initialPost, user, deletePost }) => {
    const [post, setPost] = useState(initialPost);
    const [areCommentsVisible, setAreCommentsVisible] = useState(false);

    const handleLike = async() => {
        if (!post) 
            return;
    
        const route = post.isLiked 
            ? unlikePostUrl(post.id) 
            : likePostUrl(post.id);
    
        const result = await getToggleResult(route);
    
        if (result) {
            setPost(prevPost => ({
                ...prevPost,
                isLiked: !prevPost.isLiked,
                likesCount: prevPost.isLiked ? prevPost.likesCount - 1 : prevPost.likesCount + 1
            }));
        }
    };

    const addComment = (newComment)=>{
        setPost(prevPost => ({
            ...prevPost,
            comments: [...prevPost.comments, newComment] // Добавляем новый пост в массив
        }));
    };

    const DeletePost = async() => {
        const token = getToken();
        try{
            const postId = post.id;
            const response = await fetch(postUrl(postId), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                  }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            if(result){
                console.log('удаление поста');
                
                deletePost(postId);
            }

        }catch(error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const deleteComment =(commentId)=>{
        setPost(prevPost => ({
            ...prevPost,
            comments: prevPost.comments.filter(comment => comment.id !== commentId) // Добавляем новый пост в массив
        }));
    };

    const toggleComments = () => {
        setAreCommentsVisible(prevState => !prevState);
    };


    return (
        <div className="post">
            <div className="post-header">
                <span className="post-author">
                        <a href={`/profile/${post.author.id}`} className="text-dark">
                            <img 
                                src={`data:image/${post.author.image.imageExtension};base64,${post.author.image.imageData}`} 
                                alt={post.author.image.imageName} 
                                className="mini-user-image" 
                            />
                            {post.author.nickName}
                        </a>
                        
                </span>
                {user != null && (
                    <div className="thread-meta d-flex align-items-center mt-3 ml-auto">
                        <button
                            onClick={handleLike}
                            className={`btn btn-xs d-flex align-items-center mr-2 small-btn ${post.isLiked ? 'btn-outline-primary-mh' : 'btn-outline-primary-m'}`}
                        >
                            <i className="fas fa-thumbs-up"></i>
                            <span className="ml-1">Like</span>
                        </button>
                        {user.id === post.author.id && (
                            <button
                                onClick={DeletePost}
                                className="btn btn-xs btn-outline-danger d-flex align-items-center small-btn"
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
            <p className="post-content">{post.content}</p>
            <div className="thread-stats d-flex justify-content-start mt-2">
                <span className="mr-3">
                    <i className="fas fa-id-badge"></i> {post.id}
                </span>
                <span className="mr-3">
                    <i className="fas fa-clock"></i> {post.createdAt}
                </span>
                <span className="mr-3">
                    <i className="fas fa-comment-dots"></i> {post.comments ? post.comments.length : 0} comments
                </span>
                <span>
                    <i className="fas fa-thumbs-up"></i> <span>{post.likesCount}</span> likes
                </span>
            </div>
            {post.image && (
                <div className="wrapper">
                    <div className="image-container image-container-post">
                    <img className=" mr-3" src={`data:image/${post.image.imageExtension};base64,${post.image.imageData}`} alt={post.image.imageName} />
                    </div>
                </div>
            )}

            {user!=null &&(
                <AddComment postId={post.id} addComment={addComment}/>
            )}

            {/* Комментарии */}
            <div className="comments">
                <h4>Комментарии</h4>
                <button
                    className="btn btn-xs btn-outline-primary d-flex align-items-center mr-2 small-btn add-trad-button toggle-comments-btn"
                    onClick={toggleComments}
                >
                    <i className={`fas ${areCommentsVisible ? 'fa-minus' : 'fa-plus'}`}></i>
                    <span className="ml-1">
                        {areCommentsVisible ? 'Скрыть комментарии' : 'Показать комментарии'}
                        </span>
                </button>
                {areCommentsVisible && post.comments != null &&(
                    <div className="comment-list">
                        {post.comments.map(comment => (
                            <Comment key={comment.id} initialComment={comment} user={user} deleteComment={deleteComment}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


export default Post;
