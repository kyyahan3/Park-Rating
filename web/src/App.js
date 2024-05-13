import React, {useState} from 'react';
import { Layout } from 'antd';
// import {Header, Footer, Content} from 'antd/es/layout/layout';
// import the router package
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import "./index.css";
import Head from './Head';
import Body from './Body';
import Detail from './Detail';
import Footer from './Foot';

const App = () => {
  //  declare the bodyHeight is equal to window_Height - HeaderHeight -64
  const [bodyHeight, setBodyHeight]=useState(window.innerHeight -64 -64);
  // listen to the new park added
  const [newEvent, setNewEvent] = useState(0);
  
  const newEventHandle=(eventValue)=>{
    setNewEvent(eventValue);
  }

  return (
  <BrowserRouter>
    <Layout>
      <Head newEventCallback={newEventHandle} />

      <Routes>
          <Route path='/' element = {<Body windowHeight={bodyHeight} newEventNotice={newEvent}/>} />
          <Route path='/detail' element={<Detail windowHeight={bodyHeight} />} />

      </Routes>

      <Footer></Footer>
    </Layout>
  </BrowserRouter>
  );
}

export default App;