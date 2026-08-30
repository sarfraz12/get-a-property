// components/cards/cardIcon.js
//
// Tarjeta de ícono, usada en la grilla "keyActivities" de la home
// (ej: documentos, información de precios, gráficos). Forma tipo
// "feature card" de real estate: ícono dentro de un círculo de color
// de marca, título, descripción y botones como píldoras con flecha.
//
// Placeholders agregados esta sesión: si el editor deja el título o
// la descripción vacíos en Sanity, o elige un ícono que no está en la
// lista (o no elige ninguno), antes se veía un círculo vacío y texto
// en blanco. Ahora cae en un ícono genérico (una estrella) y un texto
// de respaldo bilingüe.
import { BanknotesIcon, FolderMinusIcon, PresentationChartLineIcon, SparklesIcon } from "@heroicons/react/24/solid";

function CardIconGraphic({ icon }) {
  switch (icon) {
    case "folderMinus":
      return <FolderMinusIcon className="h-6 w-6 text-brand-dark" />;
    case "banknotes":
      return <BanknotesIcon className="h-6 w-6 text-brand-dark" />;
    case "presentationChartLine":
      return <PresentationChartLineIcon className="h-6 w-6 text-brand-dark" />;
    default:
      // Ícono genérico de respaldo, para que el círculo nunca quede vacío.
      return <SparklesIcon className="h-6 w-6 text-brand-dark" />;
  }
}

const DEFAULT_COPY = {
  es: { title: "Get a Property", description: "Más información próximamente." },
  en: { title: "Get a Property", description: "More information coming soon." },
};

export default function CardIcon({ data, lang }) {
  const defaults = DEFAULT_COPY[lang] || DEFAULT_COPY.es;
  const title = data?.title || defaults.title;
  const description = data?.description || defaults.description;

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:bg-slate-800">
      {/* Ícono dentro de un círculo con el color de marca */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/15">
        <CardIconGraphic icon={data?.iconString} />
      </div>

      <h5 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{title}</h5>
      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-300">{description}</p>

      {/* Enlaces opcionales (link externo / archivo adjunto) */}
      <div className="mt-5 flex flex-wrap gap-3">
        {data?.link && (
          <a
            href={data.link}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-900 transition-colors hover:bg-black/10 dark:text-white"
          >
            {lang === "en" ? "Visit link" : "Visitar enlace"}
            <span aria-hidden>&rarr;</span>
          </a>
        )}

        {data?.attachmentUrl && (
          <a
            href={data.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-900 transition-colors hover:bg-black/10 dark:text-white"
          >
            {lang === "en" ? "Download file" : "Descargar archivo"}
            <span aria-hidden>&rarr;</span>
          </a>
        )}
      </div>
    </div>
  );
}
