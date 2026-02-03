"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

export default function WhatsAppFloating() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["whatsapp-number"],
    queryFn: async () => {
      const res = await fetch("/api/whatsapp");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || isError || !data?.number) return null;

  const number = data.number; 

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366",
        color: "#fff",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
    >
      <FaWhatsapp />
    </a>
  );
}
