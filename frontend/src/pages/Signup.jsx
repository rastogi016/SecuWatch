import React, { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Signup = ({ onSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signup(username, password);
      setMsg(data.msg || "Signup successful. You can now login.");
      navigate("/login");
    } catch {
      setMsg("Signup failed.");
    }
  };

  const existingUserHandler = ()=>{
    navigate("/login")
  }
  return (
    <div className="gradient-bg-login min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center px-10 py-12">
      <img src="/secuwatch-white.png" alt="SecuWatchLogo" className="mb-28 md:hidden max-h-44" />
        <form onSubmit={handleSubmit} className="p-16 border-2 border-white rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Create a Account</h2>
          {msg && <p className="text-yellow-400">{msg}</p>}
          <div className="w-full">
            <div className="mb-4">
              <input
                className="mt-2 px-4 py-3 text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-200"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className=" px-4 py-3 text-black rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-200"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-center">
            <button className="bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-emerald-700 m-auto" type="submit">
              SignUp
            </button>
            <button className="bg-emerald-600 text-white font-semibold px-4 py-2 ml-4 rounded-md hover:bg-emerald-700 mt-2" onClick={existingUserHandler}>
              Already a User ?
            </button> 
          </div>
        </form>
      </div>
      <div className="hidden md:flex w-1/3 bg-[#bfe1d3] flex-col items-center justify-center text-center p-10">
        <img src="/secuwatch-green.png" alt="SecuWatch.png" className="max-h-60"/>
        <p className="text-xl text-emerald-600 font-bold tracking-wide">
          Watch. Detect. Secure.
        </p>
      </div>
    </div>
  );
};

export default Signup;
