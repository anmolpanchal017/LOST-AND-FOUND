// import { useContext } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { auth } from "../../firebase/firebaseConfig";
// import { signOut } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/");
//   };

//   return (
//     <nav className="flex justify-between items-center px-6 py-3 bg-blue-600 text-white">
//       <h1 className="font-bold text-lg">Lost & Found</h1>

//       {user && (
//         <div className="flex items-center gap-4">
//           <span>{user.displayName}</span>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 px-3 py-1 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        Lost & Found
      </h1>

      <div className="flex gap-4 items-center">
        <button onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button onClick={() => navigate("/my-claims")}>
          My Claims
        </button>

        <button onClick={() => navigate("/notifications")}>
          Notifications
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
