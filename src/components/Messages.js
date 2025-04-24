import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Messages = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    // redirect if not logged in
    if (!user && !loading) {
      navigate('/login', { state: { returnUrl: '/messages' } });
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`http://localhost:4000/api/messages/user/${user.uid}`);
        setConversations(response.data);
      } catch (error) {
        setError('Failed to load conversations. Please try again.');
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    
    try {
      const response = await axios.get(
        `http://localhost:4000/api/messages/conversation/${conversation.adId}/${user.uid}/${conversation.otherUserId}`
      );
      setMessages(response.data);
      
      // mark messages as read
      const unreadMessages = response.data
        .filter(msg => msg.receiver === user.uid && !msg.read)
        .map(msg => msg._id);
      
      if (unreadMessages.length > 0) {
        await axios.put(`${API_BASE_URL}/api/messages/read`, { messageIds: unreadMessages });
    }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    
    setSending(true);
    
    try {
      const response = await axios.post('http://localhost:4000/api/messages', {
        adId: activeConversation.adId,
        sender: user.uid,
        receiver: activeConversation.otherUserId,
        content: newMessage
      });
      
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="messages-container">
        <div className="loading">Please log in to view your messages.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading">Loading your messages...</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <h1>Your Messages</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="messages-layout">
        <div className="conversations-list">
          <h2>Conversations</h2>
          
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>You don't have any messages yet.</p>
              <Link to="/ads" className="browse-button">Browse Cars</Link>
            </div>
          ) : (
            conversations.map((conv, index) => {
                
              // get last message
              const lastMessage = conv.messages.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              )[0];
              
              // check for unread messages
              const hasUnread = conv.messages.some(
                msg => msg.receiver === user.uid && !msg.read
              );
              
              return (
                <div 
                  key={index}
                  className={`conversation-item ${activeConversation?.otherUserId === conv.otherUserId ? 'active' : ''} ${hasUnread ? 'unread' : ''}`}
                  onClick={() => openConversation(conv)}
                >
                  <div className="conversation-title">
                    {conv.adTitle}
                    {hasUnread && <span className="unread-badge">New</span>}
                  </div>
                  <div className="conversation-preview">
                    {lastMessage ? (
                      <>
                        <span className="message-sender">
                          {lastMessage.sender === user.uid ? 'You: ' : ''}
                        </span>
                        {lastMessage.content.length > 30 
                          ? lastMessage.content.substring(0, 30) + '...' 
                          : lastMessage.content}
                      </>
                    ) : 'No messages yet'}
                  </div>
                  <div className="conversation-time">
                    {lastMessage && new Date(lastMessage.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <div className="messages-view">
          {activeConversation ? (
            <>
              <div className="message-header">
                <h3>
                  <Link to={`/ad/${activeConversation.adId}`}>
                    {activeConversation.adTitle}
                  </Link>
                </h3>
              </div>
              
              <div className="messages-list">
                {messages.map(msg => (
                  <div 
                    key={msg._id}
                    className={`message-bubble ${msg.sender === user.uid ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
              
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || sending}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;