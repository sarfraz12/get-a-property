export interface Post {
    id: string
    title: string 
    description: string
    category: Category[]
    author: Author
    slug: string
    mainImage?:any
    body: string
    date_created: string
    date_updated: string
    user_created?: string
    status?: string
}

export interface Category {
    id: string,
    title: string,
    slug?: string,
    description?: string,
    color?:string
}

export interface Author {
    id: string,
    first_name: string,
    last_name: string,
    slug?: string,
    description?: string,
    status?: string,
    mainImage?:any

}