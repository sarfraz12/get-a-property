import readingTime from "reading-time"
import {DateTime} from "luxon"
// to install in typscript luxon you need to add npm i @types/luxon  
// import { cache } from "react"


export const getReadingTime = (text: string, locale='es') => {
    const minutes = readingTime(text).minutes
    //  floor 1 decimal 
    const minutesRounded = Math.floor(minutes*10) / 10
    if (locale === 'es'){
        if (minutesRounded === 1){
            return `${minutesRounded} minuto`
        } else {
            return `${minutesRounded} minutos`
        }
    }else{
        if (minutesRounded === 1){
            return `${minutesRounded} minute`
        } else {
            return `${minutesRounded} minutes`
        }
    }
}

export const getRelativeDate = (date: string, locale: string) => {
    return DateTime.fromISO(date).setLocale(locale).toRelative();
} 