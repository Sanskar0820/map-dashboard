import React from 'react';
import Plot from 'react-plotly.js';
import { IoMdClose } from "react-icons/io";
import { daysInYear } from '../helpers/functions.jsx';

const ClimatologyTimeSeriesChart = ({ handleShowTimeseries, selectedDistrict, selectedTehsil, selectedMapData, selectedTehsilID, selectedVariable }) => {
    const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);

    return (
        <>
            <div className='timeseries_heading'>
                <h4>
                    {selectedDistrict} - {selectedTehsil}<br />
                    {/* {selectedVariable.name} ({selectedVariable.unit}) */}
                </h4>
                <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
            </div>

            <Plot
                data={[
                    {
                        x: daysInYear,
                        y: filteredData[selectedVariable.value],
                        type: 'scatter', 
                        mode: 'lines', 
                        name: "Climatology"
                    },
                    {
                        x: daysInYear,
                        y: filteredData[`${selectedVariable.value}_SD`],
                        type: 'bar', 
                        marker:{
                            color:"purple"
                        },
                        opacity: 0.3,
                        name: 'SD',
                    },
                    {
                        x: daysInYear,
                        y: filteredData[`daily_${selectedVariable.value}_2024`],
                        type: 'scatter', 
                        mode: 'lines', 
                        marker:{
                            color:"red"

                        },
                        name: '2024',
                    }
                
                ]}



                layout={{
                    xaxis: {
                        title: 'Days',
                    },
                    title: `${selectedVariable.name} (${selectedVariable.unit})`,
                    yaxis: {
                        title: `${selectedVariable.name} (${selectedVariable.unit})`,
                        side: 'left'
                    },
                    yaxis2: {
                        title: '2024 data',
                        side: 'right',
                        overlaying: 'y',  // Ensure the second axis overlays the first
                        showgrid: false
                    },
                    legend: {
                        orientation: 'h', // Horizontal layout for the legend
                        x: 0.5, // Center aligned horizontally
                        xanchor: 'center', // Anchor point is the center
                        y: -0.3, // Position the legend below the x-axis
                        yanchor: 'top' // Anchor point is the top of the legend box
                    },

                    margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 },
                    showlegend: true,
                }}
                config={{
                    displayModeBar: false,
                    scrollZoom: false
                }}
                style={{ width: "100%", height: "400px" }}
            />
        </>
    );
};

export default ClimatologyTimeSeriesChart; 