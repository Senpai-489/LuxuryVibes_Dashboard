'use client'
import Image from "next/image";
import Login from "./Components/Login";
import { CookiesProvider } from "react-cookie";

export default function Home() {
  return (  <CookiesProvider>
    <div>
      <Login/>
    </div>
    </CookiesProvider>  
  );
}
