import ResultTable from './ResultTable';

function Message({ message }) {
  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.7) return 'confidence-high';
    if (confidence >= 0.4) return 'confidence-medium';
    return 'confidence-low';
  };

  const getToolIcon = (toolName) => {
    const icons = {
      'vector_search': '🔍',
      'database_query': '📊',
      'update_database': '✏️',
      'calculator': '🧮',
      'aggregation': '📈'
    };
    return icons[toolName] || '🔧';
  };

  const getConfidenceBadge = (confidence) => {
    if (!confidence) return null;
    
    let level, text;
    if (confidence >= 0.8) {
      level = 'high';
      text = 'High Confidence';
    } else if (confidence >= 0.5) {
      level = 'medium';
      text = 'Medium Confidence';
    } else {
      level = 'low';
      text = 'Low Confidence';
    }

    return <span className={`confidence-badge confidence-${level}`}>{text}</span>;
  };

  const isUser = message.type === 'user';
  const isUpdate = message.mode === 'update' || message.modifiedCount !== undefined;

  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? 'U' : 'AI'}
      </div>
      <div className="message-content">
        {isUser ? (
          message.content
        ) : (
          <>
            {message.error ? (
              <div className="error-message">
                ❌ Error: {message.error}
              </div>
            ) : (
              <>
                {/* AI Agent Response */}
                {message.answer && (
                  <>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {message.answer}
                    </div>

                    {/* Update Mode - Show modified count */}
                    {!isUser && isUpdate && message.modifiedCount !== undefined && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#e8f5e9', borderRadius: '8px' }}>
                        <strong>📝 Update Summary:</strong>
                        <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                          <li>Modified: {message.modifiedCount} record(s)</li>
                          {message.matchedCount !== undefined && (
                            <li>Matched: {message.matchedCount} record(s)</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Query Mode - Show tool used */}
                    {!isUser && message.toolUsed && !isUpdate && (
                      <div style={{ 
                        fontSize: '0.8em', 
                        color: '#666', 
                        marginTop: '10px',
                        padding: '5px 10px',
                        background: '#f5f5f5',
                        borderRadius: '5px',
                        display: 'inline-block'
                      }}>
                        {getToolIcon(message.toolUsed)} Tool: {message.toolUsed}
                      </div>
                    )}

                    {/* Show data if available */}
                    {message.toolResult && message.toolResult.data && (
                      <ResultTable data={message.toolResult.data} />
                    )}

                    {/* Show calculation result */}
                    {message.toolResult && message.toolResult.result !== undefined && (
                      <div style={{ 
                        marginTop: '10px',
                        padding: '10px',
                        background: '#e8f5e9',
                        borderRadius: '5px',
                        fontWeight: 'bold'
                      }}>
                        Result: {message.toolResult.result}
                      </div>
                    )}

                    {/* Show confidence badge */}
                    {message.confidence && !isUpdate && getConfidenceBadge(message.confidence)}
                  </>
                )}

                {/* Fallback for old format messages */}
                {!message.answer && message.data && message.data.length > 0 && (
                  <>
                    <strong>Found {message.data.length} result(s):</strong>
                    <ResultTable data={message.data} />
                  </>
                )}

                {!message.answer && message.success && (
                  <div className="success-message">
                    ✅ {message.content}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Message;
