import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Chatbot from './pages/Chatbot'
import Navbar from './components/Navbar'

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chatbot />} />
      </Routes>
    </Router>

  )
}

export default App
