// components/sections/ContactCtaSection.tsx
//
// Sección final de la referencia: a la izquierda una tarjeta "teaser"
// de contenido (imagen + insignia + título + fecha) y a la derecha una
// tarjeta negra con un formulario corto para que alguien te contacte.
//
// Diferencias con la referencia, a propósito:
// - La tarjeta izquierda usa el POST MÁS RECIENTE real (se le pasa por
//   prop `post`, típicamente `posts?.[0]` desde home.js, que ya viene
//   ordenado por fecha desde Sanity) en vez de un titular inventado.
//   Si no hay posts todavía, cae en un texto genérico de respaldo.
// - La imagen de respaldo (`placeholderImage`) es un asset que YA
//   existe en /public/images — no se copió la foto de la plantilla de
//   referencia (esa es una foto de stock con licencia del template,
//   no del proyecto).
// - El formulario tiene 3 campos (nombre, correo, celular) y se envía
//   al endpoint que ya existe en el proyecto: pages/api/emailJs.js
//   (POST a /api/emailJs). Ver el comentario en ese archivo: hoy es el
//   único lugar del código que usa esa ruta — la página /contact envía
//   el correo directo desde el navegador con la librería de EmailJS,
//   sin pasar por esta API.
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";
import { urlForImage } from "@/lib/sanity/image";
import { cx } from "@/utils/all";

interface TeaserPost {
  title?: string;
  slug?: { current: string };
  mainImage?: any;
  categories?: { title?: string }[];
  publishedAt?: string;
  _createdAt?: string;
}

interface ContactCtaSectionProps {
  lang: string;
  post?: TeaserPost | null;
  title?: string;
  description?: string;
  buttonText?: string;
  placeholderImage?: string;
}

const COPY: Record<string, { title: string; description: string; buttonText: string; fallbackTitle: string; badge: string }> = {
  es: {
    title: "¿Todavía tienes una pregunta?",
    description: "Cuéntanos qué necesitas saber sobre nuestras propiedades y te contactamos.",
    buttonText: "Contáctanos",
    fallbackTitle: "Descubre nuestras últimas publicaciones",
    badge: "Novedades",
  },
  en: {
    title: "Do you still have a question?",
    description: "Tell us what you'd like to know about our properties and we'll reach out.",
    buttonText: "Contact us",
    fallbackTitle: "Discover our latest posts",
    badge: "News",
  },
};

/* ------------------------------------------------------------------ */
/*  Tarjeta izquierda: teaser del post más reciente                    */
/* ------------------------------------------------------------------ */

function TeaserCard({
  post,
  lang,
  placeholderImage,
}: {
  post?: TeaserPost | null;
  lang: string;
  placeholderImage: string;
}) {
  const copy = COPY[lang] || COPY.en;
  const image = post?.mainImage ? urlForImage(post.mainImage) : null;
  const badge = post?.categories?.[0]?.title || copy.badge;
  const rawDate = post?.publishedAt || post?._createdAt;
  const dateLabel = rawDate
    ? format(parseISO(rawDate), "MMMM dd, yyyy", { locale: lang === "es" ? es : undefined })
    : null;
  const href = post?.slug?.current ? `/${lang}/all/post/${post.slug.current}` : `/${lang}/all`;

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-900 sm:grid-cols-2"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto">
        <Image
          src={image?.src || placeholderImage}
          alt={post?.mainImage?.alt || post?.title || "Get a Property"}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black shadow-sm">
            {badge}
          </span>
          <h3 className="mt-5 text-2xl font-extrabold leading-tight sm:text-3xl">
            {post?.title || copy.fallbackTitle}
          </h3>
        </div>

        {dateLabel && <p className="mt-8 text-sm font-bold text-black/70 dark:text-white/60">{dateLabel}</p>}
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta derecha: formulario de contacto rápido                     */
/* ------------------------------------------------------------------ */

type FormValues = { name: string; email: string; phone: string };
type SubmitStatus = "idle" | "success" | "error";

function QuickContactForm({ lang, buttonText }: { lang: string; buttonText: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ mode: "onTouched" });

  const [status, setStatus] = useState<SubmitStatus>("idle");

  const inputClass = (hasError: boolean) =>
    cx(
      "w-full rounded-2xl border bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-colors",
      hasError ? "border-red-400 focus:border-red-400" : "border-white/15 focus:border-white/40"
    );

  const onSubmit = async (data: FormValues) => {
    setStatus("idle");
    try {
      // Se envía al endpoint que ya tiene el proyecto: pages/api/emailJs.js
      const response = await fetch("/api/emailJs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `Nuevo contacto desde la sección "¿Tienes una pregunta?" de la home.\nTeléfono: ${data.phone}`,
        }),
      });

      if (!response.ok) throw new Error("email request failed");

      setStatus("success");
      reset();
    } catch (error) {
      console.error("QuickContactForm error:", error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
      <div>
        <input
          type="text"
          placeholder={lang === "es" ? "Nombre" : "Name"}
          className={inputClass(!!errors.name)}
          {...register("name", { required: true })}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400">{lang === "es" ? "Ingresa tu nombre" : "Enter your name"}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          placeholder={lang === "es" ? "Correo" : "Email"}
          className={inputClass(!!errors.email)}
          {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">
            {lang === "es" ? "Ingresa un correo válido" : "Enter a valid email"}
          </p>
        )}
      </div>

      <div>
        <input
          type="tel"
          placeholder={lang === "es" ? "Celular" : "Phone"}
          className={inputClass(!!errors.phone)}
          {...register("phone", { required: true })}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-400">{lang === "es" ? "Ingresa tu celular" : "Enter your phone"}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-black transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? (lang === "es" ? "Enviando…" : "Sending…") : buttonText}
      </button>

      {status === "success" && (
        <p className="text-sm text-emerald-400">
          {lang === "es" ? "¡Listo! Te contactaremos pronto." : "Done! We'll be in touch soon."}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-400">
          {lang === "es" ? "Algo salió mal. Intenta de nuevo." : "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Sección completa                                                    */
/* ------------------------------------------------------------------ */

export default function ContactCtaSection({
  lang,
  post,
  title,
  description,
  buttonText,
  placeholderImage = "/images/lotes-frente-playa.webp",
}: ContactCtaSectionProps) {
  const copy = COPY[lang] || COPY.en;
  const finalTitle = title ?? copy.title;
  const finalDescription = description ?? copy.description;
  const finalButtonText = buttonText ?? copy.buttonText;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <TeaserCard post={post} lang={lang} placeholderImage={placeholderImage} />

        <div className="rounded-3xl bg-black p-8 text-white sm:p-10">
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight sm:text-4xl">{finalTitle}</h2>
          <p className="mt-4 max-w-sm text-white/60">{finalDescription}</p>

          <QuickContactForm lang={lang} buttonText={finalButtonText} />
        </div>
      </div>
    </section>
  );
}
