// we need to install the router
import {useSearchParams} from 'react-router-dom';
import {Layout, Row, Col, Divider, Rate} from "antd";

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
// image component
const Imgs = () => {
    return (
        <div> imgs </div>
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