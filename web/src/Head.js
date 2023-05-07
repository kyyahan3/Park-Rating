import React,{useState} from 'react';
import { Layout,Menu} from 'antd';
import NewButton from './NewButton'

const {Header} = Layout;


const Head = () => {
    const [menus, setMenus]= useState([ {title:"Campgrounds", path:"/"}, {title:"Menu",path:"/"},{title:"About",path:"/"} ]);
    return (
            <Header style={{backgroundColor:'rgba(0, 255, 200, 0.85)'}}>
                 <div style={{
                    color:"white",fontSize:"22px",float:"left",width:"120px",display:"block",textAlign: "left", marginLeft: "-30px"
                }}>
                    YelpCamping
                </div>

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
                    defaultSelectedKeys = {['Campgrounds']}
                    items={menus.map((item)=>{
                      const key=item.title;
                      return {key, label: `${item.title}`, path: item.path};
                    })}>
                    </Menu>
                </div>
                <NewButton />

            </Header>

    );
}



export default Head;