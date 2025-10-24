import React from 'react';
import './Load.css';

const Load = (props:{timeout:number}) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
          const loader = document.getElementById('loader-wrapper');
          if (loader) {
            loader.remove();
          }
        }, props.timeout);
        return () => clearTimeout(timer);
    }, [props.timeout]);

  return (
    <div id='loader-wrapper' className='h-[100vh] fixed bg-white flex justify-center  z-30 w-full'>
        <div className='m-auto'>
          <div className='loader rotate-180'></div>
        </div>
    </div>
  )
}

export default Load