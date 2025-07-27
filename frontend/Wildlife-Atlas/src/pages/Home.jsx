import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, PawPrint, Filter, RefreshCcw, HelpCircle, Scale3D } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import ParticleBackground from "@/components/ParticleBackground";
import NavBar from "@/components/NavBar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden bg-gradient-to-b from-green-50 to-blue-100 text-gray-800">
      {/* Particle background */}
       <NavBar />
      <ParticleBackground />

      {/* Floating animal icons */}
      <img
        src="/src/assets/images/butterfly.png"
        alt="Butterfly"
        className="absolute top-1/4 left-6 w-12 animate-bounce opacity-80 z-20"
      />
      <img
        src="/src/assets/images/fish.png"
        alt="Fish"
        className="absolute bottom-10 right-6 w-12 animate-pulse opacity-80 z-20"
      />

      {/* Hero Section */}
      <section
  className="h-screen bg-cover bg-center bg-no-repeat relative z-10"
  style={{ backgroundImage: "url('/src/assets/images/hero-nature.png')" }}
>
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center text-center text-white px-6 pt-[10vh] md:pt-[8vh]">
    {/* Headline & Subtext */}
    <AnimateIn delay={0.1}>
      <h1 className="text-5xl font-extrabold mb-3 drop-shadow-xl tracking-tight">
        Добредојдовте во Светот на Животните
      </h1>
    </AnimateIn>
    <AnimateIn delay={0.2}>
      <p className="text-xl max-w-2xl text-gray-200 drop-shadow-md mb-6">
        Истражи. Научи. Зачуди се. Откриј ја дивината со еден клик.
      </p>
    </AnimateIn>

    {/* Call to Action */}
    <AnimateIn delay={0.3}>
      <Button className="text-lg px-6 py-4 flex items-center gap-2 mb-8" onClick={() => navigate("/kopno")}>
        <PawPrint className="w-5 h-5" /> Започни со истражување
      </Button>
    </AnimateIn>

    {/* Centered Hero Icon/Image */}
    <AnimateIn delay={0.4}>
      <img
        src="/src/assets/images/planet.png"
        alt="Hero Illustration"
        className="w-68 md:w-86 lg:w-98 mx-auto drop-shadow-lg"
      />
    </AnimateIn>
  </div>
</section>


      {/* Habitat Cards */}
  {/* Decorative Background Images */}
 <section className="relative z-10 py-24">
  {/* 3-Column Background Images Behind Cards */}
  <div className="absolute inset-0 flex w-full h-full -z-10">
    <div className="w-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/bg-land.jpg')" }}></div>
    <div className="w-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/bg-air.jpg')" }}></div>
    <div className="w-1/3 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/bg-water.jpg')" }}></div>
  </div>

  {/* Foreground Cards in a 3-Column Grid */}
  <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
    {[
      {
        title: "Копно",
        path: "/kopno",
        desc: "Животни од шумите, пустините и планините.",
        img: "land.png",
        ring: "ring-green-400",
      },
      {
        title: "Воздух",
        path: "/vozduh",
        desc: "Птици и летачи во сините небеса.",
        img: "air.png",
        ring: "ring-sky-400",
      },
      {
        title: "Вода",
        path: "/voda",
        desc: "Морски и речни суштества.",
        img: "water.png",
        ring: "ring-blue-400",
      },
    ].map((habitat, i) => (
      <AnimateIn key={i} delay={i * 0.2}>
        <div className="flex justify-center">
          <Card
            className={`w-full max-w-[300px] text-center hover:scale-[1.03] transition-all duration-300 cursor-pointer ring-2 ${habitat.ring} bg-white/50 backdrop-blur-sm shadow-md`}
            onClick={() => navigate(habitat.path)}
          >
            <CardContent className="p-6">
              <img src={`/src/assets/images/${habitat.img}`} alt={habitat.title} className="w-20 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold">{habitat.title}</h2>
              <p className="text-gray-700">{habitat.desc}</p>
            </CardContent>
          </Card>
        </div>
      </AnimateIn>
    ))}
  </div>
</section>



      {/* Featured Animal Section */}
      <section className="bg-white/90 py-20 text-center px-4">
        <AnimateIn delay={0.2}>
          <h2 className="text-3xl font-bold mb-2">🌟 Избрано Животно</h2>
          <p className="text-gray-600 mb-4">Случаен избор на животно за денешен момент на инспирација.</p>
          <Button variant="outline" onClick={() => navigate("/random")}>
            <Sparkles className="w-4 h-4 mr-2" /> Види животно
          </Button>
        </AnimateIn>
      </section>

      {/* 🌍 Interactive Map Section */}
      <AnimateIn delay={0.2}>
        <section className="py-20 text-center bg-white/80">
          <h2 className="text-3xl font-bold mb-2">🌍 Истражи по Континенти</h2>
          <p className="text-gray-600 mb-4">Кликни на регион за да видиш локални видови.</p>
          <div className="max-w-4xl mx-auto">
            <img
              src="/assets/images/world-map.png"
              alt="World map"
              className="mx-auto rounded-lg shadow hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => navigate("/map")}
            />
          </div>
        </section>
      </AnimateIn>

      {/* Parallax Quote Section */}
      <section
        className="h-[400px] bg-fixed bg-cover bg-center flex items-center justify-center text-white text-2xl font-bold text-center px-6"
        style={{ backgroundImage: "url('/src/assets/images/parallax.png')" }}
      >
        <p className="drop-shadow-md">
          „Природата зборува — ние треба да научиме да слушаме.“
        </p>
      </section>

      {/* Interactive Tools */}
      <section className="text-center mt-20 px-4">
        <AnimateIn delay={0.2}>
          <h2 className="text-3xl font-bold mb-6">Интерактивни Алатки</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/filter")} className="flex items-center gap-2">
              <Filter className="w-4 h-4" /> Филтрирај Животни
            </Button>
            <Button variant="outline" onClick={() => navigate("/random")} className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Животно на денот
            </Button>
            <Button variant="outline" onClick={() => navigate("/quiz")} className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Квиз
            </Button>
            <Button variant="outline" onClick={() => navigate("/compare")} className="flex items-center gap-2">
              <Scale3D className="w-4 h-4" /> Спореди Животни
            </Button>
          </div>
        </AnimateIn>
      </section>

      {/* Footer */}
      <footer className="text-center mt-20 py-6 text-gray-500 text-sm">
        © 2025 Развиено од Христијан Јанкуловски • MERN Stack Дипломска Работа
      </footer>
    </div>
  );
}
