import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: "Дома", to: "/", icon: "🏠" },
    { name: "Копно", to: "/kopno", icon: "🌲" },
    { name: "Воздух", to: "/vozduh", icon: "🦅" },
    { name: "Вода", to: "/voda", icon: "🐟" },
    { name: "Квиз", to: "/quiz", icon: "🧩" },
    { name: "Спореди", to: "/compare", icon: "🗺️" },
    ...(!user ? [{ name: "Најави се", to: "/login", icon: "🔐" }] : []),
    ...(user?.role === "admin" ? [{ name: "Админ", to: "/admin", icon: "⚙️" }] : []),
  ];

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Compact header with reduced height */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/95 to-white/90 backdrop-blur-lg border-b border-white/30 shadow-md" />
        
        {/* Subtle animated background elements - smaller and more subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-200/15 to-green-300/8 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-16 h-16 bg-gradient-to-br from-blue-200/15 to-cyan-300/8 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Compact Logo */}
            <Link
              to="/"
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl group-hover:rotate-12 transition-transform duration-300">🌿</div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent tracking-tight">
                Wildlife Atlas
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Desktop Navigation - more compact */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-white/70 hover:to-gray-50/90 hover:shadow-md hover:text-emerald-700 backdrop-blur-sm"
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {link.icon}
                    </span>
                    <span className="font-bold whitespace-nowrap">{link.name}</span>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                    )}
                    
                    {/* Hover glow effect */}
                    {!active && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                );
              })}

              {/* Compact Theme Toggle */}
              <div className="ml-3 p-1.5 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <ThemeToggle />
              </div>

              {/* Compact Admin Section */}
              {user?.role === "admin" && (
                <div className="ml-2 flex items-center gap-2">
                  {/* Compact User indicator */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-700">Admin</span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={onLogout}
                    className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-lg font-bold text-xs border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Одјави се
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu - more compact */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Compact mobile user indicator */}
              {user?.role === "admin" && (
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
                  <Shield className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-bold text-indigo-700">Admin</span>
                </div>
              )}

              <div className="p-1.5 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/60">
                <ThemeToggle />
              </div>

              <Sheet>
                <SheetTrigger className="p-2 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Menu className="w-5 h-5 text-gray-700" />
                </SheetTrigger>
                
                <SheetContent 
                  side="right" 
                  className="w-72 bg-gradient-to-br from-white/96 to-gray-50/96 backdrop-blur-xl border-l border-white/30 shadow-2xl"
                >
                  {/* Mobile menu background pattern */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-cyan-300/10 rounded-full blur-xl" />
                  </div>

                  <div className="relative">
                    {/* Compact mobile menu header */}
                    <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-gray-200">
                      <div className="text-xl">🌿</div>
                      <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Animal Explorer
                      </span>
                    </div>

                    <nav className="space-y-1.5">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Навигација
                      </p>
                      
                      {links.map((link) => {
                        const active = isActive(link.to);
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                              active
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                                : "text-gray-700 hover:bg-gradient-to-r hover:from-white/70 hover:to-gray-50/90 hover:shadow-md hover:text-emerald-700"
                            }`}
                          >
                            <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                              {link.icon}
                            </span>
                            <span className="font-bold">{link.name}</span>
                            
                            {active && (
                              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                            )}
                          </Link>
                        );
                      })}

                      {/* Compact mobile logout */}
                      {user?.role === "admin" && (
                        <div className="pt-4 mt-4 border-t border-gray-200">
                          <Button
                            onClick={onLogout}
                            className="w-full px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-lg font-bold text-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Одјави се
                          </Button>
                        </div>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Reduced spacer for smaller header */}
      <div className="h-16" />
    </>
  );
}