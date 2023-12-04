import {useState, useEffect} from "react";
import GoogleMapReact from "google-map-react";

// Map component

const Maps = ({latlng, zoom}) =>{
    const [key] = useState("AIzaSyB_zatFU9dZqtZJN-BWsb2XmTyWArAj5a0");
//    console.log(latlng);

    const [intLatLng, setLatLng] = useState(latlng);
    const [inZoom, setZoom] = useState(zoom);

    useEffect(()=>{
        setLatLng(latlng)
    }, [latlng]);

    return(
        <div style={{height:'300px'}}>
            <GoogleMapReact
                bootstrapURLKeys={{key}}
                center = {intLatLng}
                defaultZoom = {inZoom}
            >
                <ReactMapPointComponent
                    lat={intLatLng.lat}
                    lng={intLatLng.lng}
                    text = "My Marker"
                />
            </GoogleMapReact>
        </div>
    )

}

const ReactMapPointComponent = () => {
    const markerStyle={
        border: '1px solid white',
        borderRadius: '50%',
        height: 10,
        width: 10,
        backgroundColor: 'red',
        cursor: "pointer",
        zInder: 10,
    };
    return(
        <div style={markerStyle}/>
    );
}
export default Maps;