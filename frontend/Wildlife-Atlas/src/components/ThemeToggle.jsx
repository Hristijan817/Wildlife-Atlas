import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-white border border-gray-300 text-sm px-2 py-1 rounded-md shadow-sm outline-none hover:border-green-500 transition"
    >
      <option value="light">🌞 Light</option>
      <option value="dark">🌚 Dark</option>
      <option value="nature">🍃 Nature</option>
    </select>
  );
}