import Image from 'next/image'
import PersentFur1 from "../../public/per-1.png"
import PersentFur2 from "../../public/per-2.png"

const PersentFerniture = () => {
  return (
    <div className='pb-[60px]'>
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="">
                    <Image src={PersentFur1} alt='' />
                </div>
                <div className="">
                    <Image src={PersentFur2} alt='' />
                </div>
            </div>
        </div>
    </div>
  )
}

export default PersentFerniture