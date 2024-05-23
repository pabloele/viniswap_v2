import Header from "../components/Header";

const HomeLayout = ({ children }) => {
  return (
    <div className="min-w-screen min-h-screen flex flex-col bg-[#2D242F]">
      <div className="flex items-center justify-center mb-8">
        <Header />
      </div>
      <div className="min-h-[10rem] "></div>
      <div className="flex  justify-center  mt-16 px-5">{children}</div>
    </div>
  );
};

export default HomeLayout;
