import Container from "@/components/generalUse/container";
import ThemeSwitch from "@/components/generalUse/themeSwitch";
import Link from "next/link";
import SocialLink from "@/components/generalUse/socialIcons"
import { cx } from "@/utils/all"

export default async function footer(props) {
    const { data } = props;

    return (
        <Container className=" border-t border-gray-100 dark:border-gray-800 dark:text-white text-black ">

            <div id="footer-content" className="relative pt-8 xl:pt-16 pb-6 xl:pb-12">
                <div className="container xl:max-w-6xl mx-auto px-4 overflow-hidden">
                    <div className="flex flex-wrap flex-row lg:justify-between -mx-3">
                        {/* Head title and Address */}
                        <div className="flex-shrink max-w-full w-full lg:w-2/5 px-3 lg:pr-16">
                            <div className="flex items-center mb-2">
                                <span className="text-3xl leading-normal mb-2 font-bold dark:text-gray-100 text-gray-600 mt-2">{props?.title}</span>
                                {/* <!-- <img src="src/img-min/logo.png" alt="LOGO"> --> */}
                            </div>
                            <p>{props?.address}</p>
                        </div>

                        <div className="flex-shrink max-w-full w-full lg:w-3/5 px-3">
                            <div className="flex flex-wrap flex-row">
                                {/* DYNAMIC FIELDS  */}
                                {
                                    data?.map((item, index) => (
                                        <div
                                            key={item.id || `${item.title}-${index}`}
                                            className={cx(
                                                "flex-shrink max-w-full w-1/2 md:w-1/3 mb-6 lg:mb-0",
                                                item?.button && "order-last mt-2"
                                            )}

                                        >
                                            {/* Header or Title */}
                                            <Link
                                                href={item?.href ? item.href : ''}
                                                key={`${item?.title}${index}`}
                                                target={item?.external ? '_blank' : ''}
                                                rel={item?.external ? 'noopener' : ''}
                                                className={cx(
                                                    item.button && "text-sm p-2 border border-red-700 rounded-md font-medium hover:text-white hover:border-red-800 hover:bg-gray-600 dark:hover:bg-red-600",
                                                    "inline-flex items-center gap-2" // Added flex styling
                                                )}
                                            >
                                                {!item?.children && item?.title}
                                                {item?.children && (
                                                    <div className="flex items-center gap-2">
                                                        <h2 className="text-base leading-normal uppercase dark:text-gray-100 hover:text-red-500 text-gray-600 m-0">
                                                           <strong> {item?.title}</strong>
                                                        </h2>
                                                        {/* Add your actual button element here if needed */}
                                                        {/* <button className="ml-2 px-3 py-1 bg-red-700 text-white rounded">Click</button> */}
                                                    </div>
                                                )}
                                            </Link>
                                            {/* Items Childrens */}
                                            {item?.children?.length > 0 && (
                                                <ul>
                                                    {item?.children.map((child, idx) => (
                                                        <li key={child.id || `${child.title}-${idx}`} className="py-1 hover:text-gray-900 dark:hover:text-red-600">
                                                            <Link
                                                                href={child.path !== "/studio" ? `/${props?.lang + child?.path}` : "/studio"}
                                                                target={child.path !== "/studio" ? "" : "_blank"}
                                                            >
                                                                {child?.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                    {/* SOCIAL MEDIA */}
                    <div className="gap-4 flex-wrap flex justify-between p-2">
                        <div>
                            <ul className="space-x-3 mt-6 mb-6 Lg:mb-0">
                                {props?.social.map((item, index) => (
                                    <li className="inline-block" key={item.id || `${item.title}-${index}`}>
                                        <div className="hover:text-gray-800 dark:hover:text-red-600">
                                            <SocialLink
                                                key={item.id || `${item.title}-${index}`}
                                                platform={`${item.media}`}
                                                link={item.url} />
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </div>
                        {/* UBICACION COMPONENTE */}
                        <div>
                            {/* <div className="text-sm text-neutral-400 ">{dictionary.footer.textRight}</div> */}
                            <Link href={props?.googleLink} target="_blank">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white  text-black rounded-md shadow-md hover:bg-red-100 ">
                                    <div className="w-2 h-2 rounded-full  bg-green-500 hover:bg-green-700"></div>
                                    {props?.location}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* COPYRIGHT */}
            <>
                <div className="text-sm text-center">
                    Copyright © {new Date().getFullYear()} {props?.copyright}. All
                    rights reserved.
                </div>

                <div className="flex items-center justify-center mt-2">
                    <ThemeSwitch />
                </div>
            </>

        </Container>
    )
}


