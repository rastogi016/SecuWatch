import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcPrivacy } from "react-icons/fc";
import { VscThreeBars } from "react-icons/vsc";

const Footer = () => {
  return (
    <div className="w-full bg-[#030712] text-gray-300 py-4">
      <div className="flex flex-col md:flex-row justify-center items-center text-sm">
        <span className="mb-2 md:mb-0 md:mr-10">
          © {new Date().getFullYear()} <strong>SecuWatch<sub>v1.1</sub></strong> by <strong>ThreatSage </strong>
        </span>
        <div className="flex space-x-6 items-center">
          <a
            href="https://github.com/rastogi016/SecuWatch"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-400 flex items-center gap-1"
          >
            <FaGithub />
            GitHub
          </a>
          <a
            href="/privacy"
            target="__blank"
            className="hover:underline hover:text-blue-400 flex items-center gap-1"
          >
            <FcPrivacy />
            Privacy
          </a>
          <a
            href="/terms"
            target="__blank"
            className="hover:underline hover:text-blue-400 flex items-center gap-1"
          >
            <VscThreeBars />
            Terms
          </a>
        </div>
      </div>
    </div>
  );
};


export default Footer;
