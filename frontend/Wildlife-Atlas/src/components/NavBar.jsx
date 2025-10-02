import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, Home, Mountain, Bird, Waves, HelpCircle, Scale, Lock, Settings } from "lucide-react";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  // Icon mapping for better visual consistency
  const iconMap = {
    "Дома": <Home className="w-4 h-4" />,
    "Копно": <Mountain className="w-4 h-4" />,
    "Воздух": <Bird className="w-4 h-4" />,
    "Вода": <Waves className="w-4 h-4" />,
    "Квиз": <HelpCircle className="w-4 h-4" />,
    "Спореди": <Scale className="w-4 h-4" />,
    "Најави се": <Lock className="w-4 h-4" />,
    "Админ": <Settings className="w-4 h-4" />,
  };

  const links = useMemo(() => [
    { name: "Дома", to: "/" },
    { name: "Копно", to: "/kopno" },
    { name: "Воздух", to: "/vozduh" },
    { name: "Вода", to: "/voda" },
    { name: "Квиз", to: "/quiz" },
    { name: "Спореди", to: "/compare" },
    ...(!user ? [{ name: "Најави се", to: "/login" }] : []),
    ...(user?.role === "admin" ? [{ name: "Админ", to: "/admin" }] : []),
  ], [user]);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Enhanced glassmorphism background */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg" />

        {/* Subtle animated gradient accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-green-400/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-0 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-400/10 to-cyan-400/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Enhanced Logo */}
            <Link
              to="/"
              className="group relative flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100 border border-emerald-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative text-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300">
                  🌿
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent tracking-tight leading-none">
                  Wildlife Atlas
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Explore Nature
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Improved spacing and hover states */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-auto">
              {links.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                        : "text-gray-700 hover:text-emerald-700 hover:bg-white/80 hover:shadow-md"
                    }`}
                  >
                    {/* Animated background for active state */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                    )}
                    
                    <span className={`relative z-10 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                      {iconMap[link.name]}
                    </span>
                    <span className="relative z-10 whitespace-nowrap">{link.name}</span>
                    
                    {/* Hover indicator */}
                    {!active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                    )}
                  </Link>
                );
              })}

              {/* Enhanced Logout Button */}
              {user?.role === "admin" && (
                <Button
                  size="sm"
                  onClick={onLogout}
                  className="ml-4 px-4 py-2.5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:from-red-600 hover:via-rose-600 hover:to-pink-600 rounded-xl font-semibold text-sm border-0 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xl:inline">Одјави се</span>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button - Enhanced */}
            <div className="lg:hidden flex items-center">
              <Sheet>
                <SheetTrigger className="p-3 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-md hover:shadow-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 active:scale-95">
                  <Menu className="w-5 h-5 text-gray-700" />
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-80 bg-gradient-to-br from-white via-gray-50/95 to-emerald-50/30 backdrop-blur-2xl border-l border-gray-200/50 shadow-2xl"
                >
                  {/* Enhanced mobile menu background effects */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-300/20 to-green-300/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-gradient-to-br from-blue-300/20 to-cyan-300/10 rounded-full blur-2xl" />
                  </div>

                  <div className="relative h-full flex flex-col">
                    {/* Mobile header */}
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200/60">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg blur opacity-30" />
                        <div className="relative text-2xl">🌿</div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent leading-none">
                          Wildlife Atlas
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Mobile Menu
                        </span>
                      </div>
                    </div>

                    {/* Mobile navigation links */}
                    <nav className="flex-1 space-y-2 overflow-y-auto">
                      {links.map((link) => {
                        const active = isActive(link.to);
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                              active
                                ? "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                                : "text-gray-700 hover:text-emerald-700 hover:bg-white/80 hover:shadow-md active:scale-95"
                            }`}
                          >
                            {active && (
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-xl blur opacity-40" />
                            )}
                            
                            <span className={`relative z-10 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                              {iconMap[link.name]}
                            </span>
                            <span className="relative z-10 flex-1">{link.name}</span>
                            
                            {active && (
                              <div className="relative z-10 w-2 h-2 bg-white rounded-full animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile logout button */}
                    {user?.role === "admin" && (
                      <div className="pt-4 mt-4 border-t border-gray-200/60">
                        <Button
                          onClick={onLogout}
                          className="w-full px-4 py-3.5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white hover:from-red-600 hover:via-rose-600 hover:to-pink-600 rounded-xl font-semibold text-sm border-0 shadow-lg shadow-red-500/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95"
                        >
                          <LogOut className="w-4 h-4" />
                          Одјави се
                        </Button>
                      </div>
                    )}

                    {/* Mobile footer info */}
                    <div className="pt-4 mt-4 border-t border-gray-200/60">
                      <p className="text-xs text-gray-500 text-center">
                        Wildlife Atlas © 2025
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[72px]" />
    </>
  );
}