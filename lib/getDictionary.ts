
const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {

    if (!locale || locale === undefined) {
        return dictionaries['en']()
    } else {
        return dictionaries[locale as 'en' | 'es']()
    }
}