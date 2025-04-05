import React from "react";
import { Link } from "react-router-dom";

export default function HomeHero(){
    return (<>
     <section className="text-center py-20 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold mb-4">Effortless Attendance Tracking</h1>
        <p className="text-lg mb-8">Streamline attendance management with our intuitive software.</p>
        <div className="space-x-4">
          <Link
            to="/admin/dashboard"
            className="bg-white text-blue-600 px-6 py-2 rounded"
          >
            Login as Admin
          </Link>
          <Link
            to="/teacher/dashboard"
            className="bg-white text-blue-600 px-6 py-2 rounded"
          >
            Login as Teacher
          </Link>
          <Link
            to="/student/dashboard"
            className="bg-white text-blue-600 px-6 py-2 rounded"
          >
            Login as Student
          </Link>
        </div>
      </section>
    </>)
}
