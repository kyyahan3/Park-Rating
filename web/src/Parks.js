import React, {useState, useEffect} from 'react';
import { Layout, List, Card, Rate, message, Pagination } from 'antd';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
const {Content} = Layout;
const {Meta} = Card;

import {no_image} from './constants/global';


// body overall component
const Parks = ({ windowHeight }) => {
  return (
    <Content style={{minHeight: windowHeight}}>
      <ParkContent/>
    </Content>
  );
}

// list content component
const ParkContent = () =>{
  const [parks, setParks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12); // Maximum parks per page

  useEffect(()=>{
    getParks();
  }, []);

  //  get park list for home page
  const getParks = () => {
    axios.get('/api/get_park_list', {params:{}})
    .then((res)=>{
      // console.log(process.env.REACT_APP_MAP_API);
      setParks(res.data.data);
    }).catch((error)=>{
      message.error(error.message);
    });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const paginatedParks = parks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return(
    <div style={{ marginLeft: "50px", marginTop: "20px" }}>
      <CSSTransition key={currentPage} timeout={500} classNames="fade">
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={paginatedParks}
          renderItem={(item) => (
            <List.Item>
              <Link to={{ pathname: `/detail`, search: `id=${item.id}` }}>
                <Card
                  style={{ width: 300 }}
                  cover={<img style={{ height: "180px", width: "300px" }} src={item.imageUrl[0] ? item.imageUrl[0] : no_image} />}
                >
                  <Rate disabled defaultValue={item.rating} />
                  <Meta title={item.fullName} description={`${item.description.substring(0, 31)}...`} />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </CSSTransition>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={parks.length}
        onChange={handlePageChange}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  )
}

export default Parks;


