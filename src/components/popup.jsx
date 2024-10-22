import React, { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useLocation } from "@reach/router"

const Example = React.memo(({ iframeUrl, linkTitle }) => {
  // Memo para evitar renders innecesarios
  let [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)
  const location = useLocation()

  const getLinkClass = to => {
    return location.pathname !== to
      ? "transition ease-in-out drop-shadow-[1px_1px_rgba(0,0,0)] text-[#f6cc4d] relative before:content-[''] before:absolute before:bottom-0 before:top-8 before:left-0 before:right-0 before:h-[3px] before:rounded-3xl before:bg-[#f6cc4d]"
      : "mt-4 drop-shadow-[1px_1px_rgba(0,0,0)] transition ease-in-out text-white hover:cursor-pointer hover:text-[#f6cc4d] relative before:content-[''] before:absolute before:bottom-0 before:top-8 before:left-0 before:right-0 before:h-[3px] before:rounded-3xl before:bg-[#f6cc4d] before:scale-x-0 hover:before:scale-x-100 before:origin-center before:transition-transform before:duration-300 before:ease-in-out sm:mr-10 lg:mt-0"
  }

  return (
    <>
      {/* Enlace que abre el modal */}
      <button
        onClick={e => {
          e.preventDefault() // Evitar el comportamiento predeterminado del enlace
          setOpen(true) // Abrir el modal
        }}
        className={`${getLinkClass(location.pathname)} block`}
      >
        {linkTitle} {/* Usa el título pasado como prop */}
      </button>

      {/* Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative p-2 overflow-hidden text-right transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-[600px] w-full max-w-full">
                  <button
                    type="button"
                    ref={cancelButtonRef}
                    className="p-1 m-[5px_5px_4px] text-base font-medium text-red-600 border border-transparent rounded-md shadow-sm 2xl:inline-flex bg-white-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                  <div className="sm:text-left">
                    {open && ( // Solo carga el iframe si el modal está abierto
                      <iframe
                        src={iframeUrl} // Usa la URL pasada como prop
                        title="Cookie Policy"
                        className="w-full h-full border-none"
                        style={{ width: "100%", height: "750px" }}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
})

export default Example
