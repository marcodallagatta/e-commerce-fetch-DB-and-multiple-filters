import React from "react";
import DB from "./miista-export.json";
import { Searchbox } from "./Searchbox";

function App() {
  return (
    <div className="App">
      <Searchbox DBListings={DB.data.allContentfulProductPage.edges as any} />
    </div>
  );
}

export default App;
