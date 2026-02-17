import { useState } from "react";
import "../styles/chatbot.css";

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // function getBotReply(text) {
    //     const msg = text.toLowerCase();

    //     if(msg.includes("users")){
    //         return "You can view users in the Users page.";
    //     }

    //     if (msg.includes("admin")) {
    //         return "Admins have full system access.";
    //     }

    //     return "I am your dashboard assistant.";
    // }

    async function handleSend(){
        if(!input) return;
        const token = localStorage.getItem("token");

        const userMessage = {sender : "user", text: input};

        setMessages(prev => [...prev,userMessage]);

        const res = await fetch("https://mern-admin-dashboard-5xlx.onrender.com/chat",{
            method: "POST",
            headers:{
                "content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body:JSON.stringify({message: input}),
        });
        
        const data = await res.json();

        const botMessage = {
            sender : "bot",
            text: data.reply,
        };

        setMessages(prev => [...prev, botMessage]);
        setInput("");
    }
    return(
        <div className="chat-container">
            <h2>AI Assistant</h2>

            <div className="chat-room">
                {messages.map((m,i) => (
                    <p key={i}>
                        <strong>{m.sender}:</strong>{m.text}
                    </p>
                ))}
            </div>

            <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Something... "/>
            <button className="chat-button" onClick={handleSend}> Send </button>
        </div>
    )
}

export default Chatbot;