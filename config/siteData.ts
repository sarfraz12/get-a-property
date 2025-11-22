
import { LeftMenu, RightMenu } from "@/config/types/navbar"
import { siteConfigType } from "@/config/types/siteConfig"


export const siteConfig: siteConfigType = {
  siteName: "Centro Educativo Panamá",
  description: "We share all our current information in this website. Official Website.",
  currentLoc: "Panamá",
  socialLinks: {
    facebook: "https://www.instagram.com/ceppanama",
    instagram: "https://www.instagram.com/ceppanama",
    google: "https://maps.app.goo.gl/ZrPk14LfyFRgy6Lt8"
  },
};





export function getLeftMenu(locale: string) {
  const localizedLabels = labels[locale] || labels.en; // Default to English if locale not found
  return [
    {
      label: localizedLabels.about,
      href: "#",
      children: [
        { title: localizedLabels.boardMessage, path: `/${locale}/about/board`, external: false },
        { title: localizedLabels.missionVision, path: `/${locale}/about/misionVision`, external: false },
        { title: localizedLabels.aboutUs, path: `/${locale}/about/aboutUs`, external: false },
      ]
    },
    {
      label: localizedLabels.news,
      href: `/${locale}/all`,
      external: false,
    },
    {
      label: localizedLabels.admission,
      href: "#",
      children: [
        { title: localizedLabels.process, path: `/${locale}/admission/process` },
        { title: localizedLabels.charges, path: `/${locale}/admission/charges`, external: false },
        { title: localizedLabels.form, path: `/${locale}/admission/form` },
        { title: localizedLabels.preRegistration, path: `/${locale}/admission/preRegistration` },
      ]
    },
    {
      label: localizedLabels.contact,
      href: `/${locale}/contact`,
      button: true
    }
  ];
}

export function getRightMenu(locale: string) {
  const localizedLabels = rightMenuLabels[locale] || rightMenuLabels.en; // Default to English if locale not found
  return [
    {
      label: localizedLabels.schoolSubjects,
      href: `/${locale}/school-subjects`,
      children: [
        { title: localizedLabels.all, path: `/${locale}/school-subjects` },
        { title: localizedLabels.pk3, path: `/${locale}/school-subjects/post/pk-3-grade` },
        { title: localizedLabels.preschool, path: `/${locale}/school-subjects/post/preschool-grade` },
        { title: localizedLabels.kindergarten, path: `/${locale}/school-subjects/post/kindergarten` },
        { title: localizedLabels.firstGrade, path: `/${locale}/school-subjects/post/first-grade` },
        { title: localizedLabels.secondGrade, path: `/${locale}/school-subjects/post/second-grade` },
        { title: localizedLabels.thirdGrade, path: `/${locale}/school-subjects/post/third-grade` },
        { title: localizedLabels.fourthGrade, path: `/${locale}/school-subjects/post/fourth-grade` },
        { title: localizedLabels.fifthGrade, path: `/${locale}/school-subjects/post/fifth-grade` },
        { title: localizedLabels.sixthGrade, path: `/${locale}/school-subjects/post/sixth-grade` }
      ]
    },
    {
      label: localizedLabels.studentLife,
      href: `/${locale}/student-life`,
      children: [
        { title: localizedLabels.sports, path: `/${locale}/sports` },
        { title: localizedLabels.extracurricular, path: `/${locale}/extracurricular-activities` },
        { title: localizedLabels.uniform, path: `/${locale}/uniform-and-protocols` }
      ]
    },
    {
      label: localizedLabels.login,
      href: "https://academicanet.com/index.cshtml?ReturnUrl=%2f",
      button: true,
      external: true,
    }
  ];
}


const labels: any = {
  en: {
    about: "About",
    news: "News",
    admission: "Admission",
    contact: "Contact",
    boardMessage: "Board Message",
    missionVision: "Mission & Vision",
    aboutUs: "About Us",
    process: "Process",
    charges: "Charges",
    form: "Form",
    preRegistration: "Pre Registration"
  },
  es: {
    about: "Acerca de",
    news: "Noticias",
    admission: "Admisión",
    contact: "Contacto",
    boardMessage: "Mensaje del Consejo",
    missionVision: "Misión y Visión",
    aboutUs: "Sobre Nosotros",
    process: "Proceso",
    charges: "Precios",
    form: "Formulario",
    preRegistration: "Preinscripción"
  }
  // Add more locales as needed
};

const rightMenuLabels: any = {
  en: {
    schoolSubjects: "School Subjects",
    all: "All",
    pk3: "PK3",
    preschool: "Preschool",
    kindergarten: "Kindergarten",
    firstGrade: "First Grade",
    secondGrade: "Second Grade",
    thirdGrade: "Third Grade",
    fourthGrade: "Fourth Grade",
    fifthGrade: "Fifth Grade",
    sixthGrade: "Sixth Grade",
    studentLife: "Student Life",
    sports: "Sports",
    extracurricular: "Extracurricular Activities",
    uniform: "Uniform",
    login: "Login"
  },
  es: {
    schoolSubjects: "Asignaturas",
    all: "Todo",
    pk3: "PK3",
    preschool: "Preescolar",
    kindergarten: "Jardín de Infancia",
    firstGrade: "Primer Grado",
    secondGrade: "Segundo Grado",
    thirdGrade: "Tercer Grado",
    fourthGrade: "Cuarto Grado",
    fifthGrade: "Quinto Grado",
    sixthGrade: "Sexto Grado",
    studentLife: "Vida Estudiantil",
    sports: "Deportes",
    extracurricular: "Actividades Extracurriculares",
    uniform: "Uniforme",
    login: "Iniciar Sesión"
  }
  // Add more locales as needed
};