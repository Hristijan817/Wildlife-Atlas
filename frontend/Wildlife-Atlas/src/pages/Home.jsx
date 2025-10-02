// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PawPrint,
  HelpCircle,
  Scale3D,
  Sparkles,
  RefreshCcw,
  Filter,
  ArrowRight,
  Globe,
  Mountain,
  Waves,
  Bird,
  Zap,
  Users,
  BookOpen,
  Info,
  Star,
} from "lucide-react";
import AnimateIn from "@/components/AnimateIn";
import ParticleBackground from "@/components/ParticleBackground";
import AnimalCard from "@/components/AnimalCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [randomAnimal, setRandomAnimal] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/animals`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnimals(data);
      })
      .catch((err) => console.error("Error fetching animals:", err));
  }, []);

  const revealRandomAnimal = () => {
    if (animals.length > 0) {
      const random = animals[Math.floor(Math.random() * animals.length)];
      setRandomAnimal(random);
    }
  };

  // Stats calculations
  const totalAnimals = animals.length;
  const featuredCount = animals.filter((a) => a.featured !== false).length;
  const habitatsCovered = new Set(animals.map((a) => a.habitat)).size;

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 text-gray-800">
      {/* Enhanced Particle Background */}
      <ParticleBackground />

      {/* MODERN HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/src/assets/images/hero-nature.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <AnimateIn delay={0.1} from="bottom" distance={40}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Откриј ги
              <span className="block bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                Тајните на Природата
              </span>
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2} from="bottom" distance={40}>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200 leading-relaxed">
              Интерактивно истражување на светот на животните преку{' '}
              <span className="text-green-300 font-semibold">3D модели</span>,{' '}
              <span className="text-blue-300 font-semibold">квизови</span> и{' '}
              <span className="text-purple-300 font-semibold">виртуелни патувања</span>.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ENHANCED STATS SECTION */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
        
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn from="bottom" distance={30}>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Нашата Колекција
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Откриј неверојатна дивина со нашата сеопфатна база на податоци
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                number: totalAnimals, 
                text: "Вкупно Животни", 
                icon: <Info className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              { 
                number: featuredCount, 
                text: "Приказани Животни", 
                icon: <Star className="w-8 h-8" />,
                color: "from-amber-500 to-orange-500"
              },
              { 
                number: habitatsCovered, 
                text: "Опфатени Живеалишта", 
                icon: <Globe className="w-8 h-8" />,
                color: "from-emerald-500 to-teal-500"
              },
            ].map((stat, i) => (
              <AnimateIn key={i} delay={i * 0.1} from="bottom" distance={40}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300" />
                  <Card className="text-center p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white mb-6`}>
                        {stat.icon}
                      </div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                        {stat.number}
                      </div>
                      <p className="text-lg text-gray-600 font-medium">
                        {stat.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED HABITATS SECTION */}
      <section className="py-20 relative z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn from="bottom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Истражи по Живеалишта
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Откриј уникатни екосистеми и нивните жители
              </p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Копно",
                path: "/kopno",
                desc: "Шуми, пустини, планини и савани - дом на разновидни копнени суштества.",
                img: "land.png",
                icon: <Mountain className="w-8 h-8" />,
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50"
              },
              {
                title: "Воздух",
                path: "/vozduh",
                desc: "Птици, инсекти и летачи кои го исполнуваат небото со живот.",
                img: "air.png",
                icon: <Bird className="w-8 h-8" />,
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50"
              },
              {
                title: "Вода",
                path: "/voda",
                desc: "Морски длабини, реки и езера полни со магични водени суштества.",
                img: "water.png",
                icon: <Waves className="w-8 h-8" />,
                gradient: "from-purple-500 to-blue-500",
                bgGradient: "from-purple-50 to-blue-50"
              },
            ].map((habitat, i) => (
              <AnimateIn key={i} delay={i * 0.2} from="bottom" distance={50}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(habitat.path)}
                >
                  <Card className={`h-full bg-gradient-to-br ${habitat.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden`}>
                    <CardContent className="p-0">
                      <div className={`p-8 bg-gradient-to-r ${habitat.gradient} text-white`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-white/20 rounded-2xl">
                            {habitat.icon}
                          </div>
                          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{habitat.title}</h3>
                      </div>
                      
                      <div className="p-8">
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <img
                              src={`/src/assets/images/${habitat.img}`}
                              alt={habitat.title}
                              className="w-24 h-24 object-contain drop-shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent rounded-full" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-center leading-relaxed">
                          {habitat.desc}
                        </p>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full mt-6 group-hover:bg-white/50 transition-colors"
                        >
                          <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent font-semibold">
                            Истражи
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ANIMAL - ENHANCED WITH RANDOM ANIMAL FEATURE */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Left Content */}
            <motion.div 
              className="text-center"
              animate={{
                x: randomAnimal ? -50 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AnimateIn from="bottom">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Животно во Фокус</span>
                </div>
              </AnimateIn>

              <AnimateIn from="bottom" delay={0.1}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Случајно <span className="text-transparent bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text">Откритие</span>
                </h2>
              </AnimateIn>

              <AnimateIn from="bottom" delay={0.2}>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Секој ден откривај ново животно со интересни факти и уникатни одлики
                </p>
              </AnimateIn>

              <AnimateIn from="bottom" delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    className="px-8 py-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-0 shadow-lg shadow-green-500/25"
                    onClick={revealRandomAnimal}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Откриј Животно
                  </Button>
                  
                  
                </div>
              </AnimateIn>
            </motion.div>

            {/* Right Side - Random Animal Display */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{
                opacity: randomAnimal ? 1 : 0,
                x: randomAnimal ? 0 : 100,
                scale: randomAnimal ? 1 : 0.8,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {randomAnimal && (
                <div className="w-full max-w-md">
                  <AnimalCard animal={randomAnimal} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENHANCED TOOLS SECTION */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateIn from="bottom">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Интерактивни Алатки
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Забавувај се додека учиш со нашите иновативни функции
              </p>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Филтрирај Животни",
                path: "/filter",
                icon: <Filter className="w-6 h-6" />,
                desc: "Најди животни според различни критериуми",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Животно на Денот",
                path: "/random",
                icon: <RefreshCcw className="w-6 h-6" />,
                desc: "Случајно избрано животно секој ден",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Забавни Квизови",
                path: "/quiz",
                icon: <HelpCircle className="w-6 h-6" />,
                desc: "Тестирај го твоето знаење",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Спореди Животни",
                path: "/compare",
                icon: <Scale3D className="w-6 h-6" />,
                desc: "Види ги разликите помеѓу видови",
                gradient: "from-orange-500 to-red-500"
              },
            ].map((tool, i) => (
              <AnimateIn key={i} delay={i * 0.1} from="bottom" distance={40}>
                <motion.div whileHover={{ scale: 1.05 }} className="h-full">
                  <Card
                    onClick={() => navigate(tool.path)}
                    className="h-full bg-white border-0 shadow-lg hover:shadow-2xl cursor-pointer group transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tool.gradient} text-white mb-4 w-fit`}>
                        {tool.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900">
                        {tool.title}
                      </h3>
                      <p className="text-gray-600 text-sm flex-grow">
                        {tool.desc}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 group-hover:text-gray-600">
                          Отвори
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* INSPIRATIONAL QUOTE */}
      <section className="relative py-32 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimateIn from="bottom" distance={50}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Инспирација</span>
            </div>
          </AnimateIn>

          <AnimateIn from="bottom" delay={0.1}>
            <blockquote className="text-3xl md:text-4xl font-light leading-relaxed mb-8">
              „Природата не е место за посета. Таа е{' '}
              <span className="text-transparent bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text font-semibold">
                нашиот дом
              </span>
              ."
            </blockquote>
          </AnimateIn>

          <AnimateIn from="bottom" delay={0.2}>
            <p className="text-xl text-gray-300 italic">
              - Закони на природата
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <footer className="bg-gradient-to-r from-gray-900 to-slate-900 text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center">
          <AnimateIn from="bottom">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Истражи ја Дивината
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Интерактивна платформа за откривање на прекрасниот свет на животните 
                преку современ веб-искуство
              </p>
            </div>
          </AnimateIn>

          <AnimateIn from="bottom" delay={0.1}>
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              {['Животни', 'Квизови', 'Галерија', 'За нас'].map((item, i) => (
                <a
                  key={i}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn from="bottom" delay={0.2}>
            <div className="flex justify-center gap-6 mb-8">
              {[
                { name: 'GitHub', url: 'https://github.com', icon: '💻' },
                { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
                { name: 'Email', url: 'mailto:contact@example.com', icon: '✉️' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn from="bottom" delay={0.3}>
            <div className="pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                © 2025 Развиено со ❤️ од Христијан Јанкуловски • MERN Stack Дипломска Работа
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Посветено на зачувување и едукација за убавината на природата
              </p>
            </div>
          </AnimateIn>
        </div>
      </footer>
    </div>
  );
}