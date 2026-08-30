// lib/hooks/useInView.ts
//
// Hook reutilizable para animaciones de "aparecer al hacer scroll".
// Esta misma lógica (IntersectionObserver + estado isVisible) estaba
// duplicada dentro de varios componentes (PostList, ServiceDescription,
// RecentPostsSection); se centraliza acá para que cualquier componente
// nuevo la reuse en una sola línea en vez de copiar el efecto entero.
//
// Uso:
//   const { ref, isVisible } = useInView<HTMLDivElement>();
//   <div ref={ref} className={isVisible ? "opacity-100" : "opacity-0"}>
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Una vez visible se desconecta: es una animación de entrada,
    // no hace falta seguir observando después de dispararla.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
