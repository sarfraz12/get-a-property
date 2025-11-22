/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
                protocol: "https"
            },
            {
                hostname: "i.pinimg.com",
                protocol: "https"
            },
            {
                hostname: "wallpapercave.com",
                protocol: "https"
            },
            {
                hostname: "wallpaperaccess.com",
                protocol: "https"
            },
            {
                hostname: "cdn.sanity.io",
                protocol: "https"
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.goldghee.com.pa' }],
                destination: 'https://goldghee.com.pa/:path*',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
