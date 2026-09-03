import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/lib/sanity/config";

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = source => {
  if (!source || !source.asset) return;
  const dimensions = source?.asset?._ref.split("-")[2];

  const [width, height] = dimensions
    ?.split("x")
    .map(num => parseInt(num, 10));

  const url = imageBuilder
    .image(source)
    .auto("format")
    .width(Math.min(width, "2000"))
    .url();

  return {
    src: url,
    width: width,
    height: height
  };
};

// NUEVO: helper específico para la imagen de Open Graph / Twitter Card
// (la que leen WhatsApp, Facebook, etc. al mostrar la vista previa de
// un link). BUG REAL encontrado: urlForImage() de arriba pide el
// ancho ORIGINAL del archivo subido (lo saca del nombre del asset,
// puede ser 1536px, 2000px...) sin forzar compresión -- para mostrar
// la foto EN la página está perfecto (next/image ya la sirve liviana
// ahí), pero usado para el og:image, un archivo pesado subido tal
// cual desde Sanity puede pesar varios MB. WhatsApp en particular
// tiene un límite muy estricto (~500-600KB): si el archivo lo supera,
// WhatsApp no muestra NINGUNA imagen en el preview del link (no avisa
// ningún error, la deja vacía nada más). Este helper siempre pide el
// tamaño exacto que se declara en openGraph.images (1200x630),
// recortado (fit=crop) y como JPEG de calidad 70 -- entra cómodo
// debajo de ese límite sin importar qué tan pesado sea el archivo
// original que suba el editor en Sanity.
export const urlForOgImage = source => {
  if (!source || !source.asset) return;
  const url = imageBuilder
    .image(source)
    .width(1200)
    .height(630)
    .fit("crop")
    .format("jpg")
    .quality(70)
    .url();
  return { src: url };
};
