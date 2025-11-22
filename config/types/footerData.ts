export interface FooterData {
    id?: string
    title: string 
    children: FooterChild[]
    slug: string
    mainImage?:any
    body: string
    _createdAt: string
    _updatedAt: string
    _rev?: string
    _type?: string
    button?: boolean
    external?: boolean
    href?: string
}

export interface FooterChild {
    _key: string,
    title: string,
    slug?: string,
    path?: string,

}

