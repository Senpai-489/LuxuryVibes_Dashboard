'use client'
import React from 'react'
import SidebarDemo from '../../Components/Sidebar'
import { useAuth } from '@/lib/context/AuthContext';



const Dash = () => {
  const [login,setLogin]=React.useState(true)
  const { user } = useAuth();
  return (
        
        login?
        <div className='flex flex-row justify-s'>
        
        <SidebarDemo/>
        
        </div>
        
        :<div className='absolute top-[30%] left-[30%] text-5xl flex flex-col gap-2 justify-center'><h1>You can't access this Page yet</h1><a className='text-lg' href='/'>Log In</a></div>
   
  )
}

export default Dash