import React, { useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import * as L from 'leaflet';

const FiltererdJsonData = ({
    DataKey,
    DistrictStyle,
    filteredIndiaDistrict,
    DistrictOnEachfeature,
    selectedTehsilID
}) => {

    const map = useMap();

    useEffect(() => {
        if (filteredIndiaDistrict.features.length > 0) {
            let bounds;
            if (selectedTehsilID) {
                const filteredTehsil = filteredIndiaDistrict.features.find(item => item.properties.ID === selectedTehsilID)
                bounds = L.geoJSON(filteredTehsil.geometry).getBounds();


            } else {
                bounds = filteredIndiaDistrict.features.reduce((acc, feature) => {
                    const featureBounds = L.geoJSON(feature.geometry).getBounds();
                    return acc.extend(featureBounds);
                }, new L.LatLngBounds());
            }

            map.flyToBounds(bounds);
        }
    }, [filteredIndiaDistrict, map,selectedTehsilID]);




    return (
        <GeoJSON
            key={DataKey}
            style={DistrictStyle}
            data={filteredIndiaDistrict.features}
            onEachFeature={DistrictOnEachfeature}
        />
    );
};

export default FiltererdJsonData;
