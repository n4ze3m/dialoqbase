import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  GlobeAltIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const availableSources = [
  { id: 1, title: "Website", icon: GlobeAltIcon },
  { id: 2, title: "PDF", icon: DocumentArrowUpIcon },
  { id: 3, title: "Text", icon: DocumentTextIcon },
];
// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewRoot() {
  const [selectedSource, setSelectedSource] = useState(availableSources[0]);

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create a new bot
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <RadioGroup value={selectedSource} onChange={setSelectedSource}>
                <RadioGroup.Label className="text-base font-medium text-gray-800">
                  Select a data source
                </RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  {availableSources.map((source) => (
                    <RadioGroup.Option
                      key={source.id}
                      value={source}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? "border-transparent" : "border-gray-300",
                          active
                            ? "border-indigo-500 ring-2 ring-indigo-500"
                            : "",
                          "relative  items-center justify-center flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex-shrink-0 flex items-center justify-centerrounded-lg">
                            <RadioGroup.Label
                              as="span"
                              className="block text-sm font-medium text-gray-900"
                            >
                              <source.icon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </RadioGroup.Label>
                            {source.title}
                          </span>

                          <span
                            className={classNames(
                              active ? "border" : "border-2",
                              checked
                                ? "border-indigo-500"
                                : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-lg"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              {selectedSource.id == 1 ? (
                <input
                  type="url"
                  placeholder="Enter the website URL"
                  className="mt-4 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              ) : null}
              {selectedSource.id == 2 ? (
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF</p>
                  </div>
                </div>
              ) : null}

              {selectedSource.id == 3 ? (
                <textarea
                  placeholder="Enter the text"
                  className="mt-4 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                />
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
