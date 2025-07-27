import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaChartBar, FaWindows, FaLinux, FaBars, FaTimes } from "react-icons/fa";
import { SiApache } from "react-icons/si";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger menu for mobile */}
      <div className="md:hidden flex items-start p-4 mt-3">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Static Sidebar for md and up */}
      <div className="hidden md:flex w-52 flex-col h-screen">
        <Logo />
        <NavItems />
      </div>

      {/* Sliding Sidebar for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-95 z-10 bg-[#030712]">
          <div className="w-60 h-full pr-4 flex flex-col">
            {/* Close button inside sidebar */}
            <div className="flex justify-end md:hidden">
              <button onClick={() => setIsOpen(false)} className="text-white text-xl mt-4">
                <FaTimes />
              </button>
            </div>
            <Logo />
            <NavItems onClick={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
const Logo = () => (
  <div className="h-20 flex items-center justify-center ml-4">
    <img src="/secuwatch-logo-white.png" alt="SecWatchLogo" className="h-14 w-auto ml-4 " />
    <h1 className="text-3xl font-bold mr-4">SecuWatch</h1>
  </div>
);

const NavItems = ({ onClick }) => (
  <div className="flex-1 p-2 space-y-4">
    <SidebarItem icon={<FaTachometerAlt />} label="Dashboard" to="/" onClick={onClick} />
    <SidebarItem icon={<FaChartBar />} label="Analytics" to="/analytics" onClick={onClick} />
    <SidebarItem icon={<SiApache />} label="Apache" to="/apache" onClick={onClick} />
    <SidebarItem icon={<FaWindows />} label="Windows" to="/windows" onClick={onClick} />
    <SidebarItem icon={<FaLinux />} label="Linux" to="/linux" onClick={onClick} />
  </div>
);

const SidebarItem = ({ icon, label, to, onClick }) => (
  <Link to={to} onClick={onClick}>
    <div className="m-2 p-4 text-gray-400 flex items-center space-x-3 border border-transparent hover:text-white hover:border-white rounded-lg transition-all duration-300">
      <span>{icon}</span>
      <span className="hover:text-white px-1 font-dm_sans">{label}</span>
    </div>
  </Link>
);

export default Sidebar;
