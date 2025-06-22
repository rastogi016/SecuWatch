import React, { useState } from "react";

const AuthForm = ({ type, onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">{type === "login" ? "Login" : "Sign Up"}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-3 px-4 py-2 rounded bg-gray-700 text-white"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-gray-700 text-white"
        required
      />
      <button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded">
        {type === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
