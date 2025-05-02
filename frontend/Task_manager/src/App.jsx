import React from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/user/UserDashboard';
import MyTasks from "./pages/user/MyTasks";
import ViewTaskDetails from './pages/user/ViewTaskDetails';
const App = () => {
  return (
    <div>
        <Router>
           <Routes>
               <Route path='/login' element={<Login/>}></Route>
               <Route path='/signup' element={<Signup/>}></Route>

               <Route element={<privateRoute allowedRoles={["admin"]}/>}>
                <Route path='/admin/dashboard' element={<Dashboard/>}/>
                <Route path='/admin/tasks' element={<ManageTasks/>}/>
                <Route path='/admin/create-task' element={<CreateTask/>}/>
                <Route path='/admin/users' element={<ManageUsers/>}/>               
               </Route>

               <Route element={<privateRoute allowedRoles={["admin"]}/>}>
                <Route path='/user/dashboard' element={<UserDashboard/>}/>
                <Route path='/user/my-tasks' element={<MyTasks/>}/>
                <Route path='/user/task-details/:id' element={<ViewTaskDetails/>}/>            
               </Route>
           </Routes>
        </Router>
    </div>
  )
}

export default App
