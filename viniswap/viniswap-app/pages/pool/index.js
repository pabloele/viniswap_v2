import { useEffect, useState } from "react";
import Pool from "../../components/Pool";
import HomeLayout from "../../layout/HomeLayout";

export default function Index() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <HomeLayout>
          <Pool />
        </HomeLayout>
      )}
    </>
  );
}
