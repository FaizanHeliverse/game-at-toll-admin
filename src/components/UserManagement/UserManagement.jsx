import React, { useEffect, useState } from 'react'
import UserManagementTable from './UserManagementTable'
import './UserManagement.css'
import { fetchData } from '../../middleware/RequestHandler'
function UserManagement() {
    const [allUser,setAllUser] = useState([]);

    useEffect(async()=>{
        const response = await fetchData('/users',{method:'GET'})
        setAllUser(response.data);
    },[])

    return (
        <div className="user_management_container">  
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1>User Management</h1>
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
           
            <UserManagementTable data={allUser}/>
        </div>
    )
}

export default UserManagement
