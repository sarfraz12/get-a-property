import Link from "next/link";
import Label from "@/components/ui/label";

export default function CategoryLabel({
  lang,
  categories,
  nomargin = false
}) {

  return (

    <div className="flex gap-3">
      {categories?.length &&
        categories.map((category, index) => (
          <Link
            href={`${!lang?"": "/" + lang}/${category.slug.current}`}
            // href={"#"}
            key={index}>
            <Label nomargin={nomargin} color={category.color}>
              {category.title}

            </Label>
          </Link>
        )) 
        // categories.map((category, index) => (
        // <Link
        //   // href={`/category/${category.slug.current}`}
        //   href={"#"}
        // >
        //   <Label nomargin={nomargin} color={category.color ? category.color : 'green'}>
        //     {category.title}
        //   </Label>
        // </Link>
        // ))
      }
    </div>
  );
}
