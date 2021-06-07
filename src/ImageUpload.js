
import React , { useState } from 'react';           
import {Button} from '@material-ui/core';
import {db , storage} from './firebase.js';
import firebase from "firebase";
import './ImageUpload.css';


/**
 * Uploading images:
 *   file selection,
 *   progress bar to show the status of upload,
 *   caption input,
 *   upload button
 */

function ImageUpload({username}) {
    const [caption , setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress,setProgress] = useState(0);

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () =>{

        // upload if an image is chosen
        const imageType = image.name.split('.');

        var contains = false;
        if(imageType.includes("png")){
            contains = true;
        } else if (imageType.includes("jpeg")){
            contains = true;
        } else if (imageType.includes("gif")){
            contains = true; 
        } else if (imageType.includes("PNG")){
            contains = true;
        } else if (imageType.includes("JPEG")){
            contains = true; 
        } else if(imageType.includes("jpg")){
            contains = true; 
        } else if(imageType.includes("JPG")){
            contains = true; 
        } else if(imageType.includes("GIF")){
            contains = true; 
        }

        if(image === null || contains === false){
            alert("please choose an image");
        } else{
            // put image into storage
            const uploadTask = storage.ref(`images/${image.name}`).put(image);

            // only want to update the image uploaded, not the entire database
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) =>{
                    alert(error.message);
                },
                () => {
                    storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
                            caption : caption,
                            imageUrl : url,
                            username : username
                        });
                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    });
                }
            )
        }        

    }
    return (
        <div className='ImageUpload'> 
            <progress className = 'imageUpload__progress' value ={progress} max="100" />
            <input type = "text" placeholder = "Enter a Caption" onChange={event => setCaption(event.target.value)} />
            <input type = "file" accept="image/*" onChange = {handleChange} />
            <Button onClick={handleUpload} color='secondry' >
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload