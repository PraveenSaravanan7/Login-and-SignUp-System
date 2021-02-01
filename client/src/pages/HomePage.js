import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from "../api"
const ls=require("local-storage")
export const HomePage = () => {
    var [user,setUser]=useState([null])
    var [allUser,setallUser]=useState()
    var [loading,setloading]=useState(true); 
    var [err,seterr]=useState(false); 
    async function getUser() {
        //console.log(formData)
        setloading(true)
        seterr(false)
        try {           
            let  url="/users/"+ls("user_id")
          const response = await axios.get(url);  
          setloading(false)       
          if(response.data){
            console.log(response.data)
            return response.data
          }
          
        } catch (error) {
          seterr(error);
         // setloading(false)
        }
      }
    
    useEffect(() => {
        getUser().then(data=>{
            setUser(data)
        })
    }, [])
    return (
        <div className="container" >
            <div className="jumbotron mt-4 border bg-white" >
                {!loading?
                <div>
                    <h2>{user.name}</h2>
                    <h6>{user.email}</h6>
                   
                    { user.active?<span className="text-success font-weight-bold" >Your account is Active</span>:<span className="text-danger font-weight-bold" >Your account is Deactivated by the Admin</span> }<br/>
                     {user.admin && <Link to={"/panel"} > <button  className='btn btn-sm mt-3 btn-primary' >Admin Panel</button></Link>  }
                    <br/>
                </div>:
                <h3 className="text-primary" >Loading....</h3>}
            </div>
        </div>
    )
}
