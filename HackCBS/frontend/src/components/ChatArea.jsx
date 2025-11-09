import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import InputArea from './InputArea';

function ChatArea({ queryType, setQueryType }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="chat-area">
      <div className="messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Welcome to QueryChain AI!</h3>
            <p>Start by typing a question about your data, or click on one of the example queries to get started.</p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <InputArea 
        queryType={queryType} 
        setQueryType={setQueryType}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

export default ChatArea;
