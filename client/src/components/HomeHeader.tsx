import React from "react";
import{Link} from "react-router-dom";

export default function HomeHeader() {
  return (
    <>
      <header className="flex justify-between items-center p-6 bg-white shadow-md">
        <div className="text-xl font-bold text-blue-600">Attendify</div>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </Link>
      </header>
    </>
  );
}
