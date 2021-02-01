import { set } from 'local-storage'
import React, { useState } from 'react'
import { act } from 'react-dom/test-utils'
import axios from "../api"
export const UsersList = (props) => {
    var [active,setactive]=useState(props.data.active)
    var [loading,setloading]=useState(false)
    var [err,seterr]=useState(false); 
    async function userpermission() {
        //console.log(formData)
        setloading(true)
        seterr(false)
        try {           
            let  url="/users"
        const response = await axios.put('/users/'+props.data._id,{"active":!active});     
          setloading(false)       
          if(response.data){
           setactive(!active)
          }         
        } catch (error) {
          seterr(error);
         // setloading(false)
        }
      }
    return (
        <div className="border-bottom mb-3 pb-3" >
            <h4>{props.data.name}</h4>
            <h6>{props.data.email}</h6>
            {!loading && <>
            {active?<button className="btn btn-sm btn-danger" onClick={()=>{userpermission()}} >Deactivate</button>:<button className="btn btn-sm btn-success"  onClick={()=>{userpermission()}}  >Activate</button>} </> }
            {loading && <>
            <span className="text-primary" >Loading...</span>
            </>}

        </div>
    )
}
