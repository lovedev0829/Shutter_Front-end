import React from 'react'
import { Link } from 'react-router-dom'

export default function AddEditButton({handleClick,title}) {
  return (
    <>
     <Link
                  to={"#"}
                  onClick={handleClick}
                  className="btn blue-btn small_btn"
                  
                >
                  <img src="/image/plus.svg" alt=" " loading="lazy"/> {title}
                </Link> 
    </>
  )
}
