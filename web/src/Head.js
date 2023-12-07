import React,{useState} from 'react';
import { Layout,Menu} from 'antd';
import {useNavigate} from "react-router-dom";
import NewButton from './NewButton'

const {Header} = Layout;


const Head = () => {
    const [menus, setMenus]= useState([ {title:"Parks", path:"/"},{title:"About",path:"/"} ]);
    const navigate = useNavigate();

    const menuClick = (event) => {
        navigate(event.item.props.path);

    }

    return (
            <Header style={{backgroundColor:'rgba(220, 54, 70, 0.85)'}}>
                 <div style={{
                    color:"white",fontSize:"22px",float:"left",width:"120px",display:"block",textAlign: "left", marginLeft: "-30px"
                }}> ParkRating </div>

                <div style={{
                    marginLeft: "50px",
                    float:"left",
                    display:"block",
                    width:'400px'
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
                <NewButton />

            </Header>

    );
}



export default Head;