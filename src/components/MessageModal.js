import React, { useState } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const MessageModal = ({ adId, adTitle, receiverId, isOpen, onClose }) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to send messages');
      return;
    }
    
    setSending(true);
    
    try {
      await axios.post('http://localhost:4000/api/messages', {
        adId,
        sender: user.uid,
        receiver: receiverId,
        content: message
      });
      
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="message-modal-overlay">
      <div className="message-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Send Message about {adTitle}</h2>
        
        {!user && (
          <div className="error-message">
            Please log in to send messages.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Message sent successfully!</div>}
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={!user || sending}
          />
          <button 
            type="submit" 
            disabled={!user || sending || !message.trim()}
            className="send-button"
          >
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;