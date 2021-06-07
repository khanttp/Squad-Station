import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';



/**
 * 
 * Features of each posts -> media, caption, username, avatar, and comment section 
 * 
 */

function Post({username, caption, imageUrl, postId, user}) {

  const[comments, setComments] = useState([]); // comment section
  const[comment, setComment] = useState([]); // each comment


  /**
   * displaying the comments
   */
  useEffect(() => {
    let unsubscribe;
    if(postId){
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
      });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);


  // for posting the comment
  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    setComment('');
  }


    return (
      <div className="post">
          <div className = "post__header">
          <Avatar
                className="post__avatar"
                alt = {user.displayName}
                src = {user.displayName}
          />

        <h3>{username}</h3>
        </div>
        
        <img className= "post__image" src={imageUrl}></img>
        
        <h4 className ="post__text"> <strong>{username}</strong> {caption}</h4>

        <div  className = "post__comments">
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>

        {user && (
          <form className = "post__commentBox">
            <input
              className = "post__input"
              type = "text"
              placeholder = "add a comment.."
              value = {comment}
              onChange = {(e) => setComment(e.target.value)}
            />

            <button
              disabled = {!comment}
              className = "post__button"
              type = "submit"
              onClick = {postComment}
            > Post </button>
        </form>

        )}

      </div>
    );
  }

  

  export default Post;
  