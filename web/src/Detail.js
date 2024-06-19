import {useSearchParams} from 'react-router-dom'; // install the router
import {useState, useEffect} from 'react';
import {Layout, Row, Col, Divider, Rate, Carousel, Image, List, Typography, Button, Modal, Input, message} from "antd";
import axios from 'axios';
import Maps from "./Map";

import {no_image} from './constants/global';
import moment from "moment";

const {Content} = Layout;
const {Paragraph, Text} = Typography;
const {TextArea} = Input;


const Detail = ({windowHeight}) =>{
    const [searchParams] = useSearchParams();
    const [paramID, setParamID] = useState(searchParams.get("id"));
    const [park, setPark] = useState({title: "", stars: 0, address: "", description:"", comments: 0, latitude:0, longitude:0,
        images: [], opening_hours: "", entrance_fee: "", activities: ""});

    useEffect(()=>{
        const paramID = searchParams.get('id');
        getParksDetail(paramID);
    }, []);

    //  get park detail
    const getParksDetail = (id) => {
        axios.get('/api/get_park_detail', {params:{id:id}}).then((res)=>{
          if(res.data.code != 0){
            message.error(res.data.message);
            return;
          }
          setPark(res.data.data);
        }).catch((error)=>{
          console.log(error.message);
        });
    };

    return(
        <Content style={{minHeight:windowHeight}}>
            <Row style={{marginTop:"25px"}}>
                <Col span={2}></Col>
                <Col span={12}>
                    <Description park={park}/>
                    <Divider plain>Latest Comments</Divider>
                    <Comments parkID = {paramID}/>
                </Col>


                <Col span={7} offset={1}>
                    <Divider plain>Park Images</Divider>
                    <Imgs images={park.images.length === 0 || park.images.every(img => img === '') ? [no_image] : park.images} />
                    <Divider plain>Location</Divider>
                    <Maps latlng={{lat:parseFloat(park.latitude), lng:parseFloat(park.longitude)}} zoom={9}/>
                    <Divider style={{marginTop:"25px"}} plain>News</Divider>
                    <News parkID = {paramID}/>
                </Col>

            </Row>
        </Content>
    );
}

// description component
const Description = ({park}) => {
    return (
        <div>
            <Row><h1>{park.fullName}</h1></Row>
            <Row style={{marginTop:"10px", lineHeight:"35px"}}>
                <Col span={6}><Rate disabled defaultValue={park.rating} value={park.rating}/></Col>
                <Col span={6}><span>Average Rating: {park.rating} </span></Col>
                <Col span={4}>Ticket: {park.entrance_fee}</Col>
                <Col span={4}>{park.comments} comments </Col>
            </Row>
            <Row style={{marginTop:"15px"}}><h3>Opening hours:</h3></Row>
            <Row style={{marginTop:"3px"}}><span>{park.opening_hours}</span></Row>
            <Row style={{marginTop:"15px"}}><h3>Directions:</h3></Row>
            <Row style={{marginTop:"3px"}}><span>{park.address}</span></Row>
            <Row style={{marginTop:"15px"}}><h3>Park Description: </h3></Row>
            <Row style={{marginTop:"3px"}}><span>{park.description}</span></Row>
            <Row style={{marginTop:"15px"}}><h3>Activities: </h3></Row>
            <Row style={{marginTop:"3px"}}><span>{park.activities}</span></Row>
        </div>
    );
}

// image component
const Imgs = ({images}) => {
    return (
        <div>
            <Carousel autoplay style={{ background: `rgba(209, 209, 209, 0,5)`, height: 300, textAlign:"center"}}>
                {images.map((img, idx) => <Image key = {idx} height={300} src={img} />)}
            </Carousel>
        </div>
    );
}

// comment component
const Comments =(parkID) => {
    const [coms, setComs] = useState([]);

    useEffect(()=>{
        getCommentList(parkID);
    }, []);

    const commentAddEventHandle = () => {
        getCommentList(parkID);
        // const data = comments.map(item=>item);
        // setComs()comments
    }

    const getCommentList = (id) =>{
        axios.get('/api/get_comments', {params:{parkID:id.parkID}}).then((res)=>{
            // console.log(parkID);
            setComs(res.data.data);
        }).catch((error)=>{
            message.error(error.message);
        });

    };
    return (
        <div>
            <List
                header={<CommentButton parkID={parkID} addEventCallbackFunc={commentAddEventHandle}/>}
                bordered
                size="small"
                dataSource={coms}
                renderItem={(item) => (
                    <List.Item>
                        <Typography>
                            <Paragraph>
                                <span><b>User: {item.author_name}</b> </span>
                                <span style={{marginLeft:"45px"}}> Rating: {item.rating}</span>
                                <span style={{marginLeft:"45px"}}> Time: {moment(item.time*1000).format("YYYY-MM-DD HH:mm")}</span>
                            </Paragraph>
                            <Text>{item.text}</Text>
                        </Typography>
                    </List.Item>
                )}
            />
        </div>
    );
}


const CommentButton = ({parkID, addEventCallbackFunc})=>{
    const [show, setShow] = useState(false);

    const [user, setUser] = useState("");
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const handelShowModal = () => {
        setUser("");
        setRating(0);
        setText("");
        setShow(true);
    }

    const handelCancelModal = () =>{
        setShow(false);
    }

    const handelOkModal = () =>{
        console.log("parkId:", parkID.parkID);
        console.log("ratings:", rating);
        console.log("text:", text);
//        comments.push({user:user, rating:rating, time:"", text:text});
        const param = {parkId:parkID.parkID, user:user, rating:rating, text:text}
        addComment(param);
    }

    const addComment = (param) =>{
      axios.post("/api/add_comment", {data: param}, {header:{"Content-Type":"application/json"}}).then((res)=>{
        console.log(res);
        if(res.data.code != 0){
          message.error(res.data.message);
          return
        }
        addEventCallbackFunc();
        setShow(false);

      }).catch((error)=>{
        message.error(error.message);
      })

    }

    return(
        <div>
            <Button tone="primary" size="small" onClick={handelShowModal}>Comment</Button>
            <Modal title="comment" open={show} onOk={handelOkModal} onCancel={handelCancelModal}>
                <Row>
                    <Col span={5}>User Name: </Col>
                    <Col span={10}><Input size="small" value={user} onChange={e=>{ e.persist(); setUser(e.target.value); }} /></Col>
                </Row>
                <Row>
                    <Col span={5} style={{ marginTop: "3px" }}>Rating: </Col>
                    <Col span={18} style={{ marginTop: "3px" }}><Rate value={rating} onChange={setRating}/></Col>
                </Row>
                <Row>
                    <Col span={5} style={{ marginTop: "3px" }}>Comments: </Col>
                    <Col span={18} style={{ marginTop: "3px" }}><TextArea row={4} value={text} onChange={e => {e.persist(); setText(e.target.value);}}/></Col>
                </Row>
            </Modal>
        </div>
    )
}

// released news list
const News = (parkID) => {
    const [news, setNews] = useState([]);

    useEffect(()=>{
        getNewsList(parkID);
    }, []);

    const getNewsList = (id) =>{
        axios.get('/api/search_park_news', {params:{parkID:id.parkID}}).then((res)=>{
            console.log(parkID);
            setNews(res.data.data);
        }).catch((error)=>{
            console.log(error);
        });

    };

    return (
        <div>
            <List
                size="small"
                dataSource={news}
                renderItem={(item) => (
                    <List.Item>
                        <Typography>
                            <Paragraph>
                                <Row><h5>Title: {item.title}</h5></Row>
                                <Row> Time: {moment(item.time*1000).format("YYYY-MM-DD HH:mm")}</Row>
                            </Paragraph>
                            <Text>{item.abstract}</Text>
                        </Typography>
                    </List.Item>
                )}
            />
        </div>
    );
}


export default Detail;
