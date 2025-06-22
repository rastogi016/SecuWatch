import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const data = await login(username, password);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setError(""); // clear any previous error
        onLogin(); 
      } else {
        setError("Login failed. Invalid token.");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
      setUsername("");
      setPassword("");
    }
  };
  const newUserHandler = ()=>{
    navigate("/signup")
  }
  return (
    <div className="gradient-bg-login min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center px-10 py-12">
      <img src="../../public/secuwatch-white.png" alt="SecuWatchLogo" className="mb-28 md:hidden max-h-44" />
        <form onSubmit={handleSubmit} className="p-16 border-2 border-white rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Login to Your Account</h2>
          {error && <p className="text-yellow-400">{error}</p>}
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
              Login
            </button>
            <button className="bg-emerald-600 text-white font-semibold px-4 py-2 ml-4 rounded-md hover:bg-emerald-700 mt-2" onClick={newUserHandler}>
              NewUser ?
            </button> 
          </div>
        </form>
      </div>
      <div className="hidden md:flex w-1/3 bg-[#bfe1d3] flex-col items-center justify-center text-center p-10">
        <img src="/public/secuwatch-green.png" alt="SecuWatch.png" className="max-h-60"/>
        <p className="text-xl text-emerald-600 font-bold tracking-wide">
          Watch. Detect. Secure.
        </p>
      </div>
    </div>
  );
};

export default Login;
