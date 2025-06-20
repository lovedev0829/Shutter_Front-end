
import Sidebar from './Sidebar'

export default function SidebarLayout(props) {
  
  return (
    <>
      <div className="main_container">
      <div className="limani_body">
            <Sidebar />
            {props.children}
            </div>
            </div>
        
    </>
  )
}
