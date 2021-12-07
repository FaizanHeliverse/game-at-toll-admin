import React from 'react'
import UserManagementTable from './UserManagementTable'
import './UserManagement.css'
function UserManagement() {
    return (
        <div className="user_management_container">  
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1>User Mangement</h1>
        <input type="text" list="browsers" size="50px" placeholder="Search..."/>
        <datalist id="browsers">
  <option value="Edge"/>
  <option value="Firefox"/>
  <option value="Chrome"/>
  <option value="Opera"/>
  <option value="Safari"/>
  <option value="saf"/>
  <option value="fas"/>
</datalist>
        </div>
           
            <UserManagementTable/>
        </div>
    )
}

export default UserManagement
