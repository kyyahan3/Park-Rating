import React,{ useState } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import NewButton from './NewButton'

const {Header} = Layout;


const Head = () => {
  const [menus] = useState([
    { title: "Parks", path: "/parks" },
    { title: "My Parks", path: "/my-parks" }
  ]);

  const navigate = useNavigate();
  const location = useLocation();  // Get access to the location object

  const menuClick = (event) => {
      navigate(event.item.props.path);
  }

  return (
    <Header style={{backgroundColor:'rgba(220, 54, 70, 0.85)'}}>
      <div style={{
        color:"white",fontSize:"22px",float:"left",width:"120px",display:"block",textAlign: "left", marginLeft: "-30px"
      }}> ParkRating </div>

      <div style={{
        marginLeft: "50px", float:"left", display:"block", width:'400px'
      }}>
        <Menu style={{
          backgroundColor:"transparent",
          color : "rgba(255, 255, 255, 0.55)",
          marginLeft: "50px"
        }}
        mode="horizontal"
        defaultSelectedKeys = {['Parks']}
        items={menus.map((item)=>{
          const key=item.title;
          return {key, label: `${item.title}`, path: item.path};
        })}
        onClick={menuClick}
        />
      </div>

      {/* {location.pathname === '/my-parks' && <NewButton newEvent={newEventCallback} />} */}

    </Header>
  );
}



export default Head;