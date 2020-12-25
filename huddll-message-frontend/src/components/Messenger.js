import React, {useState, useEffect} from 'react';
import backend_api from '../api/backend_api';

//prompting for user;
const loggedInUserId = parseInt(prompt('Select a user b/w 1,3,5,6,7 Cuz only they are Online now'));

const Messenger = () => {



    // const loggedInUserId = 1;   //by default logged in user is Ronaldo

    const [onlineUsers, setOnlineUsers] = useState([]) ;
    const [textReceiver, setTextReceiver] = useState(null);
    const [messages, setMessages] = useState([]);

    const getOnlineUsers = async() =>{
        const {data} = await backend_api.get('/available_users');
        const onlineUsers = []
        //removing online user
        data.rows.forEach((u)=>{
            if(u.user_id !== loggedInUserId){
                onlineUsers.push(u);
            }
        })
        setOnlineUsers(onlineUsers);
    }

    useEffect(()=>{
        getOnlineUsers();
    },[]);

    useEffect(()=>{
        getMessages();
    },[textReceiver]);

    const idGenerator = () =>{
        return parseInt(Math.random()*1000+Math.random()*10000+Math.random()*100000);
    }


    const createDropdown =()=>{

        const dropdownArray = onlineUsers.map(u =>{
            return(
                <option key={u.user_id} value={u.user_id}>{u.name}</option>
            );
        })
        return dropdownArray;
    }

    const getMessages = async() =>{
        //post with textReceiver
        //check if not null
        const {data} = await backend_api.post('/messagenger_view',{textSender:loggedInUserId,textReceiver:textReceiver});
        const {messages} = data;
        setMessages(messages);        
    }

    const messageUi = () =>{
        const messageList = messages.map((m)=>{
            //for logged in user

            return (
                <li key={m.message_id} className={m.sender_user_id===loggedInUserId ? 'user_message' : 'other_message'}>

                    <div className="message-box">
                        <div className="message-body header">
                            {m.message_content}
                        </div>
                        <div className="sent-time meta">
                            <label>Time</label> {m.sent_time}
                        </div>
                    </div>

                </li>
            );

        })
        return messageList;
    }
    
    const onFormSubmit = async(e)=>{
        e.preventDefault();
        const messageContent = String(document.querySelector('#message').value);
        await backend_api.post('/messagenger_create',{
            message_id : idGenerator(),
            sender_id : loggedInUserId,
            message_body:messageContent,
            message_receive_id:idGenerator(),
            receiver_id:parseInt(textReceiver),
            is_read:true,
            sent_time:new Date().toISOString(),
            receive_time:new Date().toISOString()

        })
        getMessages();
        document.querySelector('#message').value='';
    }

        //checking for new message after 20 sec:
        window.setInterval(function(){
            /// call your function here
            getMessages();
        }, 20000);
    

 
    return (
        <div className="messenger">
            <select onChange={(e)=>{setTextReceiver(e.target.value)}} className="ui search dropdown">
                <option value="">Online User-list</option>
                    {createDropdown()}
            </select>
            <h2 style={{color:'red'}}> ^^^ Change it to message someone</h2>

            <ul>
                {messageUi()}
            </ul>

            <form onSubmit={onFormSubmit} className="ui form">
                <div className="field" style={{margin:'0 20px'}}>
                    <label>Write message:</label>
                    <input id='message' type="text" />
                </div>
            </form>

        </div>
    );
}
 
export default Messenger;