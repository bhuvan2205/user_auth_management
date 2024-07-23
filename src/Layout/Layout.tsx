import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="container flex flex-col mx-auto min-h-dvh bg-base-300">
      <Header />
      <main className="flex-1 flex-grow bg-base-200">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
