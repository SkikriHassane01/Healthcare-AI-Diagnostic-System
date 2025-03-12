import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

const Home = () => <div>Healthcare AI Diagnostic System</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={ <div>Test</div> } />
      </Routes>
    </Router>
  )
}

export default App