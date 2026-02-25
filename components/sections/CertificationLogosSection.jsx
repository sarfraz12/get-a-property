import Image from "next/image";

export default function CertificationLogosSection({
  title,
  logos = [],
}) {
  if (!logos?.length) return null;

  const count = logos.length;

  // Limit columns per breakpoint
  const smCols = Math.min(count, 2);
  const mdCols = Math.min(count, 3);
  const lgCols = Math.min(count, 4);

  const gridClasses = `
    grid 
    gap-10 
    justify-items-center
    grid-cols-1
    sm:grid-cols-${smCols}
    md:grid-cols-${mdCols}
    lg:grid-cols-${lgCols}
  `;

  return (
    <section className="py-16 px-6 ">
      <div className="max-w-6xl mx-auto text-center">

        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            {title}
          </h2>
        )}

        <div className={gridClasses}>
          {logos.map((logo, index) => (
            <div
              key={logo?._key || index}
              className="
                w-60 h-44
                bg-white dark:bg-neutral-800
                rounded-2xl
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition
                duration-300
                flex
                items-center
                justify-center
                p-6
              "
            >
              <div className="relative w-full h-full">
                <Image
                  src={logo?.image}
                  alt={logo?.alt || "Certification logo"}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}