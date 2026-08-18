import React, { useState } from 'react';
import  {useAuthenticationContext}  from '../context/AuthenticationContext';

const getUser=()=>{   
    const  {user}  = useAuthenticationContext();
    return user;
}

const UserDetails = () => {
   const user=getUser();
  return (
    <div>
        <div> User Name: {user.name}</div>
        <div> User Email: {user.email}</div>
        <div> Category: {user.usercategory}</div>
        <div> Level: {user.level}</div>
        <div> Instrument: {user.instrument}</div>
        <div> Favband: {user.favband}</div>
    </div>
  );
};

export default UserDetails;
