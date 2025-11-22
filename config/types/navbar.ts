export interface Child {
    title: string;
    path: string;
    external?: boolean;
    button?: boolean;
  }
  
  export interface LeftMenu {
    label: string;
    href: string;
    children?: Child[];
    external?: boolean;
    button?: boolean;
  }
export interface RightMenu {
    label: string
    href: string 
    children?: Child[]
    external?: boolean
    button?:boolean

}
