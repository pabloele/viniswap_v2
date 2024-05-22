import Header from "../components/Header";

const HomeLayout = ({ children }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#2D242F]">
      <Header />
      {children}
    </div>
  );
};

export default HomeLayout;
