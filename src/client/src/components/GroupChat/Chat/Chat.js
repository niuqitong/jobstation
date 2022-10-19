import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
// import axios from "axios";

// import api from "../api/posts";
import TextContainer from "../TextContainer/TextContainer";
import Messages from "../Messages/Messages";
import InfoBar from "../InfoBar";
import Input from "../Input/Input";

import { useLocation } from "react-router-dom";

const ENDPOINT = "http://localhost:4000";

// const ENDPOINT = "http://localhost:3000";

const Chat = (props) => {
  const { state } = useLocation();
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  // const { data, fetchError, isLoading } = useAxiosFetch(
  //   "http://localhost:3500/messages"
  // );
  // const response1 = axios.get("http://localhost:3500/messages");

  // npx json-server -p 3500 -w data/db.json

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(io(ENDPOINT));

  useEffect(() => {
    setRoom(state.room);
    setName(state.name);
    console.log(socket);
    socket.emit("join", { name, room }, (error) => {
      console.log(name, room);
      if (error) {
        alert(error);
      }
    });
  }, [state.name, state.room, name, room, socket, setRoom, setName]);

  useEffect(() => {
    socket.on("message", (message) => {
      // const response1 = await axios.get(dbURL || "http://localhost:3500/messages");
      // setMessages(
      //   response1.data.map((obj) => ({ text: obj.text, user: obj.user }))
      // );
      setMessages(messages => [...messages, message]);
    });

    socket.on("history", history => {
      setMessages(history);

    })

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [message, socket]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      // const response = await api.post("/messages", {
      //   text: message,
      //   user: name,
      // });
      socket.emit("sendMessage", message, () => setMessage(""));
      // socket.emit('connect');
    }
  };
  // console.log('rendered');
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center p-5 bg-img "
      style={{
        backgroundImage: `url(https://source.unsplash.com/random/?${room})`,
        backgroundSize: 'cover',
      }}
    >
      <div className="col-8 d-flex flex-column align-items-between justify-content-center h-100 ">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
