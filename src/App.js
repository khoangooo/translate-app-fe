import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import CustomTable from "./CustomTable";
import "./App.scss";

function App() {

  return (
    <div className="container">
      <CssBaseline />
      <Container fixed >
        <CustomTable/>
      </Container>
    </div>
  );
}

export default App;
