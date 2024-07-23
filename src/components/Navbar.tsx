import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../data/users";
import useAuthContext from "../hooks/useAuthContext";

export default function Navbar() {
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogout({
    onSuccess: () => {
      setToken("");
      navigate("/");
      localStorage.removeItem("refreshToken");
    }
  });

  const handleLogout = () => {
    mutateAsync();
  };

  return (
    <nav className="flex-none">
      <ul className="items-center px-1 menu menu-horizontal">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button
                disabled={isPending}
                className="h-8 py-0 min-h-8 btn btn-outline btn-error"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
