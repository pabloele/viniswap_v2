import Header from "../components/Header";
import NavBar from "../components/Navbar";

const HomeLayout = ({ children }) => {
  return (
    <div className="min-w-screen min-h-screen flex flex-col bg-[#2D242F]">
      <div className="flex items-center justify-center mb-8">
        <Header />
      </div>

      <div className="flex  justify-center  mt-16 px-2 md:px-16">
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
