'use client'
import { CheckSquare, MessageCircle, User } from "lucide-react";

const aboutFeatures = [
  {
    icon: <CheckSquare className="w-10 h-10 mx-auto text-black" />,
    title: "Submit a task",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 mx-auto text-black" />,
    title: "Send message",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus.",
  },
  {
    icon: <User className="w-10 h-10 mx-auto text-black" />,
    title: "Trusted experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus.",
  },
];

const AboutFeatures = () => {
  return (
    <div>
        <div className="container">
            <div className="mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
                {aboutFeatures.map((item, index) => (
                    <div
                    key={index}
                    className="bg-white shadow-md rounded-lg py-8 px-[70px] text-center hover:shadow-lg transition"
                    >
                    {item.icon}
                    <h3 className="mt-4 font-semibold text-[24px]">{item.title}</h3>
                    <p className="text-gray-500 mt-2 text-[18px]">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default AboutFeatures