interface I18Config {
    defaultLocale: string
    locales: string[]
}

export const i18n:I18Config = {
    defaultLocale: "en",
    locales: ["en", "es"]
}