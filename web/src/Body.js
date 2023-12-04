import React ,{useState, useEffect} from 'react';
import { Layout, List, Card, Rate } from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
const {Content} = Layout;
const {Meta} = Card;


// body overall component
const Body = ({windowHeight}) => {
    return (
        <Content style={{minHeight: windowHeight}}>
            <Parks />
        </Content>
    );
}

// list content component
const Parks = () =>{
    const [parks, setParks] = useState([]);

    useEffect(()=>{
        getParks();
    }, []);

//  get park list for home page
    const getParks = () => {
        axios.get('/api/get_park_list', {params:{}}).then((res)=>{
            console.log(res);
            setParks(res.data.data);
        }).catch((error)=>{
            console.log(error);
        });
    };


    return(
        <div style={{marginLeft:"35px", marginTop:"20px"}}>
            <List
                grid={{column:4}}
                dataSource = {parks}
                renderItem = {(item) => (
                    <List.Item>
                        <Link to={{pathname:`/detail`, search:`id=${item.id}`}}>
                            <Card
                                style={{width:300}}
                                cover={<img style={{height:"180px", width:"300px"}} src={item.imageUrl[0] ? item.imageUrl[0] : "https://propertywiselaunceston.com.au/wp-content/themes/property-wise/images/thumbnail-default@2x.png"} />}
                            >

                                <Rate disabled defaultValue={item.rating}/>
                                <Meta title={item.fullName} description={`${item.description.substring(0,16)}...`}/>
                            </Card>
                        </Link>
                    </List.Item>

                )}
            />
        </div>
    )

}

export default Body;


