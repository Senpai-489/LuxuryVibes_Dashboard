import React from 'react'

const ReturnToLogin = () => {
  return (<div>
    <div className='text-5xl p-12'>Please Log in First</div>
    
    <button className='bg-blue-500 text-white px-4 py-2 m-12 rounded hover:bg-blue-600 mt-4' onClick={()=>{window.location.href="/"}}>Return to Login</button>  
  </div>
  )
}

export default ReturnToLogin