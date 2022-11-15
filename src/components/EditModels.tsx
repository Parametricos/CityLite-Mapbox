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
          <TextField label='lat' type='number' value={lat} onChange={(event) => {
            setLat(Number(event.target.value))
          }}></TextField>
          <TextField label='lng' type='number' value={lng} onChange={(event) => {
            setLng(Number(event.target.value))
          }}></TextField>
        </Stack>
    )
}

export default EditModels;