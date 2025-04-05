import React from "react";

export default function HomeFeatures(){
    return (<>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          <div className="text-center">
            <span className="text-4xl text-blue-600">📋</span>
            <h3 className="text-xl font-bold mt-4">Automated Attendance</h3>
            <p>Mark attendance with just a click.</p>
          </div>
          <div className="text-center">
            <span className="text-4xl text-blue-600">📊</span>
            <h3 className="text-xl font-bold mt-4">Real-Time Reports</h3>
            <p>Generate daily, weekly, and monthly reports instantly.</p>
          </div>
          <div className="text-center">
            <span className="text-4xl text-blue-600">🔒</span>
            <h3 className="text-xl font-bold mt-4">Role-Based Access</h3>
            <p>Secure access for admins, teachers, and students.</p>
          </div>
          <div className="text-center">
            <span className="text-4xl text-blue-600">🔔</span>
            <h3 className="text-xl font-bold mt-4">Notifications</h3>
            <p>Send alerts to parents when students are absent.</p>
          </div>
        </div>
      </section>
    </>)
}
