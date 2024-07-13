import React, { useState } from "react";
import hero_img from "../assets/hero.png"
import hero_img1 from "../assets/hero1.svg"
import hero_img2 from "../assets/hero2.svg"
import { Link } from "react-router-dom";

const Hero = () => {

  return (
<div className="bg-white mt-2 border-b-2">
  <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-2 lg:pt-2">
    
    {/* Hero 1 */}
    <div className="border border-gray-300 p-4 m-4 rounded-lg shadow-lg grid lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12 bg-teal-800">
      <div className="lg:mt-0 lg:col-span-5 lg:flex items-center justify-center">
        <img src={hero_img1} alt="heroimage" className="h-72 md:h-auto lg:h-full w-full object-cover rounded-lg" />
      </div>
      <div className="mr-auto place-self-center lg:col-span-7">
        <h1 className="max-w-2xl mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl xl:text-4xl text-white">
          Create a MCQ's
        </h1>
        <p className="max-w-2xl mb-6 font-light text-white lg:mb-8 md:text-lg lg:text-xl">
          Gives the text, generate your own MCQ's.
        </p>
        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 justify-center">
          <Link to='/create-mcq' className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white border border-gray-200 rounded-lg sm:w-auto hover:bg-green-800 focus:ring-4 focus:ring-gray-100">
            Create MCQ's
            <i className="fa-solid fa-right-long ms-2" />
          </Link>
        </div>
      </div>
    </div>
    
    {/* Hero 2 */}
    <div className="border border-gray-300 p-4 m-4 rounded-lg shadow-lg grid lg:gap-8 xl:gap-0 lg:py-8 lg:grid-cols-12 bg-teal-800">
      <div className="lg:mt-0 lg:col-span-5 lg:flex items-center justify-center">
        <img src={hero_img2} alt="heroimage" className="h-72 md:h-auto lg:h-full w-full object-cover rounded-lg" />
      </div>
      <div className="mr-auto place-self-center lg:col-span-7">
        <h1 className="max-w-2xl mb-4 text-xl font-extrabold leading-none tracking-tight md:text-2xl xl:text-3xl text-white">
        Generate AI  MCQ's.
        </h1>
        <p className="max-w-2xl mb-6 font-light text-white lg:mb-8 md:text-lg lg:text-xl">
          Generate a MCQ's for any Subject with Metaviz AI MCQ's 
        </p>
        <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4 justify-center">
          <Link to="/generate-mcq" className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white border border-gray-200 rounded-lg sm:w-auto hover:bg-green-800 focus:ring-4 focus:ring-gray-100">
            Generate MCQ's
            <i className="fa-solid fa-right-long ms-2" />
          </Link>
        </div>
      </div>
    </div>
    
  </div>
</div>









  );
};

export default Hero;
