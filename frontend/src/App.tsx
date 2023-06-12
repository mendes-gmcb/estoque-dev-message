import './styles/global.css'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Message from './components/Mensagem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/message" element={<Message/>} />
      </Routes>
  </Router>
  );
}

export default App
