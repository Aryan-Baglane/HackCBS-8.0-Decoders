import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

function InputArea({ queryType, setQueryType, isLoading, setIsLoading, messages, setMessages }) {
  const [userInput, setUserInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [mode, setMode] = useState('query'); // 'query' or 'update'

  // Generate session ID on mount
  useEffect(() => {
    const existingSession = localStorage.getItem('querychain_session_id');
    if (existingSession) {
      setSessionId(existingSession);
    } else {
      const newSession = `session_${Date.now()}`;
      localStorage.setItem('querychain_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);

  useEffect(() => {
    const handleExampleQuery = (event) => {
      const { query, type } = event.detail;
      setQueryType(type);
      setUserInput(query);
      // Auto-submit after a short delay
      setTimeout(() => handleSend(query, type), 100);
    };

    window.addEventListener('exampleQuery', handleExampleQuery);
    return () => window.removeEventListener('exampleQuery', handleExampleQuery);
  }, [sessionId]);

  const handleSend = async (query = userInput, type = queryType) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isLoading || !sessionId) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: trimmedQuery,
      mode: mode
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      if (mode === 'update') {
        // UPDATE MODE - Use dedicated update endpoint
        const response = await axios.post(`${config.API_URL}/api/update`, {
          userInput: trimmedQuery,
          sessionId: sessionId
        });

        if (response.data.success) {
          const aiMessage = {
            id: Date.now() + 1,
            type: 'assistant',
            answer: response.data.message || `✅ Update successful! ${response.data.modifiedCount} record(s) modified.`,
            toolUsed: null,
            toolResult: null,
            confidence: 0.95,
            modifiedCount: response.data.modifiedCount
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          throw new Error(response.data.error || 'Update failed');
        }
      } else {
        // QUERY MODE - Use agent endpoint
        const response = await axios.post(`${config.API_URL}/api/agent`, {
          userInput: trimmedQuery,
          sessionId: sessionId,
          userId: 'user_001'
        });

        const result = response.data;
        
        // Create AI response message
        const aiMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          answer: result.answer,
          toolUsed: result.toolUsed,
          toolResult: result.toolResult,
          confidence: result.confidence
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        error: error.response?.data?.error || error.message || 'Request failed'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  const clearSession = () => {
    if (sessionId) {
      axios.delete(`${config.API_URL}/api/agent/session/${sessionId}`)
        .then(() => {
          setMessages([]);
          const newSession = `session_${Date.now()}`;
          localStorage.setItem('querychain_session_id', newSession);
          setSessionId(newSession);
        })
        .catch(err => console.error('Failed to clear session:', err));
    }
  };

  return (
    <div className="input-area">
      {/* Mode Toggle */}
      <div className="query-type-toggle">
        <button
          className={`toggle-btn ${mode === 'query' ? 'active' : ''}`}
          onClick={() => setMode('query')}
          type="button"
        >
          🔍 Query Mode
        </button>
        <button
          className={`toggle-btn ${mode === 'update' ? 'active' : ''}`}
          onClick={() => setMode('update')}
          type="button"
        >
          ✏️ Update Mode
        </button>
      </div>

      <div className="input-wrapper">
        <div className="input-group" style={{ flex: 1 }}>
          <label htmlFor="userInput">Ask anything...</label>
          <input
            type="text"
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === 'query'
                ? "e.g., Find people with CTC > 50"
                : "e.g., Change CTC for John Doe to 70"
            }
            disabled={isLoading}
          />
        </div>
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => handleSend()}
            disabled={isLoading}
          >
            {isLoading ? <span className="loading"></span> : mode === 'query' ? '🔍 Query' : '✏️ Update'}
          </button>
          <button
            className="toggle-btn"
            onClick={clearSession}
            title="Clear conversation history"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputArea;
