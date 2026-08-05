import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import  AuthenticationProvider  from "../context/AuthenticationContext";

const MainLayout=()=> {
  return (
    <div>
      <AuthenticationProvider>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
      </AuthenticationProvider>
      <Footer />
    </div>
  );
}

export default  MainLayout;