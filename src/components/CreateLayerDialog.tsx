import React, {FunctionComponent, useState} from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    TextField
} from "@mui/material";
import DataSource from "../lib/layers/DataSource";
import LayerManager from "../lib/layers/LayerManager";
import Color from "../lib/layers/Color";
import GeoJsonLayer, {GeoJsonLayerOptions} from "../lib/layers/GeoJsonLayer";
import {nanoid} from "nanoid";

interface CreateLayerDialogProps {
    dataSource: DataSource,
    layerManager: LayerManager,
    onCreated: (layer: GeoJsonLayer) => any
}

const CreateLayerDialog : FunctionComponent<CreateLayerDialogProps & DialogProps> = (props) => {

    const { dataSource, layerManager, onCreated, onClose, ...rest } = props;

    const [name, setName] = useState("")

    const handleChangeName = (event: any) => {
        setName(event.target.value)
    }

    const handleCancel = (event: any) => {
        if (onClose) {
            onClose(event, "backdropClick")
        }
    }

    const handleConfirm = async () => {
        const colorA = Color.Random();
        const colorB = Color.Random();
        const colorC = Color.Random();

        const data: GeoJsonLayerOptions = {
            stroke: true,
            stroke_color: colorA,
            stroke_width: 2,
            stroke_opacity: 0.8,

            fill: false,
            fill_opacity: 0.8,
            fill_color: colorB,

            line_color: colorA,
            line_opacity: 0.8,
            line: true,

            point: true,
            point_color: colorC,
            point_opacity: 0.8,
        }

        const id = nanoid();
        const layer = new GeoJsonLayer(id, name, dataSource, layerManager.app.map, data)
        await layerManager.addLayer(layer)
        onCreated(layer);
    }

    return (
        <Dialog maxWidth="sm" fullWidth onClose={onClose} {...rest} >
            <DialogTitle>New layer</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label='Name'
                    value={name}
                    onChange={handleChangeName}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleConfirm} color="primary" disabled={name === ""}>Add</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateLayerDialog;