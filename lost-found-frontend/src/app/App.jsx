import RoutesConfig from "./routes";
import { auth } from "../firebase/firebaseConfig";

function App() {
  return (
    <div className="min-h-screen">
      <RoutesConfig />
    </div>
  );
}

export default App;