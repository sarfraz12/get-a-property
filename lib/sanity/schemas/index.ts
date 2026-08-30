import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import settings from './settings'
import landingPage from './landingPage'
import aboutPage from './aboutPage'
import navbarData from './navbarData'
import footerData from './footerData'
import contactPage from './contactPage'
import searchPage from './searchPage'



export const schemaTypes = [
     post, author, category, settings, blockContent, // default must not exclude
     landingPage, aboutPage, navbarData, footerData, // web customization
     contactPage, searchPage, // SEO editable de páginas sin documento propio
]
