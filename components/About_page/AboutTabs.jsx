"use client";
import { useState } from "react";

const tabs = [
  {
    title: "Development",
    content: `Contrary to popular belief, Lorem Ipsum is not simply random text.
    It has roots in a piece of classical Latin literature from 45 BC, making it
    over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney
    College in Virginia, looked up one of the more obscure Latin words, consectetur,
    from a Lorem Ipsum passage, and going through the cites of the word in
    classical literature, discovered the undoubtable source...`,
  },
  {
    title: "Qualified team",
    content: `Our team consists of highly skilled professionals with years of
    experience across industries. We believe in collaboration, innovation, and
    delivering the best results for our clients.`,
  },
  {
    title: "Strategy",
    content: `We develop strategies tailored to our client’s needs. Our approach is
    data-driven, ensuring measurable outcomes while maintaining creativity and
    flexibility.`,
  },
];

const AboutTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-10"> 
    <div className="container">
      <div className="flex flex-wrap justify-center gap-4 ">
        {tabs.map((tab, index) => (
          <button key={index} onClick={() => setActiveTab(index)} className={`px-4 py-2 font-medium border-b-2 transition ${ activeTab === index ?
            "border-black text-black" : "border-transparent text-gray-500 hover:text-black" }`}> {tab.title} </button>))}
      </div>
      <div className="border p-6 mt-6 rounded bg-white shadow-sm max-w-7xl mx-auto">
        <p className="text-gray-700 leading-relaxed ">
          {tabs[activeTab].content}
        </p>
      </div>
    </div>   
    </div>
  );
};

export default AboutTabs;