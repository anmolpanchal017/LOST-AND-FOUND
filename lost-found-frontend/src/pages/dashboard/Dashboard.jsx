import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LostForm from "../lost/LostForm";
import FoundForm from "../found/FoundForm";
import FinderClaims from "../claims/FinderClaims";
import { LayoutDashboard, PlusCircle, Search, ClipboardCheck } from "lucide-react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col pt-24">
      <Navbar />
            
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* HEADER SECTION */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider">Your Workspace</span>
          </div>
          <h1 className="text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Welcome, {user?.displayName || "User"}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            What would you like to do today? Manage your lost and found reports in one place.
          </p>
        </div>

        {/* QUICK ACTIONS GRID */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <PlusCircle className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* LOST ITEM CARD */}
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-slate-100 flex flex-col h-full ring-1 ring-slate-100 hover:ring-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 shadow-sm shadow-orange-100">
                  <Search size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Report Lost Item</h3>
                  <p className="text-slate-500 text-sm">Fill in details about the item you've misplaced.</p>
                </div>
              </div>
              <div className="flex-grow">
                <LostForm />
              </div>
            </div>

            {/* FOUND ITEM CARD */}
            <div className="bg-white rounded-3xl p-8 border border-white shadow-xl shadow-slate-100 flex flex-col h-full ring-1 ring-slate-100 hover:ring-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-green-100 rounded-2xl text-green-600 shadow-sm shadow-green-100">
                  <ClipboardCheck size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Report Found Item</h3>
                  <p className="text-slate-500 text-sm">Help someone find their lost belongings.</p>
                </div>
              </div>
              <div className="flex-grow">
                <FoundForm />
              </div>
            </div>
          </div>
        </section>

        {/* RECENT CLAIMS SECTION */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ml-0 p-0">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <ClipboardCheck size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your Recent Claims</h2>
          </div>
          <div className="bg-white rounded-3xl p-1 border border-white shadow-xl shadow-slate-100 ring-1 ring-slate-100 overflow-hidden">
            <FinderClaims />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}