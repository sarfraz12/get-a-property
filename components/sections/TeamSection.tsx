// components/sections/TeamSection.tsx
//
// Sección "Our expert agents" de la referencia, adaptada a un equipo
// de marca (no inmobiliaria): título + subtítulo centrados y una
// grilla de avatares circulares. Cada círculo muestra la foto (o, si
// no hay foto, las iniciales sobre un círculo de color). Al pasar el
// cursor aparece un overlay oscuro con nombre, cargo, correo y
// teléfono.
//
// El equipo ahora viene de Sanity (landingPage -> fieldset
// "teamSection" -> "teamMembers", ver lib/sanity/schemas/landingPage.js
// y home.js) -- un ítem del arreglo genera un círculo. Antes se
// mostraba un equipo de EJEMPLO fijo acá mismo (8 tarjetas "Nombre
// Apellido" con círculo de iniciales "NA", que es justo lo que se veía
// en producción). Ese equipo de ejemplo ya no existe: si Sanity todavía
// no tiene ningún integrante real cargado, el componente oculta la
// sección COMPLETA en vez de mostrar el equipo de relleno (pedido
// explícito: "en todas las secciones si el contenido es nulo que no
// aparezca la sección completa en sí").
"use client";

import { useState } from "react";
import Image from "next/image";
import { cx } from "@/utils/all";
import { useInView } from "@/lib/hooks/useInView";

interface TeamMember {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  image?: string; // URL de la foto; si no hay, se usan las iniciales
}

interface TeamSectionProps {
  lang: string;
  title?: string;
  description?: string;
  team?: TeamMember[];
}

const HEADING: Record<string, { title: string; description: string }> = {
  es: {
    title: "Nuestro equipo",
    description: "Las personas detrás de cada propiedad que te ayudamos a encontrar en Panamá.",
  },
  en: {
    title: "Our team",
    description: "The people behind every property we help you find in Panama.",
  },
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function TeamMemberCard({
  member,
  index,
  isSelected,
  onToggle,
}: {
  member: TeamMember;
  index: number;
  // NUEVO (queja del cliente: "en formato mobile no se puede ver los
  // datos del team"): el overlay con nombre/cargo/correo/teléfono
  // antes SÓLO aparecía con "group-hover:opacity-100" -- en celular no
  // hay cursor/hover, así que esos datos eran literalmente imposibles
  // de ver ahí. "isSelected"/"onToggle" agregan una segunda forma de
  // mostrarlo: tocar el círculo. TeamSection (más abajo) lleva cuál
  // integrante está seleccionado -- uno solo a la vez, y "queda fijo"
  // (visible) hasta que se toca otro o el mismo de nuevo, tal como lo
  // pidió el cliente. El hover de escritorio se mantiene intacto.
  isSelected: boolean;
  onToggle: () => void;
}) {
  // Cada tarjeta se anima al entrar en pantalla, con un pequeño delay
  // escalonado según su posición (mismo recurso que RecentPostsSection).
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={cx(
        "flex flex-col items-center text-center transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isSelected}
        aria-label={`${member.name}${member.role ? `, ${member.role}` : ""}`}
        className="group relative aspect-square w-full max-w-[220px] overflow-hidden rounded-full shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
      >
        {/* Foto (o iniciales si no hay foto) */}
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-dark text-3xl font-extrabold text-white">
            {initialsOf(member.name)}
          </div>
        )}

        {/* Overlay: nombre, cargo, correo y teléfono. Visible con el
            cursor en escritorio (hover), O tocando el círculo en
            cualquier pantalla (isSelected) -- así queda "fijo" hasta
            que se elige otro integrante o se vuelve a tocar el mismo. */}
        <div
          className={cx(
            "absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-black/80 px-4 text-center",
            "transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-base font-bold text-white">{member.name}</p>
          {member.role && (
            <p className="text-xs font-bold uppercase tracking-wide text-brand-gold">{member.role}</p>
          )}
          {member.email && <p className="mt-1 break-all text-xs text-white/80">{member.email}</p>}
          {member.phone && <p className="text-xs text-white/80">{member.phone}</p>}
        </div>
      </button>
    </div>
  );
}

export default function TeamSection({ lang, title, description, team }: TeamSectionProps) {
  // Un solo integrante "seleccionado" (tocado) a la vez -- ver
  // TeamMemberCard arriba. null = ninguno tocado todavía (o se
  // destocó el que estaba abierto).
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Sin integrantes reales cargados en Sanity, no se muestra el equipo
  // de ejemplo -- se oculta la sección completa.
  if (!team || team.length === 0) return null;

  const heading = HEADING[lang] || HEADING.en;
  const finalTitle = title || heading.title;
  const finalDescription = description || heading.description;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      {/* Encabezado centrado -- ancho y espaciado ampliados a pedido
          del usuario: la descripción es más larga que el copy corto
          de antes, así que con el mismo max-w-2xl/mt-4/tamaño de letra
          original se veía apretada (muchas líneas cortas, muy pegada
          al título). max-w-3xl le da más aire horizontal (menos
          líneas), mt-6 más separación del título, y leading-relaxed +
          text-lg más espacio entre líneas. */}
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold sm:text-5xl">{finalTitle}</h2>
        {finalDescription && (
          <p className="mt-6 text-lg leading-relaxed text-black/50">{finalDescription}</p>
        )}
      </div>

      {/* Grilla de avatares -- pedido del usuario: centrada, y que a
          medida que se agregan integrantes se acomoden de a 3 por fila
          (en vez de la grilla fija de 4 columnas de antes, que con
          pocos integrantes los dejaba pegados a la izquierda en vez de
          centrados). "auto-fit" + un ancho máximo de contenedor
          calculado para exactamente 3 columnas de 220px (el mismo
          max-w-[220px] de cada círculo, ver TeamMemberCard) logra las
          dos cosas con una sola regla: nunca entran más de 3 por fila
          (el contenedor no da para una 4ª), y si hay menos de 3,
          "justify-center" centra el grupo en vez de pegarlo a la
          izquierda. En pantallas angostas, "minmax(160px, 220px)"
          deja que quepan menos por fila sin que se encimen. */}
      <div className="mx-auto mt-12 grid max-w-[724px] grid-cols-[repeat(auto-fit,minmax(160px,220px))] justify-center gap-x-8 gap-y-10">
        {team.map((member, index) => (
          <TeamMemberCard
            key={`${member.name}-${index}`}
            member={member}
            index={index}
            isSelected={selectedIndex === index}
            onToggle={() => setSelectedIndex((current) => (current === index ? null : index))}
          />
        ))}
      </div>
    </section>
  );
}
