import React, {FunctionComponent, useEffect, useState} from 'react'
import {Stack, TextField} from "@mui/material";
import {App} from "../app";

interface EditModelsProps {
  app: App
}

const EditModels : FunctionComponent<EditModelsProps> = (props) => {

  const { app } = props;

  const [lat, setLat] = useState((app.coordinates as any).lat);
  const [lng, setLng] = useState((app.coordinates as any).lng);

  useEffect(() => {
    app.coordinates = {
      lat,
      lng
    }
  }, [app, lat, lng]);

  const handleChange = (event: any) => {
    app?.loadIfcFromFile(event.target.files[0]);
  }

    return (
        <Stack spacing={2}>
          <input type='file' onChange={handleChange} />
          <TextField
            label='Latitude'
            type='number'
            value={lat}
            inputProps={{
              step: 0.00001
            }}
            onChange={(event) => {
              setLat(Number(event.target.value))
            }}
          />
          <TextField
            label='Longitude'
            type='number'
            value={lng}
            inputProps={{
              step: 0.00001
            }}
            onChange={(event) => {
              setLng(Number(event.target.value))
            }}
          />
        </Stack>
    )
}

export default EditModels;