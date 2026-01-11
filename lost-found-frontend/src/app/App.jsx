// import RoutesConfig from "./routes";
// import { auth } from "../firebase/firebaseConfig";

// function App() {
//   return (
//     <div className="min-h-screen">
//       <RoutesConfig />
//     </div>
//   );
// }

// export default App;

import RoutesConfig from "./routes";
import { SearchProvider } from "../context/SearchContext";

export default function App() {
  return (
    <SearchProvider>
      <RoutesConfig />
    </SearchProvider>
  );
}



