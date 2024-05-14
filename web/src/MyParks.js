import React, {useState, useEffect} from 'react';
import { Layout, List, Card, Rate, message, Row } from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
const {Content} = Layout;
const {Meta} = Card;
import NewButton from './NewButton';

import {no_image} from './constants/global';


// body overall component
const MyParks = ({windowHeight, newEventCallback}) => {
  return (
    <Content style={{minHeight: windowHeight}}>
      <ParkContent newNotice={newEventCallback}/>
    </Content>
  );
}

// list content component
const ParkContent = ({newNotice}) =>{
  const [parks, setParks] = useState([]);

  useEffect(()=>{
    getParks(true);
  }, [newNotice]);

  // get park list for home page
  const getParks = (tmp = true) => {  
    axios.get('/api/get_park_list', {
      params: {
        tmp: tmp  // Pass the `tmp` parameter to the API request
      }
    }).then((res) => {
      console.log(process.env.REACT_APP_MAP_API);
      setParks(res.data.data);
    }).catch((error) => {
      message.error(error.message);
    });
  };


  return(
    <Layout>
      <Row style={{ marginLeft: "20px", marginRight: "20px", marginTop: "20px", backgroundColor: "#F0F0F0", padding: "10px", borderRadius: "8px" }}>
        <NewButton newEvent={newNotice} />
        <span style={{ color: "gray", fontSize: "18px", alignSelf: "center" }}>Click the Button to Add A New Park to My Collection</span>
      </Row>
      <Row><div style={{marginLeft:"35px", marginTop:"40px"}}>
        <List
          grid={{column:4}}
          dataSource = {parks}
          renderItem = {(item) => (
            <List.Item>
              <Link to={{pathname:`/detail`, search:`id=${item.id}`}}>
                <Card
                  style={{width:300}}
                  cover={<img style={{height:"180px", width:"300px"}} src={item.imageUrl[0] ? item.imageUrl[0]:no_image} />}
                >

                  <Rate disabled defaultValue={item.rating}/>
                  <Meta title={item.fullName} description={`${item.description.substring(0,16)}...`}/>
                </Card>
              </Link>
            </List.Item>

          )}
        />
      </div></Row>
    </Layout>
  )

}

export default MyParks;


