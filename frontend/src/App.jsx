import HomePage from './homePage'
import Signup from './Signup'
import Login from './Login'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  

  return (
    
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
   
  )
}

export default App
