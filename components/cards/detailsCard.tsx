"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
    title?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    subcontent?: string;
    hasImage?: boolean;
    size?: 'small' | 'medium' | 'large';
    hasButton?: boolean;
    buttonLink?: string;
    span?: 'horizontal' | 'vertical'; // Prop to control span behavior
    animation?: string;
}

const DetailsCard: React.FC<CardProps> = ({
    title,
    description,
    imageSrc,
    imageAlt = '',
    subcontent,
    hasImage = false,
    size = 'medium',
    hasButton = true,
    buttonLink,
    span,
    animation = "animate-fadeInScale",
}) => {
    // Define card size variations based on props
    const sizeClasses = {
        small: 'h-25', // Small height
        medium: 'h-50', // Medium height
        large: 'h-100', // Large height
    };

    // Define span classes for grid
    const spanClasses = {
        horizontal: 'md:col-span-3', // Spans horizontally across two columns
        vertical: 'md:row-span-3',    // Spans vertically across two rows
    };

    // animation handler
    const section1Ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.3, // Adjust threshold as needed
        };

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isVisible) {
                    // Only set visible if it's currently not visible
                    setIsVisible(true);
                }
            });
        };

        const observer = new IntersectionObserver(handleObserver, observerOptions);
        const section1 = section1Ref.current;

        if (section1) {
            observer.observe(section1);
        }

        return () => {
            if (section1) observer.unobserve(section1);
        };
    }, [isVisible]); // Added isVisible as a dependency

    return (
        <div
            ref={section1Ref}
            className={` bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-5 transition-transform duration-300 hover:scale-105 
            ${sizeClasses[size]} ${span ? spanClasses[span] : ''} flex flex-col justify-between relative
            ${isVisible ? `opacity-100 ${animation}` : 'opacity-0'}`}
        >
            {/* Image Section */}
            {hasImage && imageSrc && (
                <div className="relative mb-4 flex-grow">
                    <Image
                        className="rounded-lg object-cover w-full h-full"
                        src={imageSrc}
                        alt={imageAlt}
                    />
                    {subcontent && (
                        <p className="absolute bottom-0 left-0 w-full bg-white bg-opacity-75  text-gray-600 text-sm p-2">
                            {subcontent}
                        </p>
                    )}
                </div>
            )}

            {/* Content Section */}

            {title && (
                <h3 className="text-lg font-semibold dark:text-white text-gray-800 mb-1">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-sm dark:text-white text-gray-500 mb-4">
                    {description}
                </p>
            )}


            {/* Fancy Button Section */}
            {hasButton && (
                <div className="mt-4 relative"> {/* Margin for the button */}
                    <Link href={buttonLink || ''} target='_blank' passHref>
                        <button className="flex items-center justify-center px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:text-white hover:bg-indigo-600 transition-colors duration-300 ease-in-out transform hover:scale-105">
                            More <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default DetailsCard;
