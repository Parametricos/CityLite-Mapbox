import React, {FunctionComponent, useEffect, useState} from 'react'
import {Box, Button, Stack, TextField} from "@mui/material";
import {App} from "../app";

interface EditModelsProps {
  app: App
}

const EditModels : FunctionComponent<EditModelsProps> = (props) => {

  const { app } = props;

  const [lat, setLat] = useState((app.coordinates as any).lat);
  const [lng, setLng] = useState((app.coordinates as any).lng);

  const [sampleLoaded, setSampleLoaded] = useState(false);

  useEffect(() => {
    app.coordinates = {
      lat,
      lng
    }
  }, [app, lat, lng]);

  const handleChange = (event: any) => {
    app?.loadIfcFromFile(event.target.files[0]);
  }

  const handleLoadSample = () => {
    setSampleLoaded(true)
    app?.loadIfc(new URL('/models/House Project.ifc'));
  }

    return (
      <Box p={2}>
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
          {/*<Button disabled={sampleLoaded} onClick={handleLoadSample}>Load sample building</Button>*/}
        </Stack>
      </Box>

    )
}

export default EditModels;