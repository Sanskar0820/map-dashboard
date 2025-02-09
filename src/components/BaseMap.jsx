import React, { useState } from 'react'
import { TileLayer, GeoJSON, LayersControl, FeatureGroup, ScaleControl, useMap, useMapEvents } from 'react-leaflet'
// import indiastates  from '../assets/data/indiaStates.json';
// import indiaRivers  from '../assets/data/indiaRivers.json';
import indiaTehsilsFiltered  from '../assets/data/indiaTehsilsFiltered.json';
// import indiaDistrict  from '../assets/data/indiaDistrict.json';


// import L from 'leaflet';
import { FaHome } from "react-icons/fa";
import { BaseMapsLayers, mapCenter, setInitialMapZoom } from '../helpers/mapFunction';


// let filteredDistrictFeatures = indiaTehsils.features.filter((feature) => (feature.properties.DISTRICT ==="BAHRAICH" && feature.properties.STATE === "UTTARPRADESH") || 
// (feature.properties.DISTRICT ==="VIRUDHUNAGAR" && feature.properties.STATE === "TAMIL NADU") || 
// (feature.properties.DISTRICT ==="BEGUSARAI" && feature.properties.STATE === "BIHAR"));


function DistrictOnEachFeature(feature, layer) {
  layer.on('mouseover', function (e) {

    const popupContent = `
      <div>
        District: ${feature.properties.District}<br/>
        State: ${feature.properties.STATE}<br/>
      </div>
    `;
    layer.bindTooltip(popupContent, { sticky: true });
    layer.openTooltip();
  });

  layer.on('mouseout', function () {
    layer.closeTooltip();
  });
}

function TehsilOnEachFeature(feature, layer) {
  layer.on('mouseover', function (e) {

    const popupContent = `
      <div>
        Tehsil: ${feature.properties.TEHSIL}<br/>
        District: ${feature.properties.DISTRICT}<br/>
        State: ${feature.properties.STATE}<br/>
      </div>
    `;
    layer.bindTooltip(popupContent, { sticky: true });
    layer.openTooltip();
  });

  layer.on('mouseout', function () {
    layer.closeTooltip();
  });
}


const BaseMap = () => {
  const [mousePosition, setMousePosition] = useState({ lat: 0, lng: 0 });

  const map = useMap();

  const HandleMouseHover = () => {


    useMapEvents({
      mousemove: (e) => {
        setMousePosition(e.latlng);
      },
    });
    return null;
  };




  const handleZoomToCenter = () => {
    map.setView(mapCenter, setInitialMapZoom());

  };




  return (
    <>
      <LayersControl position="topright" collapsed={true}>
        {BaseMapsLayers.map((layer, index) => {
          return (
            <LayersControl.BaseLayer
              key={index}
              checked={index === 0 ? true : false}
              name={layer.name}
            >
              <TileLayer
                attribution={layer.attribution}
                url={layer.url}
                subdomains={layer.subdomains}
              />
            </LayersControl.BaseLayer>
          )
        })}




        

        {/* <LayersControl.Overlay checked name="States Boundary">
          <FeatureGroup>
            
            <GeoJSON data={indiastates.features} style={{
              fillColor: 'none',
              weight: 2,
              color: 'black',
              interactive: false
            }} />
          </FeatureGroup>
        </LayersControl.Overlay> */}


        {/* <LayersControl.Overlay name="Rivers">
          <FeatureGroup>
            <GeoJSON data={indiaRivers.features} style={{
              fillColor: 'none',
              weight: 2,
              color: 'blue',
              interactive: false
            }} />
          </FeatureGroup>
        </LayersControl.Overlay> */}

        {/* <LayersControl.Overlay name="Tehsil Boundary">
          <FeatureGroup>
            <GeoJSON data={indiaTehsils.features} style={{
             weight: 0.3,
             fillColor: "black",
             fillOpacity: 0.00001,
             // dashArray: 3,
             color: 'black'
            }} 
            onEachFeature={TehsilOnEachFeature}
            />
          </FeatureGroup>
        </LayersControl.Overlay> */}

        {/* <LayersControl.Overlay name="District Boundary">
          <FeatureGroup>
            <GeoJSON data={indiaDistrict.features} style={{
              weight: 0.5,
              fillColor: "black",
              fillOpacity: 0.00001,
              // dashArray: 3,
              color: 'black'
            }} onEachFeature={DistrictOnEachFeature} />
          </FeatureGroup>
        </LayersControl.Overlay> */}


        <GeoJSON data={indiaTehsilsFiltered} style={{
             weight: 2,
             fillColor: "red",
             fillOpacity: 0.002,
             // dashArray: 3,
             color: 'red'
            }} onEachFeature={TehsilOnEachFeature}
            />


      </LayersControl>

      <HandleMouseHover />

      <div
        className='coordinates_container' >
        Lat: {mousePosition.lat.toFixed(4)}, Long:{" "}
        {mousePosition.lng.toFixed(4)}
      </div>
      <button className='zoom_btn' onClick={handleZoomToCenter}><FaHome /></button>
      <ScaleControl />




    </>
  )
}

export default BaseMap