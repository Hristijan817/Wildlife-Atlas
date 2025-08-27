import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/auth";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: "Дома", to: "/" },
    { name: "Копно", to: "/kopno" },
    { name: "Воздух", to: "/vozduh" },
    { name: "Вода", to: "/voda" },
    { name: "Квиз", to: "/quiz" },
    { name: "Мапа", to: "/map" },
    { name: "Најави се", to: "/login" },
    ...(user?.role === "admin" ? [{ name: "Админ", to: "/admin" }] : []),
  ];

  const onLogout = () => {
    logout();
    navigate("/"); // back to home after logout
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 shadow-sm border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-green-600 tracking-tight hover:text-green-700 transition"
        >
          🌿 Animal Explorer
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? "text-green-600 underline underline-offset-4"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Theme Toggle */}
          <div className="ml-2">
            <ThemeToggle />
          </div>

          {/* Admin-only Logout */}
          {user?.role === "admin" && (
            <Button
              size="sm"
              variant="outline"
              className="ml-2"
              onClick={onLogout}
              title="Одјави се"
            >
              Одјави се
            </Button>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger>
              <Menu className="w-6 h-6 text-gray-700" />
            </SheetTrigger>
            <SheetContent side="left" className="bg-white">
              <nav className="flex flex-col gap-5 mt-6 px-4">
                <p className="text-sm text-gray-400">Навигација</p>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-lg font-medium ${
                      isActive(link.to)
                        ? "text-green-600"
                        : "text-gray-700 hover:text-green-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Admin-only Logout (mobile) */}
                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={onLogout}
                    title="Одјави се"
                  >
                    Одјави се
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
