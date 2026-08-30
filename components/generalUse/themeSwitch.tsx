// components/generalUse/themeSwitch.tsx
//
// Selector de tema claro/oscuro (usa next-themes). Se usa en el pie de
// página (components/navigation/footer.js). El bloque comentado de
// abajo es el patrón típico para evitar el "flash" de tema incorrecto
// durante la hidratación -- se dejó documentado por si se necesita
// reactivar, pero hoy no está en uso.

"use client";

import { useTheme } from "next-themes";
import { SunIcon } from "@heroicons/react/24/outline";

const ThemeSwitch = () => {
  //   const [mounted, setMounted] = useState(false);
  //   const { resolvedTheme, setTheme } = useTheme();
  const { theme, setTheme } = useTheme();
  // useEffect only runs on the client, so now we can safely show the UI
  //   useEffect(() => {
  //     setMounted(true);
  //   }, []);

  //   if (!mounted) {
  //     return null;
  //   }

  return (
    <div className="inline-flex items-center">
      <SunIcon className="w-4 h-4 mr-2" />
      <select
        name="themeSwitch"
        value={theme}
        onChange={e => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

export default ThemeSwitch;