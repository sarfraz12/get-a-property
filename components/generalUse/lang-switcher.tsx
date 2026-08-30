// components/generalUse/lang-switcher.tsx
//
// Botón de cambio de idioma de la navbar (bandera + "ES"/"EN"): toma
// la ruta actual, reemplaza el segmento de idioma ("/es/..." <->
// "/en/...") y arma el link al mismo contenido en el otro idioma. Se
// usa dos veces en components/navigation/navbar.tsx (versión de
// escritorio y versión del menú móvil).

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation";

const LangSwitcher = ({locale}: {locale: string} ) => {
   
    
    const targetLanguage = locale === 'es' ? 'en' : 'es';
    const pathname = usePathname()
    const redirectTarget = () => {
        if (!pathname) return '/'
        const segments = pathname.split('/')
        segments[1] = targetLanguage;
        return segments.join('/')
    }

    return (    
        <Link
            className="font-semibold flex items-center gap-1 text-brand-black hover:text-brand-dark dark:text-brand-light dark:hover:text-brand-gold "
            href={redirectTarget()}
            locale={targetLanguage}>
            <span>{targetLanguage === 'es' ? '🇺🇸' : '🇵🇦'}</span>
            {locale.toLocaleUpperCase()}
        </Link>
    );
};

export default LangSwitcher;