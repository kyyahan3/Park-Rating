// we need to install the router
import {useSearchParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Layout, Row, Col, Divider, Rate, Carousel, Image, List, Typography, Button, Modal, Input} from "antd";
import axios from 'axios';
import Maps from "./Map";

const {Content} = Layout;
const {Paragraph, Text} = Typography;
const {TextArea} = Input;

const Detail = ({windowHeight}) =>{
    const [searchParams] = useSearchParams();
//    const [paramID, setParamID] = useState(searchParams.get("id"));
    const [park, setPark] = useState({title: "", stars: 0, address: "", description:"", comments: 0, latitude:0, longitude:0, images: []});

    useEffect(()=>{
        const paramID = searchParams.get('id');
        getParksDetail(paramID);
    }, []);

    //  get park detail
    const getParksDetail = (id) => {
        axios.get('/api/get_park_detail', {params:{id:id}}).then((res)=>{
//            console.log(res);
            setPark(res.data.data);
        }).catch((error)=>{
            console.log(error);
        });
    };

    return(
        <Content style={{minHeight:windowHeight}}>
            <Row style={{marginTop:"20px"}}>
                <Col span={2}></Col>
                <Col span={12}>
                    <Description park={park}/>
                    <Divider>latestdescription</Divider>
                    <Comments />
                </Col>


                <Col span={7} offset={1}>
                    <Divider plain>Park Images</Divider>
                    <Imgs images={park.images}/>
                    <Divider plain>Location</Divider>
                    <Maps latlng={{lat:parseFloat(park.latitude), lng:parseFloat(park.longitude)}} zoom={9}/>
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
                <Col span={4}>{park.comments} comments </Col>
            </Row>
            <Row style={{marginTop:"15px"}}><h3>Address: {park.address}</h3></Row>
            <Row style={{marginTop:"10px"}}><h3>Park Description: </h3></Row>
            <Row style={{marginTop:"5px"}}><span>{park.description}</span></Row>


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
const Comments =() => {
    return (
        <div> comments </div>
    );
}

export default Detail;