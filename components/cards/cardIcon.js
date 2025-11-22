import { BanknotesIcon, FolderMinusIcon, PresentationChartLineIcon } from "@heroicons/react/24/solid"


export default function CardIcon(props) {
  const { data } = props || {};

  const iconsChange = (icon) => {

    switch (icon) {
      case "folderMinus":
        return <FolderMinusIcon className="w-12 h-12 mb-4 text-gray-900 dark:text-white" />;
      case "banknotes":
        return <BanknotesIcon className="w-12 h-12 mb-4 text-gray-900 dark:text-white" />;
      case "presentationChartLine":
        return <PresentationChartLineIcon className="w-12 h-12 mb-4 text-gray-900 dark:text-white" />
      default:
        return "";
    }

  }


  return (
    <div className="group cursor-pointer relative  overflow-hidden transition-all hover:scale-105 
      dark:bg-gray-80 mt-6 text-gray-700 dark:bg-slate-500 dark:text-white bg-white shadow-md
       bg-clip-border rounded-xl ">
      <div className="p-6">
        {iconsChange(data.iconString)}

        <h5 className="block mb-2 text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          {data.title}
        </h5>
        <p className="block text-base antialiased font-light leading-relaxed text-inherit">
          {data.description}
        </p>
      </div>
      <div className="p-6 pt-0">
        {data.link && (
          <a href={data.link} className="inline-block" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold dark:text-white text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
              type="button"
            >
              {props.lang === "en" ? "Visit Link" : "Visitar Enlace"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
              </svg>
            </button>
          </a>
        )}

        {data.attachmentUrl && (
          <a href={data.attachmentUrl} className="inline-block" target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold dark:text-white text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
              type="button"
            >
              {props.lang === "en" ? "Download File" : "Descargar Archivo"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
              </svg>
            </button>
          </a>
        )}
      </div>
    </div>
  )
  
}

