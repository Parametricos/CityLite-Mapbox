import {useEffect, useRef, useState} from "react";
import {App} from '../src/app';
import EditLayers from "../src/components/EditLayers";
import DataSourcesDialog from "../src/components/DataSourcesDialog";
import ToolBar from "../src/components/ToolBar";
import {Box, Tab, Tabs} from "@mui/material";
import FlatPaper from "../src/components/FlatPaper";
import {NextPage} from "next";
import {observer} from "mobx-react-lite";
import EditModels from "../src/components/EditModels";

const Home: NextPage = observer(() => {
  const containerRef = useRef(null);
  const [app, setApp] = useState<App>();

  useEffect(() => {
    const app = new App(containerRef.current!);
    setApp(app)
  }, []);



  return (
    <>

      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />

      {app && (
        <>
          <Box
            component={FlatPaper}
            position="absolute"
            left={10}
            top={10}
            width={360}
            minHeight={600}
            p={2}
            display="flex"
            flexDirection="column"
          >
            <Tabs
              variant="scrollable"
              textColor="primary"
              value={app.tab}
              onChange={(e, v) => app.tab = v}
            >
              <Tab label="Layers"/>
              <Tab label="Models"/>
            </Tabs>
            {app.tab === 0 && (
              <EditLayers manager={app.layer_manager}/>
            )}
            {app.tab === 1 && (
              <EditModels app={app} />
            )}
          </Box>
          <DataSourcesDialog
            layerManager={app.layer_manager}
            open={app.dataSourcesOpen}
            onClose={() => app.dataSourcesOpen = false}
            onLayerCreated={() => app.dataSourcesOpen = false}
          />
          <ToolBar app={app}/>
        </>
      )}
    </>
  )
});

export default Home;