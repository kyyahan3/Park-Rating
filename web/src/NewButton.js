import React from "react";
import {Button} from "antd";

const NewButton = () => {
    return(
        <div style = {{float:"right", display:"black", width:"100px"}}>
        <Button style={{
            backgroundColor:'transparent',
            color:"rgba(255, 255, 255)"
        }}
        size="large"
        >New</Button>

        </div>
    );

}
export default NewButton;