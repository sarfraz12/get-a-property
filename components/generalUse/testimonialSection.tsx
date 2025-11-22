"use client";

import React from "react";
import Image, { type ImageProps } from "next/image";
import { urlForImage } from "@/lib/sanity/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


interface Testimonial {
    quote: string;
    author?: string;
}

interface TestimonialSectionProps {
    title?: string;
    backgroundImage?: any;
    testimonials: Testimonial[];
    backgroundColor?: string;
}

export default function TestimonialSection({
    title,
    backgroundImage,
    backgroundColor = "#F2F1EC",
    testimonials,
}: TestimonialSectionProps) {
    return (
        <section className="relative w-full min-h-[70vh] py-20 px-4 md:px-8">
            {/* Background image */}

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

            <div className="max-w-5xl mx-auto text-center">
                {title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-10">
                        {title}
                    </h2>
                )}

                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    spaceBetween={30}
                    slidesPerView={1}
                >
                    {testimonials?.map((t, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="bg-white rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto relative">
                                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                                    {t.quote}
                                </p>
                                {t.author && (
                                    <p className="text-sm font-semibold text-gray-900">
                                        — {t.author}
                                    </p>
                                )}

                                {/* Quote icon */}
                                <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-4xl text-yellow-500">
                                    ❝
                                </span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
