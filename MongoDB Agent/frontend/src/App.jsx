import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import './App.css';

function App() {
  const [queryType, setQueryType] = useState('hybrid');

  return (
    <div className="app">
      <div className="container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <ChatArea queryType={queryType} setQueryType={setQueryType} />
        </div>
      </div>
    </div>
  );
}

export default App;
