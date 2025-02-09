import React, { useEffect, useState } from 'react'
import { MapContainer, GeoJSON } from 'react-leaflet'
import * as L from "leaflet";
import "leaflet/dist/leaflet.css"
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

import BaseMap from '../components/BaseMap';
import SearchBar from '../components/SearchBar';
import indiaTehsilsFiltered from '../assets/data/indiaTehsilsFiltered.json';
// import Legend from '../components/Legend';
import indiastates from '../assets/data/indiaStates.json';
import PlaceAttributes from "../assets/PlaceAttributesMap.json";
import FiltererdJsonData from '../components/FiltererdJsonData';
// import { renderYearsOptions } from '../helpers/functions.jsx/index.js';
import AnnualTimeSeriesChart from '../components/AnnualTimeSeriesChart';
import ClimatologyTimeSeriesChart from '../components/ClimatologyTimeSeriesChart';
import ExtremesConditionsCharts from '../components/ExtremesConditionsCharts';
import { mapCenter, maxBounds, setDragging, setInitialMapZoom } from '../helpers/mapFunction';

import { AnnualData } from '../assets/data/AnnualData.jsx';
import { ExtremesConditionsData } from '../assets/data/ExtremesConditionsData';
import { ClimatologyData } from '../assets/data/ClimatologyData';



const MapDatasetOptions = [
  {
    DataName: "Annual data",
    DataValue: "annual_data",
    Data: AnnualData,
    variables: [

      {
        name: "Rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Max. temperature",
        value: "t_max",
        unit: "°C",
      },
      {
        name: "Min. temperature",
        value: "t_min",
        unit: "°C",
      },
    ]
  },
  {
    DataName: "Climatology data",
    DataValue: "climatology_data",
    Data: ClimatologyData,
    variables: [

      {
        name: "Daily rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Daily max. temperature",
        value: "T_max",
        unit: "°C",
      },
      {
        name: "Daily min. temperature",
        value: "T_min",
        unit: "°C",
      },


    ]
  },
  {
    DataName: "Extreme conditions",
    DataValue: "extreme_condition",
    Data: ExtremesConditionsData,
    variables: [

      {
        name: "Rainfall",
        value: "pcp",
        unit: "mm",
      },
      {
        name: "Temperature",
        value: "temp",
        unit: "°C",
      },

    ]
  },
]


const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filteredIndiaDistrict, setFilteredIndiaDistrict] = useState(null);
  const [tehsilList, setTehsilList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTehsil, setSelectedTehsil] = useState(null);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);


  const [tehsilSelectedItem, setTehsilSelectedItem] = useState([]);
  const [selectedTehsilID, setSelectedTehsilID] = useState(null);

  const [showTimeseries, setShowTimeseries] = useState(false)

  const [selectedMapData, setSelectedMapData] = useState(null);
  const [selectedVariable, setSelectedVariable] = useState(null);




  const handleSelectMapData = (e) => {
    const selectedDataValue = e.target.value;
    const selectedData = MapDatasetOptions.find(item => item.DataValue === selectedDataValue);
    setSelectedVariable(null)
    setSelectedMapData(selectedData);
  };


  const handleSelectVariable = (e) => {
    const selectedOptionValue = e.target.value;
    const selectedOption = selectedMapData && selectedMapData.variables.find(variable => variable.value === selectedOptionValue);
    setSelectedVariable(selectedOption);
  };


  const handleShowTimeseries = () => {
    setShowTimeseries(!showTimeseries)
  }

  const handleDistrictSelect = (e) => {
    let items = PlaceAttributes.filter((item) => item.DISTRICT === e.target.value);

    items = [...new Set(items.map((item) => item))];
    items.sort();

    setTehsilList(items);
    setSelectedDistrict(e.target.value)
    setSelectedTehsilID(null)
    setSelectedTehsil(null)
    setSelectedMapData(null)

    let filteredDistrictFeatures = indiaTehsilsFiltered.features.filter((feature) => feature.properties.DISTRICT === e.target.value && feature.properties.STATE === items[0].STATE);

    setFilteredIndiaDistrict({
      type: "FeatureCollection",
      features: filteredDistrictFeatures,
    });

  };

  const handleTehsilSelect = (e) => {
    setSelectedTehsil(e.target.value)
    let item = tehsilList.filter((item) => item.TEHSIL === e.target.value);
    setTehsilSelectedItem(item);
    setSelectedTehsilID(item[0].ID)
    setSelectedMapData(null)




  };



  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };


  const handleStartYearChange = (e) => {
    setStartYear(e.target.value);
  };


  const handleEndYearChange = (e) => {
    setEndYear(e.target.value);
  };


  function DistrictOnEachfeature(feature, layer) {
    if (selectedMapData && selectedVariable && selectedVariable.value) {
      layer.on('mouseover', function (e) {
        // const DataItem = selectedMapData.Data.find(item => item.ID === feature.properties.ID);
        if (feature.properties && feature.properties.ID) {
          const popupContent = `
            <div>
              DISTRICT: ${feature.properties.DISTRICT}<br/>
              STATE: ${feature.properties.STATE}<br/>
              TEHSIL: ${feature.properties.TEHSIL}<br/>

            </div>
          `;
          layer.bindTooltip(popupContent, { sticky: true });
        }
        layer.openTooltip();
      });

      layer.on('mouseout', function () {
        layer.closeTooltip();
      });

    } else {
      layer.on('mouseover', function (e) {
        if (feature.properties && feature.properties.ID) {
          const popupContent = `
            <div>
              DISTRICT: ${feature.properties.DISTRICT}<br/>
              STATE: ${feature.properties.STATE}<br/>
              TEHSIL: ${feature.properties.TEHSIL}<br/>
            </div>
          `;
          layer.bindTooltip(popupContent, { sticky: true });
        }
        layer.openTooltip();
      });

      layer.on('mouseout', function () {
        layer.closeTooltip();
      });

    }

  }




  const DistrictStyle = (feature) => {
    if (feature.properties.TEHSIL === selectedTehsil && feature.properties.DISTRICT === selectedDistrict) {

      return {
        fillColor: "yellow",
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0.7
      };
    } else {

      return {
        fillColor: "black",
        weight: 2,
        opacity: 1,
        color: 'red',
        fillOpacity: 0.00001
      };
    }

  };





  return (
    <div className='dasboard_page_container'>

      <div className='main_dashboard'>
        <div className='left_panel'>
          <div className="left_panel_container">
            <div className='border border-secondary p-2 mb-2'>

              <label className=''>Select district</label>
              <select className="form-select mb-3"
                value={selectedDistrict ? selectedDistrict : ''}
                onChange={handleDistrictSelect}>
                <option value="">Select</option>
                {[...new Set(PlaceAttributes.map((item) => item.DISTRICT))].map((item, index) =>
                  <option key={index} value={item}>{item}</option>
                )}
              </select>



              <label className='mt-3'>Select taluka</label>
              <select className="form-select mb-2"
                value={selectedTehsil ? selectedTehsil : ''}
                disabled={tehsilList.length === 0}
                onChange={handleTehsilSelect} >
                <option value="">Select</option>
                {[...new Set(tehsilList.map((item) => item.TEHSIL))].map((item, index) =>
                  <option key={index} value={item}>{item}</option>
                )}
              </select>

            </div>

            <div className='border border-secondary p-2 mb-2'>


              <label className=''>Select data</label>

              <select className="form-select mb-3"

                value={selectedMapData ? selectedMapData.DataValue : ''}
                onChange={handleSelectMapData}
                disabled={tehsilSelectedItem.length === 0}
              >
                <option value="">Select</option>
                {MapDatasetOptions.map((item, index) => (
                  <option key={index} value={item.DataValue}>{item.DataName}</option>
                ))}
              </select>


              <label className=''>Select parameter</label>
              <select
                className="form-select mb-3"
                value={selectedVariable ? selectedVariable.DataValue : ''}
                onChange={handleSelectVariable}

                disabled={!selectedMapData}
              >
                <option value="">Select</option>
                {selectedMapData && selectedMapData.variables.map((variable, index) => (
                  <option key={index} value={variable.value}>
                    {variable.name}
                  </option>
                ))}
              </select>

              {/* <label className=''>Select Year</label>
<select className="form-select mb-3"
  disabled={!selectedMapData | !selectedVariable}
  value={selectedYear ? selectedYear : ''}
  onChange={handleYearChange}
>
  {renderYearsOptions()}
</select> */}


            </div>


            {/* <div className='border border-secondary p-2 mb-2'>
<label className=''>Select Start Year</label>
<select className="form-select mb-3"
  disabled={tehsilSelectedItem.length === 0}
  value={startYear}
  onChange={handleStartYearChange}
>
  {renderYearsOptions()}
</select>


<label className='mt-3'>Select End Year</label>
<select className="form-select mb-2" disabled={tehsilSelectedItem.length === 0}
  value={endYear}
  onChange={handleEndYearChange}
>
  {renderYearsOptions()}
</select>
</div> */}




            <div className='panel_button'>
              <button type='button'
                disabled={!tehsilSelectedItem}
                onClick={handleShowTimeseries}>
                {showTimeseries ? "Hide Timeseries" : "Show Timeseries"}
              </button>
            </div>

          </div>




        </div>

        {/* {selectedSession && selectedYear && selectedMapData && (
          <>

            <div className='drought_details_container_mobile'>
              <div className='border border-secondary p-2'>
                <p><strong> Selected Year: </strong> {selectedYear}</p>
                <p><strong>Selected Season/Month: </strong>{selectedSession}</p>
                <p><strong>Drought Area (All India): </strong>{droughtArea} Mkm<sup>2</sup></p>
                <p><strong>Mean Intensity (All India): </strong>{droughtIntensity}</p>
              </div>
            </div>
          </>


        )} */}

        <div className='right_map_panel' >

          <MapContainer
            fullscreenControl={true}

            center={mapCenter}
            style={{ width: '100%', height: "100%", backgroundColor: 'white', border: 'none', margin: 'auto', borderRadius:"10px" }}
            zoom={setInitialMapZoom()}
            maxBounds={maxBounds}
            // maxZoom={8}
            minZoom={setInitialMapZoom()}
            keyboard={false}
            dragging={setDragging()}
            // attributionControl={false}
            // scrollWheelZoom={false}
            doubleClickZoom={false}
          >
            <SearchBar />


            {showTimeseries && tehsilSelectedItem && selectedVariable && selectedMapData && (
              <>
                {
                  selectedMapData.DataValue === "annual_data" ? (
                    <div className='time_series_container'>
                      <AnnualTimeSeriesChart
                        handleShowTimeseries={handleShowTimeseries}
                        selectedMapData={selectedMapData}
                        selectedVariable={selectedVariable}
                        selectedTehsilID={selectedTehsilID}
                        selectedDistrict={selectedDistrict}
                        selectedTehsil={selectedTehsil}
                        endYear={endYear}
                        startYear={startYear}
                      />
                    </div>

                  ) : selectedMapData.DataValue === "climatology_data" ? (
                    <div className='time_series_container'>
                      <ClimatologyTimeSeriesChart
                        handleShowTimeseries={handleShowTimeseries}
                        selectedMapData={selectedMapData}
                        selectedVariable={selectedVariable}
                        selectedTehsilID={selectedTehsilID}
                        selectedDistrict={selectedDistrict}
                        selectedTehsil={selectedTehsil}
                        endYear={endYear}
                        startYear={startYear}
                      />
                    </div>

                  ) : selectedMapData.DataValue === "extreme_condition" ? (
                    <div className='time_series_container'>
                      <ExtremesConditionsCharts
                        handleShowTimeseries={handleShowTimeseries}
                        selectedMapData={selectedMapData}
                        selectedVariable={selectedVariable}
                        selectedTehsilID={selectedTehsilID}
                        selectedDistrict={selectedDistrict}
                        selectedTehsil={selectedTehsil}
                        endYear={endYear}
                        startYear={startYear}
                      />
                    </div>

                  ) : null
                }
              </>

            )}


            {filteredIndiaDistrict ? (

              <FiltererdJsonData
                DataKey={`${filteredIndiaDistrict && filteredIndiaDistrict.features[0].properties.ID}-${selectedDistrict || ''}-${selectedTehsil || ''}-${selectedMapData ? selectedMapData.DataValue : ''}-${selectedVariable ? selectedVariable.value : ''}`}
                DistrictStyle={DistrictStyle}
                filteredIndiaDistrict={filteredIndiaDistrict}
                DistrictOnEachfeature={DistrictOnEachfeature}
                selectedTehsilID={selectedTehsilID}
              />



            ) : (
              <GeoJSON
                style={{
                  fillColor: "none",
                  weight: 2,
                  opacity: 1,
                  color: 'black',
                  fillOpacity: 1
                }}
                data={indiastates.features}
                interactive={false}
                onEachFeature={DistrictOnEachfeature}
              />

            )}



            {/* {selectedSession && selectedYear && selectedMapData && (
              <>
                <div className='drought_details_container_desktop'>
                  <p><strong> Selected Year: </strong> {selectedYear}</p>
                  <p><strong>Selected Season/Month: </strong>{selectedSession}</p>
                  <p><strong>Drought Area (All India): </strong>{droughtArea} Mkm<sup>2</sup></p>
                  <p><strong>Mean Intensity (All India): </strong>{droughtIntensity}</p>
                </div>




                <GeoJSON data={indiastates.features} style={{
                  fillColor: 'none',
                  weight: 2,
                  color: 'black',
                  interactive: false
                }} />


                <div className="legend-panel-desktop">
                  <Legend />
                </div>
              </>


            )} */}


            <BaseMap />

          </MapContainer>


          {/* <div className="legend-panel-mobile">
            <Legend />
          </div> */}


          {loading && (
            <div className='map_layer_loader_container_desktop'>
              <div className="map_loader_container">
                <span className="map_loader"></span>
              </div>

            </div>

          )}

        </div>


        {loading && (
          <div className='map_layer_loader_container_mobile'>
            <div className="map_loader_container">
              <span className="map_loader"></span>
            </div>

          </div>

        )}


      </div>

    </div>
  )
}

export default Dashboard