import Image from "next/image";
import React from "react";
import PaymentImg from "../public/payment.png";

const SubFooter = () => {
  return (
    <footer className="bg-black py-6">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          © 2025 Furnista_Default
        </p>
        <Image
          src={PaymentImg}
          alt="Payment Methods"
          width={220}
          height={30}
          className="object-contain"
          priority
        />
      </div>
    </footer>
  );
};

export default SubFooter;
