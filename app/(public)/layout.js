import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NavbarMiddle from "@/components/NavbarMiddle";
import TopNavbar from "@/components/TopNavbar";

export default function PublicLayout({ children }) {
  return (
    <div>
      <TopNavbar />
      <NavbarMiddle />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
