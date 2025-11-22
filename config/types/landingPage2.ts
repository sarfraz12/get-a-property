import { PortableTextBlock } from "next-sanity";

export type landingProject2 = {
    _id: string;
    _createdAt: Date;
    title: string;
    slug: string;
    image: string;
    bio: PortableTextBlock[];
    sliders: {
        sliderTitle: string;
        sliderDescription: string;
        sliderImage: string

    }[]
}