import React, { useState, useEffect } from "react";
import { useLoader} from "../../contexts/AuthProvider";

function MyLoader() {
const [loaderState,setLoader] = useLoader()

useEffect(() => {
    
}, [])
  return (
    <div>
      {loaderState && 
        <div className="fixed z-50 bg-black inset-0 bg-opacity-25 flex items-center justify-center px-3">
        
       
          <div>
            <div className="m-auto bg-primaryBtn h-[40px] w-[80px] rounded-full flex items-center justify-center space-x-2">
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
            </div>
          </div>
        
      </div>
      }
    </div>
  )
}

export default MyLoader;
