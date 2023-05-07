import React ,{useState} from 'react';
import { Layout, List, Card, Rate } from 'antd';
import {Link} from 'react-router-dom';
const {Content} = Layout;
const {Meta} = Card;

const data = [
    {id: "1", title: "test1", stars:3, addr:"addrtest", desc:"test", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]},
    {id: "2", title: "test2", stars:3, addr:"addrtest", desc:"test", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]},
    {id: "3", title: "test3", stars:3, addr:"addrtest", desc:"test", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]},
    {id: "4", title: "test4", stars:3, addr:"addrtest", desc:"test", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]},
    {id: "5", title: "test5", stars:3, addr:"addrtest", desc:"test", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]},
    {id: "6", title: "test6", stars:3, addr:"addrtest", desc:"/images.unsplash.com/photo-1504280390367-361c6d9f", imgs:["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"]}
];

// body overall component
const Body = ({windowHeight}) => {
    return (
        <Content style={{minHeight: windowHeight}}>
            <Camps />
        </Content>
    );
}

// list content component
const Camps = () =>{
    return(
        <div style={{marginLeft:"35px", marginTop:"20px"}}>
            <List
                grid={{column:4}}
                dataSource = {data}
                renderItem = {(item) => (
                    <List.Item>
                        <Link to={{pathname:`/detail`, search:`id=${item.id}`}}>
                            <Card
                                style={{width:300}}
                                cover={<img style={{height:"180px", width:"300px"}} src = {item.imgs[0]} />}
                            >

                                <Rate disabled defaultValue={item.stars}/>
                                <Meta title={item.title} description={`${item.desc.substring(0,16)}...`}/>
                            </Card>
                        </Link>
                    </List.Item>

                )}
            />
        </div>
    )

}

export default Body;


