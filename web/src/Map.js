import {useState, useEffect} from "react";
import GoogleMapReact from "google-map-react";

// Map component

const Maps = ({latlng, zoom, onClick=undefined, moveable=false}) =>{
  const [key] = useState(process.env.REACT_APP_MAP_API);
  const [intLatLng, setLatLng] = useState(latlng);
  const [inZoom, setZoom] = useState(zoom);

  useEffect(()=>{
    setLatLng(latlng)
  }, [latlng]);

  const handleOnClick = ({x, y, lat, lng, event}) =>{
    if(moveable){
      setLatLng({lat:lat, lng:lng});
    }
    if(onClick){
      onClick(lat, lng);
    }
  }

  return(
    <div style={{height:'300px'}}>
      <GoogleMapReact
        onClick = {handleOnClick}
        bootstrapURLKeys = {{key}}
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