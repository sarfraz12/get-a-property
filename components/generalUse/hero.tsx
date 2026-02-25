// components/Hero.tsx
import Image, { type ImageProps } from "next/image";
import { urlForImage } from "@/lib/sanity/image";

type HeroProps = {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor?: string;
    backgroundImage?: any; // Sanity image
    productImage?: any; // Sanity product images
};

export default function Hero({
    title,
    description,
    buttonText,
    buttonLink,
    backgroundColor = "#F2F1EC",
    backgroundImage,
    productImage,
}: HeroProps) {
    return (
        <section className="relative w-full">
            {/* Background image as true background */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 -z-20 bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${urlForImage(backgroundImage)?.src})`,
                    }}
                />
            )}

            {/* Overlay color */}
            <div
                className="absolute inset-0 -z-10"
                style={{ backgroundColor, opacity: backgroundImage ? 0.5 : 1 }}
            />

            {/* Content */}
            <div style={{ whiteSpace: 'pre-line' }} className="relative container mx-auto flex flex-col md:flex-row justify-between gap-2 px-4 md:px-6 md:py-6 items-start md:items-center">
                {/* LEFT (text) */}
                <div className="flex-1 text-left max-w-xl md:order-1 order-2 md:mx-20">
                    <h1 className="text-brand-gold text-3xl md:text-5xl uppercase font-bold leading-tight mb-6 md:text-left text-center dark:text-brand-dark">
                        {title}
                    </h1>
                    {/* <p className="text-base text-justify md:text-lg font-semibold text-brand-black mb-8">{description}</p> */}
                    <div className="mb-8">
                        <div className=" inline-block bg-white/75 backdrop-blur-sm rounded-2xl px-6 py-5 shadow-lg max-w-full">
                            <p className="
                            text-base md:text-lg
                            font-normal
                        text-brand-black
                            text-justify
                            "
                            >
                                {description}
                            </p>
                        </div>
                    </div>
                    {buttonText && (
                        <div className="w-full flex justify-center md:justify-normal md:p-0 p-4">
                            <a
                                href={buttonLink}
                                className="px-6 py-3 bg-brand-black text-brand-light rounded-md shadow-md hover:bg-brand-dark transition"
                            >
                                {buttonText}
                            </a>
                        </div>
                    )}
                </div>

                {/* RIGHT (product image) */}
                {productImage && (
                    <div className="hidden lg:block absolute top-0 right-0 z-20 
                  w-[60%] sm:w-[50%] md:w-[45%] lg:w-[40%] xl:w-[35%]
                  h-full pointer-events-none">
                        <div className="relative w-full h-full">
                            <Image
                                {...(urlForImage(productImage) as ImageProps)}
                                alt="Hero product"

                                priority
                                className="object-contain object-top-right 
                   drop-shadow-2xl"
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
