import { useContext, useState } from 'react'
import LandingPage from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Fotter from './components/Fotter'
import Transaction from './pages/Transaction'
import { AuthContext } from './Context/Context'
import { ToastContainer } from 'react-toastify'


function App() {

  return (
   <div className='container h-100'>
    <Navbar/>
    <ToastContainer/>
      <Routes>

         <Route path='/' element={<LandingPage/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/Signup' element={<SignUp/>}/>
          <Route path='transaction' element={<Transaction/>}/>
        
      </Routes>
      <Fotter/>
   </div>
  )
}

export default App
