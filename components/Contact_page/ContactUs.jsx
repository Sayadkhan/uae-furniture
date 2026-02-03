"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

const ContactUs = () => {
  return (
    <div className="pt-[50px]">
      <div className="container">
        <div className="w-full xl:w-[75%] mx-auto">
          <div className="mx-auto lg:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {/* -----------map-contact----------            */}
            <div className="rounded-lg overflow-hidden shadow-lg lg:col-span-2 ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.481427!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265d0f1a2d7f1%3A0x35cfa3c2f9b5c0a!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v16932123123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            {/* -----------------contact-address------------ */}
            <div className="flex flex-col gap-6">             
              <div className="flex items-start gap-4 p-6 border rounded-lg shadow-sm">
                <div className="bg-brown-600 text-red-100 p-3 rounded bg-[#000]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-600">Toll-Free: 0803 - 080 - 3081</p>
                  <p className="text-gray-600">Fax: 0803 - 080 - 3082</p>
                </div>
              </div>          
              <div className="flex items-start gap-4 p-6 border rounded-lg shadow-sm">
                <div className="bg-brown-600 text-white p-3 rounded bg-[#000]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-600">mail@example.com</p>
                  <p className="text-gray-600">support@example.com</p>
                </div>
              </div>            
              <div className="flex items-start gap-4 p-6 border rounded-lg shadow-sm">
                <div className="bg-brown-600 text-white p-3 rounded bg-[#000]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-600">
                    No: 58 A, East Madison Street, <br />
                    Baltimore, MD, USA 4508
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs