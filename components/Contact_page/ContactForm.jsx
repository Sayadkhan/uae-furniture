"use client";

const ContactForm = () => {  
  return (
    <div>
        <div className="container mx-auto lg:px-6 py-12">
            <h2 className="text-[30px] font-semibold text-brown-600 mb-6">
                Contact Form
            </h2>
            <form className="space-y-6">          
                <div className="grid md:grid-cols-3 gap-4">
                <input type="text" name="name" placeholder="Name" className="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-brown-600"/>
                <input type="email" name="email" placeholder="Email" className="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-brown-600"/>
                <input type="text" name="phone" placeholder="Phone number" className="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-brown-600" />
                </div>         
                <textarea name="message" placeholder="Comment" rows={6} className="w-full border p-3 focus:outline-none focus:ring-2 focus:ring-brown-600"></textarea>          
                <div className="flex justify-center">
                <button type="submit" className="bg-brown-600 text-white text-[20px] px-[50px] lg:px-[150px] py-3 rounded-md font-medium hover:bg-brown-700 transition bg-[#000]"> Send </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ContactForm