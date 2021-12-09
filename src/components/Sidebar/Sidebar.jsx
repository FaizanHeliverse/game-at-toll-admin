import React,{useRef} from 'react'
import './Sidebar.css'
function Sidebar(props) {
    const [openSidebar,setOpenSidebar]=React.useState(false);
    const [openDashboard, setOpenDashboard]= React.useState('');
    const [openTimeManage,setOpenTimeManage]=React.useState("");
    // const [openTimeManage,setOpenTimeManage]=React.useState(false);
   const handleChange = ()=>{

   }

     // add active class in selected list item
     const one = useRef(null);
     const two = useRef(null);
     const three = useRef(null);
     const four = useRef(null);
     const five = useRef(null);
     const six = useRef(null);
     const seven = useRef(null);
     const arrowRef=useRef(null);


React.useEffect(()=>{
    let list = document.querySelectorAll('.list');
    console.log(list);
    for(let i=0;i<list.length;i++){
        list[i].onclick = function(){
            let j=0;
            while(j<list.length){
               
                
                list[j++].className="list";
            }
            list[i].className="list active"
        }
    }

},[])

    return (
        <div ref={arrowRef} className="navigation">
            <div  className="arrow" onClick={()=>{
                setOpenSidebar(!openSidebar)
               { !openSidebar ?arrowRef.current.classList.add('naactive'):arrowRef.current.classList.remove('naactive')}
               
            }}><ion-icon  style={!openSidebar?{transform:"rotate(180deg)"}:{transform:"rotate(0deg)"}} name="chevron-forward-circle-outline"></ion-icon></div>
          <ul>
              <li ref={one} className="list active">
                  <div onClick={()=>{
                   props.handleChange("dashboard")
                  }}>
                  <span className="icon"><ion-icon name="home-outline"></ion-icon></span>
                  <span className="title">Dashboard</span>
                  </div>
              </li>
              <li ref={one} className="list " onClick={()=>{
                   props.handleChange("gameTime")
                  }}>
              <div>
                  <span className="icon"><ion-icon name="game-controller-outline"></ion-icon></span>
                  <span className="title">Game Management</span>
                  </div>
              </li>
              <li  ref={one} className="list" onClick={()=>{
                   props.handleChange("addgame")
                  }}>
              <div>
                  <span className="icon"><ion-icon name="time-outline"></ion-icon></span>
                  <span className="title">Schedule Management </span>
                  </div>
              </li>
              <li ref={one} className="list" className="list" onClick={()=>{
                   props.handleChange("userManagement")
                  }}>
                    <div>
                  <span className="icon"><ion-icon name="people-outline"></ion-icon></span>
                  <span className="title">User Management</span>
                  </div>
              </li>
              <li ref={one} className="list" onClick={()=>{
                   props.handleChange("transactionManagement")
                  }}>
                    <div>
                  <span className="icon"><ion-icon name="wallet-outline"></ion-icon></span>
                  <span className="title">Transaction Management</span>
                  </div>
              </li>
              <li ref={one}className="list" onClick={()=>{
                   props.handleChange("uiManager")
                  }}>
                    <div>
                  <span className="icon"><ion-icon name="build-outline"></ion-icon></span>
                  <span className="title">UI Manager</span>
                  </div>
              </li>
              <li ref={one} className="list"onClick={()=>{
                   props.handleChange("logout")
                  }} >
                  <div>
                  <span className="icon"><ion-icon name="log-out-outline"></ion-icon></span>
                  <span className="title">Logout</span>
                  </div>
              </li>
          </ul>
            
        </div>
    )
}

export default Sidebar
