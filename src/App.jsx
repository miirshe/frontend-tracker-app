import React from 'react'
import { Button } from './components/ui/button'
import Login from './pages/auth/login'
import Layout from './components/layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import Projects from './pages/dashboard/projects'
import Tasks from './pages/dashboard/tasks'
import Users from './pages/dashboard/users'

const App = () => {
  return (
    <BrowserRouter> 
   <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/auth/login" element={<Login/>}/>
    <Route path="/dashboard" element={<Layout/>}>
    <Route index element={<Dashboard/>}/>
    <Route path="projects" element={<Projects/>}/>
    <Route path="tasks" element={<Tasks/>}/>
    <Route path="users" element={<Users/>}/>
    </Route>

   </Routes>
   </BrowserRouter>
  )
}

export default App