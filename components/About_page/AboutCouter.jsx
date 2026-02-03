"use client";
import Image from "next/image";
import CountUp from "react-countup";
import CounterImg from "../../public/about-1.png"

const AboutCouter = () => {
    const stats = [
        { value: 18, suffix: "+", label: "years" },
        { value: 200, suffix: "+", label: "Employee" },
        { value: 85, suffix: "%", label: "Page views" },
        { value: 27, suffix: "+", label: "Awards" },
    ];
  return (
    <div className="w-full h-[350px] relative">
        <Image className="w-full h-full object-cover" src={CounterImg} alt="" />
        <div className="flex items-center absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.7)]">
            <div className="container"> 
                <div className="relative container grid grid-cols-2 md:grid-cols-4 gap-8 text-center ">
                    {stats.map((item, index) => (
                    <div key={index} className="">
                        <h2 className="text-4xl font-bold text-[#fff]">
                        <CountUp start={0} end={item.value} duration={3} suffix={item.suffix} />
                        </h2>
                        <p className="text-lg mt-2 text-[#fff]">{item.label}</p>
                    </div>
                    ))}
                </div>         
            </div>
        </div>
    </div>
  )
}

export default AboutCouter