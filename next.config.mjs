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
    // El redirect de www.goldghee.com.pa -> goldghee.com.pa que vivía acá
    // se quitó (set. 2026): ese negocio ya no existe en este proyecto
    // (ver lib/siteContext.ts) y esos dominios no están conectados a
    // este deploy -- era código muerto que podía confundir a futuro.
};

export default nextConfig;
