import React from 'react';
import Plot from 'react-plotly.js';
import { IoMdClose } from "react-icons/io";
import { yearsArray } from '../helpers/functions.jsx';
import { useTranslation } from 'react-i18next';

const TimeSeriesCharts = ({ handleShowTimeseries, selectedDistrict, selectedTehsil, selectedMapData, selectedTehsilID,  selectedVariable ,startYear ,endYear}) => {

    const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);
    const { t } = useTranslation();

    // const startYearIndex = parseInt(startYear, 10);
    // const endYearIndex = parseInt(endYear, 10);

    // const years = yearsArray.slice(startYearIndex, endYearIndex + 1);
    // const data1 = filteredData[selectedVariable.value].slice(startYearIndex, endYearIndex + 1);

    // const data2 = filteredData[`${selectedVariable.value}_trendline`].slice(startYearIndex, endYearIndex + 1);


    // const seriesData = [
    //     {
    //         name: selectedVariable.name,
    //         data: data1,
    //         type: 'bar' 
    //     },
    //     {
    //         name: 'Trendline', 
    //         data: data2,
    //         type: 'line', 

    //     }
    // ];




    return (
        <>
            <div className='timeseries_heading'>
                <h4>
                {t(`location.${selectedDistrict}`)} - {t(`location.${selectedTehsil}`)}<br/>
                </h4>
                <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
            </div>

            <Plot
                data={[
                    {
                        x: yearsArray,
                        y: filteredData[selectedVariable.value],
                        type: 'bar',
                        name: selectedVariable.name
                    },
                    {
                        x: yearsArray,
                        y: filteredData[`${selectedVariable.value}_trendline`],
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: 'red' }, 
                        name: "Trendline"
                    }
                ]}
                layout={{
                    title: `${selectedVariable.name} (${selectedVariable.unit}) (Change: ${filteredData[`${selectedVariable.value}_change`]} %, h: ${filteredData[`${selectedVariable.value}_h`]})`,
                    xaxis: { title: 'Years' },
                    yaxis: {
                        title: `${selectedVariable.name} (${selectedVariable.unit})`,
                        side: 'left'
                    },
                    yaxis2: {
                        title: 'Trendline',
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
                    scrollZoom: true
                }}
                style={{ width: "100%", height: "400px" }}
            />
        </>
    );
};

export default TimeSeriesCharts; 