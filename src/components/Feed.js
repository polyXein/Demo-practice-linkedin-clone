import React, { useState, useEffect} from 'react'

import '../styles/Feed.css'
import CreateIcon from '@mui/icons-material/Create';
import InputOption from '../components/InputOption'
import ImageIcon from '@mui/icons-material/Image';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Post from '../components/Post'
import {db, auth} from '../firebase'

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

import FlipMove from 'react-flip-move';
import { useSelector } from 'react-redux';

import { selectUser} from '../features/userSlice'

const Feed = () => {

  const user = useSelector(selectUser);

  const[input, setInput] = useState('');  
  const[posts, setPosts] = useState([]);

/* conect and acceding in firebase database */

useEffect(() => {
  db.collection("posts")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => (
    setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }
    )))
  ))
}, [])


const stateInput = (e) =>{
  setInput(e.target.value);
}

/* Add to d atabase post with his elements */
  const sendPost = (e)=>{
    e.preventDefault();

    db.collection("posts").add({
        name: user.displayName,
        description: user.email,
        message: input,
        photoUrl: user.photoUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setInput("")
  }


  return (
    <>
    <div className='feed'>
        <div className='feed__inputContainer'>
           <div className='feed__input'>
            <CreateIcon />
            <form>
            <input
            onChange={stateInput}
            value={input}
            type="text" />
            <button
            onClick={sendPost}
            type='submit'>Send</button>
          </form>
          </div>
          <div className="feed__inputOptions">
            <InputOption Icon={ImageIcon} title="Photo" color="#70b5f9" />
            <InputOption Icon={SubscriptionsIcon} title="Video" color="#70b5f9" />
            <InputOption Icon={EventNoteIcon} title="Event" color="#70b5f9" />
            <InputOption Icon={CalendarViewDayIcon} title="Write Article" color="#70b5f9" />
          </div>
        </div>  
        <FlipMove>

        {
          posts.map(({ id, data:{name, description, message,
             photoUrl}}) =>(
            <Post
            key={id}
            name={name}
            description={description}
            message={message}
            photoUrl={photoUrl}
            />
          ))
        }
        </FlipMove>

    </div>
    </>
  ) 
}

export default Feed