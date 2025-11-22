import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

export const Backlink = (props: {linkValue: string}) => {
    const {linkValue} = props

    return (
        <div>
            <a
                href={linkValue}
                target="_blank"
                rel="noopener"
                className="fixed flex items-center justify-center px-3 py-1 space-x-2 font-sans text-sm font-semibold text-gray-900 bg-white border border-gray-300 rounded shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 right-5 bottom-5 z-22"
            >
                <ChatBubbleBottomCenterTextIcon width={30} height={30} viewBox="0 0 30 30" fill="#388E3C" className="w-6 h-6" />
                <span> Whatsapp ↗</span>
            </a>
        </div>
    );
};