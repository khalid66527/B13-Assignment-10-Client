import AboutArtHall from "./components/AboutArtHall";
import ArtCatagory from "./components/ArtCatagory";
import HeroSection from "./components/HeroSection";
import TopArtist from "./components/TopArtist";

export default function Home() {
  return (
    <div className="">
      <HeroSection></HeroSection>
      <TopArtist></TopArtist>
      <ArtCatagory></ArtCatagory>
      <AboutArtHall></AboutArtHall>
    </div>
  );
}
