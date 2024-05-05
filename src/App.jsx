import React from 'react'
import LoginPage from './Pages/LoginPage'
import { Route, Routes } from 'react-router-dom'
import SignupPage from './Pages/SignupPAge'
import HomePage from './Pages/HomePage'
function App() {
  return (
<>
<Routes>
  <Route path='/login' element={<LoginPage/>}/>
  <Route path='/signup' element={<SignupPage/>}/>
  <Route path='/' element={<HomePage/>}/>
</Routes>
</>
  )
}

export default App
