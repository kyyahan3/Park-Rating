import React, {useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {Button, Modal, Row, Col, Input, Rate, Upload, message} from "antd";
import Maps from './Map';
import axios from 'axios';

const {TextArea} = Input;

const getBase64 = (file) => new Promise((resolve, reject) =>{
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const NewButton = ({newEvent}) => {
  const [show, setShow] = useState(false);
  const [dynamVar, setDynamVar] = useState(0);

  const [user, setUser] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [picList, setPicList] = useState([]);
  const [desc, setDesc] = useState("");
  
  const [maxUploadPicNum] = useState(6);

  const [imagePreviewShow, setImagePreviewShow] = useState(false);
  const [imagePreviewTitle, setImagePreviewTitle] = useState('');
  const [imagePreviewSrc, setImagePreviewSrc] = useState('');

  const handelMapClick = (lat, lng) =>{
    setLat(lat);
    setLng(lng);
  }

  const handleShowModal = () =>{
    setShow(true);
  }

  const handleOnOk = () =>{
    const param = {
      user: user,
      title: title,
      rating: rating,
      address: address,
      lat: lat,
      lng: lng,
      imgs: picList.map(item=>item.response.data.id),
      desc: desc,
    };
    addCamp(param);
  }

  const handleCancelOk = () =>{
    setShow(false);
  }

  const addCamp = (param) =>{
    axios.post("/api/add_park", param, {headers:{'Content-Type': 'application/json'}}).then((res) =>{
      if(res.data.code != 0){
        message.error(res.data.message);
        return ;
      }
      message.success("Add camp successfully");
      // update the new event
      newEvent(dynamVar+1);
      setDynamVar(dynamVar+1);

      setShow(false);
    }).catch((err) =>{

      message.error(err.message);
    })
  };

  const uploadImagePreviewHandle = async(file) =>{
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setImagePreviewSrc(file.url || file.preview);
    setImagePreviewShow(true);
    setImagePreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  }

  const imagePreviewShowCancel = () => {setImagePreviewShow(false);}

  const uploadImageHandle = ({file, fileList, event}) => {
    console.log("upload handle", file.status, file, fileList, event);
    if (file.status == 'uploading') {
      message.success("Image Uploading");
      setPicList(fileList);
    }
    if (file.status == 'done') {
      message.success("Image Upload Successfully", 2);
      setPicList(fileList);
    }
    if (file.status == 'error') {
      message.error("Image Upload Failed", 3);
      const list = fileList.filter(item => item.uid != file.uid);
      setPicList(list);
    }
    setPicList(fileList);
  }

  const UploadButton = (
    <div>
      <PlusOutlined />
      <div style={{"marginTop": 8}}>upload</div>
    </div>
  );

  return(
    <div style = {{float:"left", display:"black", width:"100px"}}>
      <Button style={{
        backgroundColor:'#E0E0E0',
        color:"#808080"
      }}
      size="large"
      onClick={handleShowModal}
      > New </Button>
      <Modal width={"800px"} title="Add a park" open={show} onOk={handleOnOk} onCancel={handleCancelOk}>
        <Row><Col span={3} style={{ marginTop: '1em' }}>User Name: </Col></Row>
        <Row><Col span={24}>
          <Input size="small" value={user} onChange={e=>{ e.persist(); setUser(e.target.value); }}/>
        </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>Park Name: </Col></Row>
        <Row><Col span={24}>
          <Input size="small" value={title} onChange={e=>{ e.persist(); setTitle(e.target.value); }}/>
        </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>Rating: </Col></Row>
        <Row><Col span={24} style={{ marginTop: '1em' }}>
          <Rate value={rating} onChange={setRating} />
        </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>Address: </Col></Row>
        <Row><Col span={24}>
          <Input size="small" value={address} onChange={e=>{ e.persist(); setAddress(e.target.value); }}/>
          </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>Location: </Col></Row>
        <Row><Col span={24}>
          <Maps latlng={{lat:lat, lng:lng}} zoom={6} moveable={true} onClick={handelMapClick} />
        </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>Image(s): </Col></Row>
        <Row><Col span={24}>
          <Upload
            action = "http://localhost:8081/api/upload"
            listType = "picture-card"
            fileList = {picList}
            onPreview={uploadImagePreviewHandle}
            onChange={uploadImageHandle}
          >
            {picList.length >= maxUploadPicNum ? null : UploadButton}
          </Upload>
        </Col></Row>

        <Row><Col span={3} style={{ marginTop: '1em' }}>description: </Col></Row>
        <Row><Col span={24}>
          <TextArea row={4} placeholder="150 words max" maxLength={150} value={desc} onChange={e=>{ e.persist(); setDesc(e.target.value); }}/>
        </Col></Row>
      </Modal>
      
    </div>
  );

}
export default NewButton;