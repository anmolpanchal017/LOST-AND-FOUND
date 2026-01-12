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

// import RoutesConfig from "./routes";
// import { SearchProvider } from "../context/SearchContext";
// import { Toaster } from "react-hot-toast";


// export default function App() {
//   return (
    
//     <SearchProvider>
//       <RoutesConfig />
//     </SearchProvider>
//   );
// }



import RoutesConfig from "./routes";
import { SearchProvider } from "../context/SearchContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      {/* 1. Toaster (Notifications ke liye) */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #374151",
          },
        }}
      />

      {/* 2. Providers & Routes */}
      <SearchProvider>
        <RoutesConfig />
      </SearchProvider>
    </>
  );
}