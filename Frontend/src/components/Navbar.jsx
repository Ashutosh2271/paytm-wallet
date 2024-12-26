import React, { useContext, useState } from "react";
import logo from "../assets/logo.svg";
import loginImg from "../assets/loginimg.svg";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Context";
import { CreditCardIcon, HomeIcon, MenuIcon, UserIcon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenu = () => setMenu(!menu);
  const handleNavigate = () => navigate("/login");

  const closeMenu = () => setMenu(false);

  return (
    <nav className="px-5 py-2 flex justify-between items-center relative shadow-md">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden" onClick={handleMenu}>
        <MenuIcon className="cursor-pointer" aria-label="Toggle menu" />
      </div>

      {menu && (
  <div className="absolute top-12 left-0 w-3/4 bg-white rounded-lg shadow-lg p-6 z-50 animate-slide-in">
    <ul className="flex flex-col gap-4">
      <Link to="/" onClick={closeMenu}>
        <li className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded">
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </li>
      </Link>
    
      <Link to="/transaction" onClick={closeMenu}>
        <li className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-4 py-2 rounded">
          <CreditCardIcon className="h-5 w-5" />
          <span>Transaction</span>
        </li>
      </Link>
    </ul>
  </div>
)}


      {/* Logo */}
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className="h-10" />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-9">
        <Link to="/">
          <li className="list-none hover:underline">Home</li>
        </Link>
        <Link to="/transaction">
          <li className="list-none hover:underline">Transaction</li>
        </Link>
      </div>

    
      {user ? (
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleNavigate}
          className="bg-[#00baf2] font-semibold hover:bg-blue-950 pl-4 py-[2px]  rounded-3xl text-white flex items-center gap-1"
        >
          <span>Sign up</span>
          <img src={loginImg} alt="Sign up"  />
        </button>
      )}
    </nav>
  );
};

export default Navbar;
