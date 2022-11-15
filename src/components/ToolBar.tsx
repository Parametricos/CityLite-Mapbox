import React, { FunctionComponent } from 'react'
import {Box, Grid, IconButton, Tooltip} from "@mui/material";
import LayersIcon from '@mui/icons-material/Layers';
import StorageIcon from '@mui/icons-material/Storage';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FlatPaper from "./FlatPaper";
import {App} from "../app";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import SatelliteIcon from '@mui/icons-material/Satellite';

interface ToolBarProps {
    app: App
}

const ToolBar : FunctionComponent<ToolBarProps> = (props) => {

    const { app } = props;

    return (
        <Box
            component={FlatPaper}
            p={1}
            px={2}
            position="fixed"
            bottom={10}
            left="50%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
                transform: "translate(-50%)",
                // opacity: 0.75
            }}
        >
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Tooltip title="Layers">
                         <span>
                            <IconButton onClick={() => app.tab = 0} size="large">
                                <LayersIcon/>
                            </IconButton>
                         </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Data sources">
                         <span>
                            <IconButton onClick={() => app.dataSourcesOpen = true} size="large">
                                <StorageIcon/>
                            </IconButton>
                         </span>
                    </Tooltip>
                </Grid>
                {/*<Grid item>*/}
                {/*    <Tooltip title="3D Models">*/}
                {/*         <span>*/}
                {/*            <IconButton*/}
                {/*                onClick={() => {*/}
                {/*                    app.modelsOpen = true;*/}
                {/*                    app.tab = 1;*/}
                {/*                }}*/}
                {/*                size="large">*/}
                {/*                <ApartmentIcon/>*/}
                {/*            </IconButton>*/}
                {/*         </span>*/}
                {/*    </Tooltip>*/}
                {/*</Grid>*/}
                <Grid item>
                    <Tooltip title="IoT Devices">
                         <span>
                            <IconButton disabled size="large">
                                <DeviceHubIcon/>
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip title="Satellites">
                         <span>
                            <IconButton disabled size="large">
                                <SatelliteIcon/>
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ToolBar;