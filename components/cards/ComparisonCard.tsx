import Link from "next/link"
import { cx } from "@/utils/all";

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  teal: 'bg-teal-400',
  orange: 'bg-orange-400',
  // add more as needed
};

const textMap: Record<string, string> = {
  blue: 'text-blue-500',
  red: 'text-red-500',
  green: 'text-green-500',
  yellow: 'text-yellow-400',
  teal: 'text-teal-400',
  orange: 'text-orange-400',
  // add more as needed
};

export default function ComparisonCard({ title, category, color = 'bg-blue-500', textColor = 'text-black', link }:
  { title?: string, category?: string, color?: string, textColor?: string, link?: string }) {

  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-500">
      <Link href={link || "/"}>
        <div className="flex items-center space-x-4">
          {/* Vertical colored line */}
          <div
            className={cx(
              'h-10 w-1.5 rounded-full',
              colorMap[color] || 'bg-blue-500'
            )}
          ></div>


          <div className="text-left">
            <h3 className="text-sm font-semibold dark:text-black text-gray-600">{category}</h3>
            <p className={cx('text-lg font-bold dark:text-black',
              textMap[color] || 'bg-blue-500')}>{title}</p>
          </div>
        </div>
      </Link>
      <Link href={link || "/"}>
        <div className="text-blue-600 text-lg font-medium">
          &rarr;
        </div>
      </Link>

    </div>
  );
}