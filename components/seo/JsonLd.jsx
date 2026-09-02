// components/seo/JsonLd.jsx
//
// Renderiza uno o más bloques de datos estructurados (JSON-LD) como
// <script type="application/ld+json"> REAL en el HTML de la página.
//
// Por qué existe: Next.js's Metadata API (el campo "other" que se
// usaba antes en todo el sitio como other["script:ld+json"]) NUNCA
// genera una etiqueta <script> real -- sólo genera <meta name=...
// content=...>, que es invisible para Google y cualquier parser de
// datos estructurados (confirmado inspeccionando el DOM en vivo antes
// de este cambio). Este componente es el reemplazo correcto: se usa
// directamente en el JSX del componente de página (no en
// generateMetadata, que sólo puede tocar <meta>/<link>), y sí produce
// un <script type="application/ld+json"> real en el HTML.
//
// Uso:
//   <JsonLd data={organizationJsonLd} />
//   <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  const valid = items.filter(Boolean);
  if (!valid.length) return null;

  return (
    <>
      {valid.map((item, index) => (
        <script
          key={item?.["@id"] || item?.["@type"] || index}
          type="application/ld+json"
          // Escapar "<" evita que un valor de texto real (ej. una
          // descripción que contenga "</script>") pueda cerrar la
          // etiqueta <script> antes de tiempo -- es la mitigación
          // estándar recomendada para JSON embebido en HTML.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
