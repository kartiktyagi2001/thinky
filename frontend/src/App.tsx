import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/signup'
import { Signin } from './pages/signin'
import { Home } from './pages/home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/generate' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
