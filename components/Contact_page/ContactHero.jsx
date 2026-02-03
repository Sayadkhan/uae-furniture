import Image from 'next/image'
import ContactHeroImg from "../../public/contact.jpg"
import Link from 'next/link'

const ContactHero = () => {
  return (
    <div className='pt-[60px]'>
        <div className="container">
            <div className="w-full h-[250px] md:h-[300px] lg:h-[500px] rounded-lg overflow-hidden relative">
                <Image className='w-full h-full object-cover' src={ContactHeroImg} alt='ContactHeroImg' />
                <div className="top-0 absolute left-0 bg-[rgba(0,0,0,0.6)] w-full h-full flex flex-col justify-center items-center">
                    <h2 className='text-[35px] text-[#fff] font-medium'>Contact Us</h2>
                    <div className="flex gap-1 mt-1 text-[#fff]">
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/contactus">Contact</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ContactHero