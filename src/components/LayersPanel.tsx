import React, { FunctionComponent } from 'react'
import {App} from "../app";
import {Box, Paper} from "@mui/material";

interface LayersPanelProps {
  app: App
}

const LayersPanel : FunctionComponent<LayersPanelProps> = (props) => {
    return (
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none"
      }}>
        <Paper variant='outlined' sx={{
          p: 2,
          pointerEvents: "all"
        }}>

        </Paper>
      </Box>

    )
}

export default LayersPanel;