import React from 'react';
import Plot from 'react-plotly.js';
import { IoMdClose } from "react-icons/io";
import { yearsArray } from '../helpers/functions.jsx';
import { useTranslation } from 'react-i18next';

const ExtremesConditionsCharts = ({ handleShowTimeseries, selectedDistrict, selectedTehsil, selectedMapData, selectedTehsilID, selectedVariable, startYear, endYear }) => {

    const filteredData = selectedMapData.Data.find(item => item.ID === selectedTehsilID);
    const { t } = useTranslation();

    // const startYearIndex = parseInt(startYear, 10);
    // const endYearIndex = parseInt(endYear, 10);

    // const years = yearsArray.slice(startYearIndex, endYearIndex + 1);
    // const data = filteredData[selectedVariable.value].slice(startYearIndex, endYearIndex + 1);


    // const seriesData = [{
    //     name: "Frequency",
    //     data: data
    // }];


    const plotData = [{
        x: yearsArray,
        y: filteredData[selectedVariable.value],
        type: 'bar', 
        name: "Frequency"
    }];


    return (
        <>
            <div className='timeseries_heading'>
                <h4>
                {t(`location.${selectedDistrict}`)} - {t(`location.${selectedTehsil}`)}<br />
                    {/* {selectedVariable.name} ({selectedVariable.unit}) */}
                </h4>

                <button className='chart_close_btn' onClick={handleShowTimeseries}><IoMdClose /></button>
            </div>

            <Plot
                data={plotData}
                
                layout={{
                    xaxis: {
                        title: 'Years',
                    },
                    title: `${selectedVariable.value === "pcp" ? "Frequency of extreme precipitation (exceeding 95th percentile rainy days threshold)" : selectedVariable.value === "temp" ? "Frequency of extreme temperature (exceeding 95th percentile threshold of temperature for March-May)":null}`,
                    yaxis: {
                        title: "Frequency"
                    },
                    margin: {
                        l: 50,
                        r: 50,
                        b: 100,
                        t: -20,
                        pad: 4
                    },
                    // autosize: false
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

export default ExtremesConditionsCharts; 