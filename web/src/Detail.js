// we need to install the router
import {useSearchParams} from 'react-router-dom';
import {Layout, Row, Col, Divider, Rate, Image, Carousel} from "antd";

const {Content} = Layout;

const Detail = ({windowHeight}) =>{
    const [searchParams] = useSearchParams();

    return(
        <Content style={{minHeight:windowHeight}}>
            <Row>
                <Col span={14}>
                    <Description />
                    <Divider>latestdescription</Divider>
                    <Comments />
                </Col>


                <Col span={10}>
                    <Divider>campImage</Divider>
                    <Imgs />
                    <Divider>locationInformatin</Divider>
                    <Maps />
                </Col>
            </Row>
        </Content>
    );
}

// description component
const Description = () => {
    return (
    <div>
        <Row><h1>Test</h1></Row>
        <Row style={{lineHeight:"30px"}}>
            <Col span={6}><Rate disabled defaultValue={4}/></Col>
            <Col span={4}><span>avg Rating 4 </span></Col>
            <Col span={4}>total rating number 1000 </Col>
            <Col>2023-05-05</Col>
        </Row>
        <Row><h3>address: jdsfjuhefuevfej</h3></Row>
        <Row><h3>camp description: jdsfjuhefuevfej</h3></Row>
        <Row><span>sjnejbeh</span></Row>


    </div>
    );
}
const imgs = ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80", "https://www.exploregeorgia.org/sites/default/files/styles/slideshow_large/public/2022-06/timberline-glamping-lake-lanier.jpg?itok=pGl5rdJe"]
// image component
const Imgs = () => {
    return (
        <div>
            <Carousel autoplay style={{ background: `rgba(209, 209, 209, 0,5)`, height: 300, textAlign:"center"}}>
                {imgs.map((img, idx) => <Image key = {idx} height={300} src={img} />)}
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

// map component
const Maps = () => {
    return (
        <div> map </div>
    );
}

export default Detail;