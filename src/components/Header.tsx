import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="navbar">
      <div className="flex-1">
        <a className="text-xl btn btn-outline btn-primary">DaisyUI</a>
      </div>
      <Navbar />
    </header>
  );
}
