'use client'
import React from 'react'
import { useCookies } from 'react-cookie'
const page = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['name','role','email']);
  return (
    <div className='m-2 h-[95vh] flex flex-col items-center justify-center p-4 border-2 border-black rounded-md'>
        <h1 className='text-5xl absolute top-24 m-4 font-bold'>Profile Page</h1>
        <h2 className='text-2xl font-semibold'>Name: {cookies.name}</h2>
        <h2 className='text-2xl font-semibold'>Role: {cookies.role==1?"Manager":"Employee"}</h2>
        <h2 className='text-2xl font-semibold'>Email: {cookies.email}</h2>
        <input type='button' value='Log Out' onClick={()=>{
            removeCookie('name');
            removeCookie('role');
            removeCookie('email');
            window.location.href = '/';
        }} className='mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer'/>
    </div>
  )
}

export default page