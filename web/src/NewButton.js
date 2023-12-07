import React, {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Modal, Row, Col, Input, Rate, Upload} from "antd";
import Maps from './Map';

const {TextArea} = Input;

const NewButton = () => {
    const [show, setShow] = useState(false);

    const [imagePreviewShow, setImagePreviewShow] = useState(false);
    const [imagePreviewTitle, setImagePreviewTitle] = useState(false);

    const handleShowModal = () =>{
        setShow(true);
    }
    const handleOnOk = () =>{
        setShow(false);
    }

    const handleCancelOk = () =>{
        setShow(false);
    }

    const UploadButton = (
        <div>
            <PlusOutlined />
            <div style={{"marginTop": 8}}>upload</div>
        </div>
    );

    const uploadImagePreviewHandler = () =>{
        setImagePreviewShow(true);
    }

    const imagePreviewShowCancel = () =>{}

    return(
        <div style = {{float:"right", display:"black", width:"100px"}}>
        <Button style={{
            backgroundColor:'transparent',
            color:"rgba(255, 255, 255)"
        }}
        size="large"
        onClick={handleShowModal}
        >New</Button>
            <Modal width={"800px"} title="Add a park" open={show} omOk={handleOnOk} onCancel={handleCancelOk}>
                <Row><Col span={3} style={{ marginTop: '1em' }}>user name: </Col></Row>
                <Row><Col span={24}><Input size="small"/></Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>park name: </Col></Row>
                <Row><Col span={24}><Input size="small"/></Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>rating: </Col></Row>
                <Row><Col span={24}><Input size="small"/><Rate /></Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>address: </Col></Row>
                <Row><Col span={24}><Input size="small"/></Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>location: </Col></Row>
                <Row><Col span={24}><Maps latlng={{lat:0, lng:0}} zoom={6}/></Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>image: </Col></Row>
                <Row><Col span={24}>
                    <Upload
                        action = ""
                        listType = "picture-card"
                        onPreview={uploadImagePreviewHandler}
                    >
                        {UploadButton}
                    </Upload>
                </Col></Row>

                <Row><Col span={3} style={{ marginTop: '1em' }}>description: </Col></Row>
                <Row><Col span={24}><TextArea row={4} /></Col></Row>

            </Modal>

        </div>
    );

}
export default NewButton;