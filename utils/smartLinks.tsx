import Link from "next/link";

type SmartLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  lang?: string;
};

export default function SmartLink({ href, children, className, lang }: SmartLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("www");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={`/${lang}${href}`} className={className}>
      {children}
    </Link>
  );
}
