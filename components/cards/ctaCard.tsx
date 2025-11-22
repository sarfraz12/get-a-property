import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

interface Data {
    title?: string;
    subTitle?: string;
    description?: string;
    buttonMessage?: string;
    buttonLink?: string;
    imageAlt?: string;
    image?: string | any;
}

export default function CtaCard({
    title,
    subTitle,
    description,
    buttonMessage,
    buttonLink,
    imageAlt,
    image
}: Data) { // Destructuring props for better readability


    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900  rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform transition-transform duration-300 hover:scale-105">
            <div className="md:flex">
                <div className="md:flex-shrink-0 relative md:w-48 h-auto"> {/* Added 'relative' for fill prop */}
                    <Image
                        className="object-cover"
                        fill
                        src={image || "/"}
                        alt={imageAlt || "CTA Image"}
                    />
                </div>
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{title}</div>
                    <Link href={buttonLink || "#"} className="block mt-1 text-lg leading-tight font-medium text-black dark:text-white hover:underline">
                        {subTitle} {/* Corrected closing tag to Link */}
                    </Link>
                    <p className="mt-2 text-gray-500">{description}</p>
                    <div className="mt-4">
                        <Link
                            href={buttonLink || "#"}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                        >
                            {buttonMessage} <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
