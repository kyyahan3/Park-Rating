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
    const [bodyHeight]=useState(window.innerHeight -64 -64);

    return (
    <BrowserRouter>
        <Layout>
            <Head/ >

            <Routes>
                <Route path='/' element = {<Body windowHeight={bodyHeight} />} />
                <Route path='/detail' element={<Detail windowHeight={bodyHeight} />} />

            </Routes>

            <Footer/ >
        </Layout>
    </BrowserRouter>

    );
}
           // <Body windowHeight={500}/ >
export default App;