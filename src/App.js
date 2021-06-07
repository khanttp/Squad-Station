

import './App.css';
import Post from './Post'
import React, { useState, useEffect} from 'react';
import {auth, db} from './firebase'
import {makeStyles} from '@material-ui/core/styles';
import { Button, Input, Modal } from '@material-ui/core/';
import ImageUpload from './ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  //useEffect -> runs a piece of code on a speciic condition

  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);  
        setUser(authUser);
        if(authUser.displayName){

        }else{
          return authUser.updateProfile({
            displayName: username,
          });
        }
      }else{
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    }
  },[user , username]);


  useEffect(() =>{

    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // every time a change happens in the database, this code runs
      setPosts(snapshot.docs.map(doc =>({

        id: doc.id,
        post:doc.data()
      }))); 
    
    })
  }, []);

  // signing up 
  const signUp = (event) =>{
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    
    setOpen(false);

  }

  // for signing in 
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email,password)
      .catch((error)=> alert(error.message))
      
    setOpenSignIn(false);
  }


  return (
    <div className="App">
      
      <Modal
      open = {open}
      onClose = {() => setOpen(false)}
      >

      <div style={modalStyle} className={classes.paper}>
        
      <form className = "app__signup">
        <center>
          <img
            className = "logo"
            src = "./squad.png"
            alt = "logo"
          />
        </center>

        <Input
          placeholder = "username"
          type = "text"
          value = {username}
          onChange = {(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder = "email"
          type = "text"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder = "password"
          type = "password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
        />
        <Button type = "submit" onClick={signUp}>Sign Up</Button>
      </form>
      </div>     
      </Modal>

      <Modal
        open = {openSignIn}
        onClose = {() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className = "app__signup">
      <center>
          <img
            src = ".\squad.png"
            alt = "logo"
          />
        </center>
        <Input
          placeholder = "email"
          type = "text"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder = "password"
          type = "password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
        />
        <Button type = "submit" onClick={signIn}>Sign In</Button>
      </form>
    </div>    
    </Modal>


    <div className="app_header">
        <img 
          className = "app_header_image"
          alt = "logo"
          src = "./squad.png"
        />
        {user ? (
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ): (
        <div className = "app__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign Up</Button> 
        </div>
      )}
      </div>

      {user &&(
      <div className = "app__posts">
      <div className = "app__postsLeft">
        {posts.map( ({id, post}) => (
          <Post
            key = {id} 
            username={post.username} 
            postId = {id}
            user = {user}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
          ))}

      </div>

    </div>          
    )}

    <h3 id = "welcome__msg">Welcome to Squad Station - where you can share life with friends</h3>
      {user?.displayName ? (
          <ImageUpload username = {user.displayName}/>
          ): (
          <h3 id = "login__msg"> Please login to upload images</h3>
          )}

    </div>
  );
}

export default App;
