"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import HomeLayout from "../layout/HomeLayout";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/swap");
  }, [router]);

  return <HomeLayout />;
}
