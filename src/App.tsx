import { Searchbox } from "./Searchbox";
import DB from "../miista-export.json";

function App() {
  return (
    <div className="App">
      <Searchbox DBListings={DB.data.allContentfulProductPage.edges} />
    </div>
  );
}

export default App;
