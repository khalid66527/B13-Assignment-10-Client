import AboutArtHall from "./components/AboutArtHall";
import AllArtCollections from "./components/AllArtCollections";
import ArtCatagory from "./components/ArtCatagory";
import HeroSection from "./components/HeroSection";
import TopArtist from "./components/TopArtist";

export default function Home() {
  return (
    <div className="">
      <HeroSection></HeroSection>
      <TopArtist></TopArtist>
      <ArtCatagory></ArtCatagory>
      <AllArtCollections></AllArtCollections>
      <AboutArtHall></AboutArtHall>
    </div>
  );
}
