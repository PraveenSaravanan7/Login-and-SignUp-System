import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from "../api"
import { UsersList } from "../components/UsersList";
const ls=require("local-storage")
export const PanelPage = () => {

    var [loading,setloading]=useState(false); 
    var [err,seterr]=useState(false); 
    var [users,setusers]=useState([])
    async function getallUser() {
        //console.log(formData)
        setloading(true)
        seterr(false)
        try {           
            let  url="/users"
          const response = await axios.get(url);         
          if(response.data){
            
            return response.data
            
          }
          setloading(false)
        } catch (error) {
          seterr(error);
          setloading(false)
        }
      }
    useEffect(() => {
        getallUser().then(data =>{
         setusers(data)
        })
    }, [])
    return (
        <div className="container" >
            <div className="jumbotron mt-4 border bg-white" >
                {loading ?
                <div>
                  { users.map((user)=> <UsersList key={user._id} data={user} ></UsersList>
                    )}
                </div> :
                <h3 className="text-primary" >Loading....</h3>}
            </div>
        </div>
    )
}
