"use client";

import { Fragment } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/all";
import { urlForImage } from "@/lib/sanity/image";
import Image, { type ImageProps } from "next/image";
import LangSwitcher from "../generalUse/lang-switcher";
import SmartLink from "@/utils/smartLinks"

export default function Navbar({ lang, data, logo, logoalt, title, shopLink, shopText }: any) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === `/${lang}${href}`;
  
  return (
    <Disclosure as="nav" className="container-full bg-brand/25 dark:bg-brand-dark/25 border-b border-brand-light sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 items-center justify-between">

              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href={`/${lang}`} className="flex items-center">
                  {logo?.navbarMenu && urlForImage(logo)?.src ? (
                    <Image
                      {...(urlForImage(logo) as ImageProps)}
                      alt="Logo Light"
                      width={120}
                      height={40}
                      priority
                      className="h-12 w-auto sm:h-10 object-contain dark:hidden"
                    />
                  ) : (
                    <h2 className="md:text-5xl text-2xl font-bold text-brand-black hover:text-brand-dark dark:hidden">{title}</h2>
                  )}
                  {logoalt?.navbarMenuAlt && urlForImage(logoalt)?.src ? (
                    <Image
                      {...(urlForImage(logoalt) as ImageProps)}
                      alt="Logo Dark"
                      width={120}
                      height={40}
                      priority
                      className="hidden dark:block h-12 w-auto sm:h-10 object-contain"
                    />
                  ) : (
                    <h2 className="hidden dark:block md:text-5xl text-2xl font-bold text-brand-light hover:text-brand">{title}</h2>
                  )}
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex flex-1 items-center justify-center space-x-8">
                {data.map((item: any, index: number) => (
                  item.children?.length > 0 ? (                    
                    <Dropdown key={index} item={item} lang={lang} isActive={isActive} />
                  ) : (
                    <Link
                      key={index}
                      href={`/${lang}${item.href}`}
                      className={cx(
                        "md:text-xl sm:text-lg font-bold tracking-wide",
                        isActive(item.href)
                          ? "dark:text-brand text-brand-dark "
                          : "text-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand"
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>

              {/* Right Actions */}
              <div className="hidden md:flex items-center gap-6">
                <LangSwitcher locale={lang} />
                <SmartLink
                  href={shopLink}
                  lang={lang}
                  className="bg-brand-black px-4 py-2 text-sm uppercase text-brand-light hover:text-brand-dark dark:hover:text-brand"
                >
                  {shopText}
                </SmartLink>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand focus:outline-none">
                  {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                </DisclosureButton>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="md:hidden bg-brand-dark/5 border-t border-brand-light">
            <div className="space-y-1 px-4 pt-4 pb-3">
              {data.map((item: any, index: number) => (
                item.children?.length > 0 ? (
                  <MobileDropdown key={index} item={item} lang={lang} />
                ) : (
                  <Link
                    key={index}
                    href={`/${lang}${item.href}`}
                    className={cx(
                      "block text-lg font-bold tracking-wide py-2",
                      isActive(item.href)
                        ? "text-brand"
                        : "text-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              ))}

              {/* Lang Shwitcher */}
              <LangSwitcher locale={lang} />

              {/* Mobile CTA */}
              <SmartLink
                href={shopLink}
                lang={lang}
                className="mt-2 block w-full bg-brand-black px-4 py-2 text-center text-lg uppercase text-brand-light hover:text-brand-dark dark:hover:text-brand"
              >
                {shopText}
              </SmartLink>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}

// Desktop dropdown
function Dropdown({ item, lang, isActive }: any) {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton
            className={cx(
              "md:text-xl sm:text-lg font-bold tracking-wide flex items-center gap-1",
              isActive(item.href) ? "bg-gray-100 text-brand" : "text-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand"
            )}
          >
            {item.label}
            {!open ? <ChevronDownIcon className="h-4 w-4 mt-0.5" /> : <ChevronUpIcon className="h-4 w-4 mt-0.5" />}
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute font-bold mt-2 w-40 origin-top-left bg-brand-light border border-brand-light shadow-lg rounded-md focus:outline-none z-20">
              {item.children.map((child: any, idx: number) => (
                <MenuItem key={idx}>
                  {({ active }) => (
                    <Link
                      href={`/${lang}${child.path}`}
                      className={cx(
                        "block px-4 py-2 text-sm",
                        active ? "bg-gray-100 text-brand-black hover:text-brand-dark" : "dark:text-brand-black  dark:hover:text-brand"
                      )}
                    >
                      {child.title}
                    </Link>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
}

// Mobile dropdown
function MobileDropdown({ item, lang }: any) {
  return (
    <Disclosure as="div" className="flex flex-col">
      {({ open }) => (
        <>
          <DisclosureButton className="flex justify-between w-full py-2 text-lg font-bold text-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand">
            {item.label}
            <ChevronDownIcon className={cx("h-4 w-4 transition-transform", open && "rotate-180")} />
          </DisclosureButton>
          <DisclosurePanel className="pl-4">
            {item.children.map((child: any, idx: number) => (
              <Link
                key={idx}
                href={`/${lang}${child.path}`}
                className="block py-2 text-lg font-bold ttext-brand-black hover:text-brand-dark dark:text-brand-light  dark:hover:text-brand"
              >
                {child.title}
              </Link>
            ))}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
