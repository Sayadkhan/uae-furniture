import Image from 'next/image'

const PersentFerniture = () => {
  return (
    <div className='pb-[60px]'>
        <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative aspect-[4/3]">
                    <Image 
                      src="/per-1.png" 
                      alt="Furniture Promotion 1"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                </div>
                <div className="relative aspect-[4/3]">
                    <Image 
                      src="/per-2.png" 
                      alt="Furniture Promotion 2"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default PersentFerniture
