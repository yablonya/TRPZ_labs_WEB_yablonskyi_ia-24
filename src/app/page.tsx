import HomePage from "@/components/pages/home-page/HomePage";
import {Metadata} from "next";

export const metadata: Metadata = {
	title: "Home",
}

const Home = () => {
  return (
	  <HomePage/>
  );
}

export default Home;
