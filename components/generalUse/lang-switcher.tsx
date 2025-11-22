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
            className="font-semibold flex items-center gap-1 text-brand-black hover:text-brand-dark dark:text-brand-light dark:hover:text-brand "
            href={redirectTarget()}
            locale={targetLanguage}>
            <span>{targetLanguage === 'es' ? '🇺🇸' : '🇵🇦'}</span>
            {locale.toLocaleUpperCase()}
        </Link>
    );
};

export default LangSwitcher;