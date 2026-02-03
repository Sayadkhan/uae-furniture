import Image from 'next/image'
import AboutHeroImg from "../../public/about-1.png"

const AboutHero = () => {
  return (
    <div className='py-[60px]'>
        <div className="container">
            <div className="w-full h-[250px] md:h-[400px] lg:h-[500px] xl:h-[600px] group overflow-hidden">
                <Image className='w-full h-full object-cover group-hover:scale-[1.2] transition-all duration-300' src={AboutHeroImg} alt='' />
            </div>
        </div>
    </div>
  )
}

export default AboutHero