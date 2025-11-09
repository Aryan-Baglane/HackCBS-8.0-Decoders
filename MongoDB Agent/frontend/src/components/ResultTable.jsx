function ResultTable({ data }) {
  if (!data || data.length === 0) return null;

  // Get all unique keys, excluding internal fields
  const keys = [...new Set(data.flatMap(Object.keys))]
    .filter(k => k !== '_id' && k !== 'docEmbedding' && k !== 'score');

  return (
    <table className="result-table">
      <thead>
        <tr>
          {keys.map(key => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {keys.map(key => (
              <td key={key}>
                {row[key] !== undefined 
                  ? (typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key])
                  : 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ResultTable;
