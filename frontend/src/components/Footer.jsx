import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcPrivacy } from "react-icons/fc";
import { VscThreeBars } from "react-icons/vsc";

const Footer = () => {
  return (
    <div className="w-full absolute bottom-0 h-20 bg-brand-te_black text-gray-300 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center h-full">
        <span className="mb-2 md:mb-0 text-sm">
          © {new Date().getFullYear()} <strong>SecuWatch<sub>v1.0</sub></strong> by <strong>ThreatSage</strong>, All rights reserved.
        </span>
        <div className="flex space-x-6 text-sm items-center">
          <a
            href="https://github.com/YOUR_GITHUB"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-white flex items-center gap-1"
          >
            <FaGithub />
            GitHub
          </a>
          <a href="/privacy" className="hover:underline hover:text-white flex items-center gap-1">
            <FcPrivacy />
            Privacy
          </a>
          <a href="/terms" className="hover:underline hover:text-white flex items-center gap-1">
            <VscThreeBars />
            Terms
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
