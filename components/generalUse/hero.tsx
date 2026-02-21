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
            <div  style={{ whiteSpace: 'pre-line' }} className="relative container mx-auto flex flex-col md:flex-row justify-between gap-2 px-4 md:px-6 md:py-6 items-start md:items-center">
                {/* LEFT (text) */}
                <div className="flex-1 text-left max-w-xl md:order-1 order-2 md:mx-20">
                    <h1 className="text-3xl md:text-5xl uppercase font-bold leading-tight mb-6 md:text-left text-center text-brand-black">
                        {title}
                    </h1>
                    <p className="text-base text-justify md:text-lg font-semibold text-brand-black mb-8">{description}</p>
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
                <div className="flex-1 flex items-center justify-center md:pb-6 md:order-2 order-1">
                    {productImage && (
                        <div className="relative  md:h-[500px] z-20">
                            <Image
                                {...(urlForImage(productImage) as ImageProps)}
                                alt="Hero product"
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
