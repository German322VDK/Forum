const baseUrl = `http://localhost:5171/`;
//const baseUrl = `http://localhost:8080/`;

export const checkTokenUrl = (token)=>{
    return `${baseUrl}api/users/checktoken?token=${token}`;
};
export const loginUrl  = ()=>{
    return `${baseUrl}api/users/login`;
};
export const registerUrl  = ()=>{
    return `${baseUrl}api/users/register`;
};
export const usersAllRefUrl = ()=>{
    return `${baseUrl}api/users/allref`;
};
export const gerUserUrl = (userId)=>{
   return `${baseUrl}api/users/getuser?id=${userId}`;
};
export const setUserImageUrl = ()=>{
    return `${baseUrl}api/users/setimage`;
 };
 export const setUserNickNameUrl = (nickname)=>{
    return `${baseUrl}api/users/setnickname?nickName=${nickname}`;
 };


export const tradsAllRefUrl = ()=>{
    return `${baseUrl}api/trad/allref`;
};
export const tradsAllShortUrl = ()=>{
    return `${baseUrl}api/trad/allshort`;
};
export const tradUrl = (tradId)=>{
    return `${baseUrl}api/trad/${tradId}`;
};
export const likeTradUrl = (tradId)=>{
    return `${baseUrl}api/trad/liketrad?id=${tradId}`;
};
export const unlikeTradUrl = (tradId)=>{
    return `${baseUrl}api/trad/unliketrad?id=${tradId}`;
};
export const addTradUrl = ()=>{
    return `${baseUrl}api/trad/add`;
};


export const postUrl = (postId)=>{
    return `${baseUrl}api/post/${postId}`;
};
export const likePostUrl = (postId)=>{
    return `${baseUrl}api/post/likepost?id=${postId}`;
};
export const unlikePostUrl = (postId)=>{
    return `${baseUrl}api/post/unlikepost?id=${postId}`;
};
export const addPostUrl = ()=>{
    return `${baseUrl}api/post/add`;
};


export const commentUrl = (commentId)=>{
    return `${baseUrl}api/comment/${commentId}`;
};
export const likeCommentUrl = (commentId)=>{
    return `${baseUrl}api/comment/likecomment?id=${commentId}`;
};
export const unlikeCommentUrl = (commentId)=>{
    return `${baseUrl}api/comment/unlikecomment?id=${commentId}`;
};
export const addCommentUrl = ()=>{
    return `${baseUrl}api/comment/add`;
};






