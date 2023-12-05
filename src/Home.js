import React, { useEffect, useState } from 'react';
import './App.css';

const Home = () => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  };

  const handleDeleteChat = (uniqueTitle) => {
    const updatedChats = previousChats.filter(
      (chat) => chat.title !== uniqueTitle
    );
    setPreviousChats(updatedChats);

    // Store updated chat history in localStorage
    localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
  };

  useEffect(() => {
    // Retrieve chat history from localStorage on component mount
    const storedChats =
      JSON.parse(localStorage.getItem('chatHistory')) || [];
    setPreviousChats(storedChats);
  }, []);

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      const isMessageRepeated = previousChats.some(
        (chat) =>
          chat.title === currentTitle &&
          chat.role === message.role &&
          chat.content === message.content
      );

      if (!isMessageRepeated) {
        const updatedChats = [
          ...previousChats,
          {
            title: currentTitle,
            role: 'user',
            content: value,
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content,
          },
        ];
        setPreviousChats(updatedChats);

        // Store updated chat history in localStorage
        localStorage.setItem('chatHistory', JSON.stringify(updatedChats));
      }
    }
  }, [message, currentTitle, previousChats, value]);

  console.log(previousChats);
  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));
  console.log(uniqueTitles);

  const getMessages = async () => {
    setLoading(true);

    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();

      // Ensure that data.choices is an array and has at least one element
      const messageContent =
        typeof data.choices?.[0]?.message === 'object'
          ? {
              role: data.choices[0].message.role,
              content: data.choices[0].message.content,
            }
          : {
              role: 'assistant',
              content: data.choices?.[0]?.message || 'Unexpected response',
            };

      setMessage(messageContent);
    } catch (error) {
      console.error(error);
      setMessage({
        role: 'assistant',
        content: 'Error retrieving data',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <section className="side-bar">
        <button className='new' onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {/* Renders previousChats here  */}
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
              <button className='delete' onClick={() => handleDeleteChat(uniqueTitle)}>
                🗑️
              </button>
            </li>
          ))}
        </ul>
        <nav>
          <p className='copyright'>Made By Tionne Whelan</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && (
          <h1>
            <img
              src="../lightning.png"
              className="logo"
              alt="logo"
              width={'400px'}
            ></img>
            SuperPage AI <p>Get answers in seconds..</p>
          </h1>
        )}

        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <div id="submit" onClick={getMessages}>
              ➤
            </div>
          </div>
          {loading && <p>Loading...</p>}
          {/* Render message if needed */}
          <p className="info">
            SuperPage AI Chat V 1.2 <br />
            All answers are generated by AI & Integrated with OPEN AI
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
