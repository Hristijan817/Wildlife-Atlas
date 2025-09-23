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
    { name: "Мапа", to: "/map", icon: "🗺️" },
    ...(!user ? [{ name: "Најави се", to: "/login", icon: "🔐" }] : []),
    ...(user?.role === "admin" ? [{ name: "Админ", to: "/admin", icon: "⚙️" }] : []),
  ];

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Enhanced backdrop blur with gradient */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/90 to-white/85 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5" />
        
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-cyan-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link
  to="/"
  className="group relative flex items-center gap-3 px-2 py-2 mr-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
>
  <div className="text-3xl group-hover:rotate-12 transition-transform duration-300">🌿</div>
  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent tracking-tight">
    Animal Explorer
  </span>
  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</Link>


            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {links.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 ${
                      active
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-white/60 hover:to-gray-50/80 hover:shadow-md hover:text-emerald-700 backdrop-blur-sm"
                    }`}
                  >
                    <span className={`text-base transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {link.icon}
                    </span>
                    <span className="font-semibold">{link.name}</span>
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                    )}
                    
                    {/* Hover glow effect */}
                    {!active && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </Link>
                );
              })}

              {/* Theme Toggle with enhanced styling */}
              <div className="ml-4 p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <ThemeToggle />
              </div>

              {/* Admin Logout Button */}
              {user?.role === "admin" && (
                <div className="ml-2 flex items-center gap-3">
                  {/* User indicator */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">Admin</span>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={onLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Одјави се
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu */}
            <div className="lg:hidden flex items-center gap-3">
              {/* User indicator for mobile */}
              {user?.role === "admin" && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-medium text-indigo-700">Admin</span>
                </div>
              )}

              <div className="p-2 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/50">
                <ThemeToggle />
              </div>

              <Sheet>
                <SheetTrigger className="p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <Menu className="w-5 h-5 text-gray-700" />
                </SheetTrigger>
                
                <SheetContent 
                  side="right" 
                  className="w-80 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl border-l border-white/20 shadow-2xl"
                >
                  {/* Mobile menu background pattern */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-cyan-300/10 rounded-full blur-2xl" />
                  </div>

                  <div className="relative">
                    {/* Mobile menu header */}
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                      <div className="text-2xl">🌿</div>
                      <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Animal Explorer
                      </span>
                    </div>

                    <nav className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                        Навигација
                      </p>
                      
                      {links.map((link) => {
                        const active = isActive(link.to);
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className={`group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                              active
                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                                : "text-gray-700 hover:bg-gradient-to-r hover:from-white/60 hover:to-gray-50/80 hover:shadow-md hover:text-emerald-700"
                            }`}
                          >
                            <span className={`text-lg transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                              {link.icon}
                            </span>
                            <span className="font-semibold">{link.name}</span>
                            
                            {active && (
                              <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm" />
                            )}
                          </Link>
                        );
                      })}

                      {/* Mobile logout */}
                      {user?.role === "admin" && (
                        <div className="pt-6 mt-6 border-t border-gray-200">
                          <Button
                            onClick={onLogout}
                            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 rounded-xl font-semibold border-0 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
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

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-20" />
    </>
  );
}