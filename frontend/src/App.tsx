import './styles/global.css'
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Produto from './components/Produto';
import Message from './components/Mensagem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/produto" element={<Produto/>} />
        <Route path="/message" element={<Message/>} />
      </Routes>
  </Router>
  );
}

export default App
