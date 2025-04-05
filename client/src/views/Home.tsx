import React from "react";
import HomeHeader from "../components/HomeHeader";
import HomeHero from "../components/HomeHero";
import HomeFeatures from "../components/HomeFeatures";
import HomeTestimonials from "../components/HomeTestimonials";
import HomeFooter from "../components/HomeFooter";

export default function Home(){
    return (<>
        <div className="min-h-screen bg-gray-100 font-sans">
            <HomeHeader/>
            <HomeHero/>
            <HomeFeatures/>
            <HomeTestimonials/>
            <HomeFooter/>
        </div>
    </>)
}
