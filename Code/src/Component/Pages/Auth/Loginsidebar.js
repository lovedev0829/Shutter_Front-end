import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default function Loginsidebar({title,descrption,users}) {
  const param = useParams();
  return (
    <>
      <div className="col-lg-5 gradient_bg h_100vh" style={{backgroundColor:users?.primaryColor}}>
        <div className="inner_content_two">
          <Link to={`/${param.type}`} className="text-white font_wight_700">
            {users?.logo &&<img src={users?.logo} className="img-fluid" alt=" " loading="lazy" style={{maxWidth:"60px",borderRadius:"8px"}}/>}
          </Link>
          <div className="line_height_24">
            <h2 className="heading_41 text-white mb_16">
             {title} 
            </h2>
            <p className="para_18 text-white">
                {descrption}
             
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
