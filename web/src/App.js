import React, {useState} from 'react';
import { Layout } from 'antd';
// import {Header, Footer, Content} from 'antd/es/layout/layout';
// import the router package
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import "./index.css";
import Head from './Head';
import Parks from './Parks';
import MyParks from './MyParks';
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
      <Head />

      <Routes>
          <Route path='/parks' element = {<Parks windowHeight={bodyHeight} />} />
          <Route path='/my-parks' element = {<MyParks windowHeight={bodyHeight} newEventCallback={newEventHandle}/>} />
          <Route path='/detail' element={<Detail windowHeight={bodyHeight} />} />
          {/* Ensure there's a route for the root "/" */}
          <Route path="/" element = {<Parks windowHeight={bodyHeight}/>} />

      </Routes>

      <Footer></Footer>
    </Layout>
  </BrowserRouter>
  );
}

export default App;