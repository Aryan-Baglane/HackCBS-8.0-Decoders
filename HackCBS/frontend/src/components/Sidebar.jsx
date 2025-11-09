function Sidebar() {
  const exampleQueries = [
    // Query Mode examples
    {
      text: "Find people with CTC > 50",
      mode: "query"
    },
    {
      text: "Who works at Google?",
      mode: "query"
    },
    {
      text: "Tell me about Kangan Gupta",
      mode: "query"
    },
    {
      text: "Average CTC by branch",
      mode: "query"
    },
    {
      text: "What is 123 + 456?",
      mode: "query"
    },
    {
      text: "Show people in CO branch",
      mode: "query"
    },
    
    // Update Mode examples
    {
      text: "Change CTC for John Doe to 70",
      mode: "update"
    },
    {
      text: "Update branch for Jane Smith to IT",
      mode: "update"
    },
    {
      text: "Set company for Kangan Gupta to Microsoft",
      mode: "update"
    }
  ];

  const handleExampleClick = (example) => {
    const event = new CustomEvent('exampleQuery', {
      detail: { 
        query: example.text,
        mode: example.mode
      }
    });
    window.dispatchEvent(event);
  };

  // Group examples by mode
  const queryExamples = exampleQueries.filter(e => e.mode === 'query');
  const updateExamples = exampleQueries.filter(e => e.mode === 'update');

  return (
    <div className="sidebar">
      <h3>🔍 Query Examples</h3>
      {queryExamples.map((example, index) => (
        <div
          key={`query-${index}`}
          className="example-query"
          onClick={() => handleExampleClick(example)}
        >
          {example.text}
        </div>
      ))}

      <h3 style={{ marginTop: '30px' }}>✏️ Update Examples</h3>
      {updateExamples.map((example, index) => (
        <div
          key={`update-${index}`}
          className="example-query"
          onClick={() => handleExampleClick(example)}
        >
          {example.text}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
