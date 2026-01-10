import Navbar from "../../components/common/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LostForm from "../lost/LostForm";
import FoundForm from "../found/FoundForm";
import FoundList from "../found/FoundList";
import FinderClaims from "../claims/FinderClaims";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <div className="p-6 space-y-10">
        <h2 className="text-2xl font-bold">
          Welcome, {user.displayName} 👋
        </h2>

        {/* FORMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <LostForm />
          <FoundForm />
        </div>

        {/* FOUND ITEMS */}
        <FoundList />

        {/* FINDER CLAIMS */}
        <FinderClaims />
      </div>
    </>
  );
}
