import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
    const nav=useNavigate()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState('')

    const handleLogin = async(e:Event)=>{
        e.preventDefault()
        try{
            const {data}=await axios.post('http://localhost:4242/admin/login',{email,password},{
                withCredentials:true,
            })
            console.log('came')
            localStorage.setItem('adminX',data.message)
            nav('/admin/dash')
        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login Container */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">AttendancePro</h1>
          <p className="text-gray-600">Admin Login – Secure Access</p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-4 text-gray-600">
        © 2023 AttendancePro. All rights reserved.
      </footer>
    </div>
    )
}
