// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import { useMutation } from "@tanstack/react-query";
// import {
//   Col,
//   Divider,
//   Form,
//   FormInstance,
//   Row,
//   Select,
//   Switch,
//   Upload,
//   message,
//   notification,
// } from "antd";
// import { RadioGroup } from "@headlessui/react";
// import {
//   DocumentArrowUpIcon,
//   DocumentTextIcon,
//   GlobeAltIcon,
//   InboxIcon,
// } from "@heroicons/react/24/outline";
// import React from "react";
// import { availableEmbeddingTypes } from "../../utils/embeddings";
// import { availableChatModels } from "../../utils/chatModels";
// import { SpiderIcon } from "../Common/SpiderIcon";
// import { GithubIcon } from "../Common/GithubIcon";
// import axios from "axios";

import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function NewBody() {
  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create New Bot
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Create a new chatbot you prefer. You can change the settings later.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    workcation.com/
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about yourself.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <UserCircleIcon
                  className="h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cover photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Notifications
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We'll always let you know about important changes, but you pick what
            else you want to hear about.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                By Email
              </legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-gray-900"
                    >
                      Comments
                    </label>
                    <p className="text-gray-500">
                      Get notified when someones posts a comment on a posting.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="candidates"
                      className="font-medium text-gray-900"
                    >
                      Candidates
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate applies for a job.
                    </p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="offers"
                      className="font-medium text-gray-900"
                    >
                      Offers
                    </label>
                    <p className="text-gray-500">
                      Get notified when a candidate accepts or rejects an offer.
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">
                Push Notifications
              </legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                These are delivered via SMS to your mobile phone.
              </p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-everything"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-everything"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Everything
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-email"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Same as email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="push-nothing"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </>
  );
  //   const navigate = useNavigate();
  //   const [selectedSource, setSelectedSource] = useState<any>({
  //     id: 1,
  //     value: "Website",
  //   });
  //   const [form] = Form.useForm();
  //   const [availableSources] = React.useState([
  //     {
  //       id: 1,
  //       value: "website",
  //       title: "Webpage",
  //       icon: GlobeAltIcon,
  //       formComponent: (
  //         <Form.Item
  //           name="content"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter the webpage URL",
  //             },
  //           ]}
  //         >
  //           <input
  //             type="url"
  //             placeholder="Enter the webpage URL"
  //             className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //           />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       id: 3,
  //       value: "text",
  //       title: "Text",
  //       icon: DocumentTextIcon,
  //       formComponent: (
  //         <Form.Item
  //           name="content"
  //           rules={[
  //             {
  //               required: true,
  //               message: "Please enter the text",
  //             },
  //           ]}
  //         >
  //           <textarea
  //             placeholder="Enter the text"
  //             className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //           />
  //         </Form.Item>
  //       ),
  //     },
  //     {
  //       id: 2,
  //       value: "file",
  //       title: "File (beta)",
  //       icon: DocumentArrowUpIcon,
  //       formComponent: (
  //         <>
  //           <Form.Item
  //             name="file"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: `Please upload your files (PDF, Docx, CSV, TXT, MP3, MP4)`,
  //               },
  //             ]}
  //             getValueFromEvent={(e) => {
  //               console.log("Upload event:", e);
  //               if (Array.isArray(e)) {
  //                 return e;
  //               }
  //               return e?.fileList;
  //             }}
  //           >
  //             <Upload.Dragger
  //               accept={`.pdf,.docx,.csv,.txt,.mp3,.mp4`}
  //               multiple={true}
  //               maxCount={10}
  //               beforeUpload={(file) => {
  //                 const allowedTypes = [
  //                   "application/pdf",
  //                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //                   "text/csv",
  //                   "text/plain",
  //                   "audio/mpeg",
  //                   "audio/mp4",
  //                   "video/mp4",
  //                   "video/mpeg",
  //                 ]
  //                   .map((type) => type.toLowerCase())
  //                   .join(", ");

  //                 console.log("file type:", file.type.toLowerCase());

  //                 if (!allowedTypes.includes(file.type.toLowerCase())) {
  //                   message.error(
  //                     `File type not supported. Please upload a ${allowedTypes} file.`
  //                   );
  //                   return Upload.LIST_IGNORE;
  //                 }

  //                 // if video or audio
  //                 if (
  //                   file.type.toLowerCase().includes("audio") ||
  //                   file.type.toLowerCase().includes("video")
  //                 ) {
  //                   message.warning(
  //                     `Currently, Only support video and audio files with English audio`
  //                   );
  //                 }

  //                 return false;
  //               }}
  //             >
  //               <div className="p-3">
  //                 <p className="ant-upload-drag-icon justify-center flex">
  //                   <InboxIcon className="h-10 w-10 text-gray-400" />
  //                 </p>
  //                 <p className="ant-upload-text">
  //                   Click or drag PDF, Docx, CSV , TXT, MP3, MP4 files to this
  //                 </p>
  //                 <p className="ant-upload-hint">
  //                   Support is available for a single or bulk upload of up to 10
  //                   files. Please note that file upload is in beta, so if you
  //                   encounter any issues, kindly report them.
  //                 </p>
  //               </div>
  //             </Upload.Dragger>
  //           </Form.Item>
  //           <p className="text-sm text-gray-500">
  //             If you find any issues, please report them on{" "}
  //             <a
  //               href={`https://github.com/n4ze3m/dialoqbase/issues/new?title=file%20upload%20issue&type=bug&labels=bug`}
  //               target="_blank"
  //               rel="noreferrer"
  //               className="font-medium text-indigo-600 hover:text-indigo-500"
  //             >
  //               GitHub
  //             </a>
  //             .
  //           </p>
  //         </>
  //       ),
  //     },
  //     {
  //       id: 4,
  //       value: "crawl",
  //       title: "Crawler (beta)",
  //       icon: SpiderIcon,
  //       formComponent: (
  //         <>
  //           <Form.Item
  //             name="content"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please enter the website URL",
  //               },
  //             ]}
  //           >
  //             <input
  //               type="url"
  //               placeholder="Enter the website URL"
  //               className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //             />
  //           </Form.Item>
  //           <Form.Item
  //             name="maxDepth"
  //             help="The max depth of the website to crawl"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please input max depth!",
  //               },
  //             ]}
  //           >
  //             <input
  //               type="number"
  //               placeholder="Enter the max depth"
  //               className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //             />
  //           </Form.Item>

  //           <Form.Item
  //             name="maxLinks"
  //             help="The max links to crawl"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please input max links count",
  //               },
  //             ]}
  //           >
  //             <input
  //               type="number"
  //               placeholder="Enter the max depth"
  //               className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //             />
  //           </Form.Item>

  //           <p className="text-sm text-gray-500">
  //             If you find any issues, please report them on{" "}
  //             <a
  //               href="https://github.com/n4ze3m/dialoqbase/issues/new?title=Crawler%20issue&labels=bug"
  //               target="_blank"
  //               rel="noreferrer"
  //               className="font-medium text-indigo-600 hover:text-indigo-500"
  //             >
  //               GitHub
  //             </a>
  //             .
  //           </p>
  //         </>
  //       ),
  //     },
  //     {
  //       id: 6,
  //       value: "github",
  //       title: "GitHub (beta)",
  //       icon: GithubIcon,
  //       formComponent: (
  //         <>
  //           <Form.Item
  //             name="content"
  //             rules={[
  //               {
  //                 required: true,
  //                 message: "Please enter the public github repo URL",
  //               },
  //               {
  //                 pattern: new RegExp(
  //                   "^(https?://)?(www.)?github.com/([a-zA-Z0-9-]+)/([a-zA-Z0-9-]+)(.git)?$"
  //                 ),
  //                 message: "Please enter a valid public github repo URL",
  //               },
  //             ]}
  //           >
  //             <input
  //               type="url"
  //               placeholder="Enter the github repo URL"
  //               className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //             />
  //           </Form.Item>
  //           <Row gutter={16}>
  //             <Col span={12}>
  //               <Form.Item
  //                 name={["options", "branch"]}
  //                 label="Branch"
  //                 rules={[
  //                   {
  //                     required: true,
  //                     message: "Please input branch",
  //                   },
  //                 ]}
  //               >
  //                 <input
  //                   type="text"
  //                   placeholder="Enter the branch"
  //                   className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
  //                 />
  //               </Form.Item>
  //             </Col>
  //             <Col span={12}>
  //               <Form.Item label="Private repo?" name={["options", "is_private"]}>
  //                 <Switch className="mr-2" />
  //               </Form.Item>
  //             </Col>
  //           </Row>

  //           <p className="text-sm text-gray-500">
  //             If you find any issues, please report them on{" "}
  //             <a
  //               href="https://github.com/n4ze3m/dialoqbase/issues/new?title=Github%20issue&labels=bug"
  //               target="_blank"
  //               rel="noreferrer"
  //               className="font-medium text-indigo-600 hover:text-indigo-500"
  //             >
  //               GitHub
  //             </a>
  //             .
  //           </p>
  //         </>
  //       ),
  //     },
  //   ]);

  //   const onSubmit = async (values: any) => {
  //     if (selectedSource.id == 2 || selectedSource.id == 5) {
  //       const formData = new FormData();
  //       values.file.forEach((file: any) => {
  //         formData.append("file", file.originFileObj);
  //       });
  //       const response = await api.post(
  //         `/bot/upload?embedding=${values.embedding}&model=${values.model}`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       return response.data;
  //     }
  //     const response = await api.post("/bot", {
  //       type: selectedSource.value.toLowerCase(),
  //       ...values,
  //     });
  //     return response.data;
  //   };
  //   const { mutateAsync: createBot, isLoading } = useMutation(onSubmit, {
  //     onSuccess: (data: any) => {
  //       navigate(`/bot/${data.id}`);
  //     },
  //     onError: (e) => {
  //       console.log(e);
  //       if (axios.isAxiosError(e)) {
  //         const message =
  //           e.response?.data?.message ||
  //           e?.response?.data?.error ||
  //           "Something went wrong.";
  //         notification.error({
  //           message: "Error",
  //           description: message,
  //         });
  //         return;
  //       }

  //       notification.error({
  //         message: "Error",
  //         description: "Something went wrong.",
  //       });
  //     },
  //   });
  //   // @ts-ignore
  //   function classNames(...classes) {
  //     return classes.filter(Boolean).join(" ");
  //   }
  //   const embeddingType = Form.useWatch("embedding", form);
  //   return (
  //     <>
  //       <Form
  //         layout="vertical"
  //         onFinish={createBot}
  //         form={form}
  //         className="space-y-6"
  //         initialValues={{
  //           embedding: "openai",
  //           model: "gpt-3.5-turbo",
  //           maxDepth: 2,
  //           maxLinks: 10,
  //           options: {
  //             branch: "main",
  //             is_private: false,
  //           },
  //         }}
  //       >
  //         <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
  //           <div className="md:grid mb-6 md:grid-cols-3 md:gap-6">
  //             <div className="md:col-span-1">
  //               <h3 className="text-xl font-bold leading-6 text-gray-900">
  //                 Create a bot
  //               </h3>
  //               <p className="mt-1 text-xs text-gray-500">
  //                 Create a chatbot with your preferred source and models.
  //               </p>
  //             </div>
  //           </div>
  //           <div className="mt-5 space-y-3 md:col-span-2 md:mt-0">
  //             <div className="grid grid-cols-3 gap-6">
  //               <div className="col-span-3 sm:col-span-2 space-y-6">
  //                 <Form.Item
  //                   label={
  //                     <span className="font-medium text-gray-800 text-sm">
  //                       Chat Model
  //                     </span>
  //                   }
  //                   name="model"
  //                 >
  //                   <Select
  //                     placeholder="Select a chat model"
  //                     options={availableChatModels}
  //                   />
  //                 </Form.Item>
  //               </div>
  //             </div>
  //             <Form.Item noStyle>
  //               <Divider />
  //             </Form.Item>
  //             <div className="grid grid-cols-3 gap-6">
  //               <div className="col-span-3 sm:col-span-2 space-y-6">
  //                 <Form.Item
  //                   label={
  //                     <span className="font-medium text-gray-800 text-sm">
  //                       Embedding model
  //                     </span>
  //                   }
  //                   name="embedding"
  //                   hasFeedback={embeddingType === "tensorflow"}
  //                   help={
  //                     embeddingType === "tensorflow"
  //                       ? "TensorFlow embeddings can be slow and memory-intensive."
  //                       : null
  //                   }
  //                   validateStatus={
  //                     embeddingType === "tensorflow" ? "warning" : undefined
  //                   }
  //                 >
  //                   <Select
  //                     placeholder="Select an embedding method"
  //                     options={availableEmbeddingTypes}
  //                   />
  //                 </Form.Item>
  //               </div>
  //             </div>
  //             <Form.Item noStyle>
  //               <Divider />
  //             </Form.Item>
  //             <div className="grid grid-cols-3 gap-6">
  //               <div className="col-span-3 sm:col-span-2 space-y-6">
  //                 <RadioGroup
  //                   value={selectedSource}
  //                   onChange={(e: any) => {
  //                     setSelectedSource(e);
  //                   }}
  //                 >
  //                   <RadioGroup.Label className="block text-sm font-medium text-gray-700">
  //                     Select a data source
  //                   </RadioGroup.Label>

  //                   <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
  //                     {availableSources.map((source) => (
  //                       <RadioGroup.Option
  //                         key={source.id}
  //                         value={source}
  //                         className={({ checked, active }) =>
  //                           classNames(
  //                             checked ? "border-transparent" : "border-gray-300",
  //                             active
  //                               ? "border-indigo-500 ring-2 ring-indigo-500"
  //                               : "",
  //                             "relative  items-center justify-center flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
  //                           )
  //                         }
  //                       >
  //                         {({ checked, active }) => (
  //                           <>
  //                             <span className="flex-shrink-0 flex items-center justify-centerrounded-lg">
  //                               <RadioGroup.Label
  //                                 as="span"
  //                                 className="block text-sm font-medium text-gray-900"
  //                               >
  //                                 <source.icon
  //                                   className="h-6 w-6 mr-3"
  //                                   aria-hidden="true"
  //                                 />
  //                               </RadioGroup.Label>
  //                               {source.title}
  //                             </span>

  //                             <span
  //                               className={classNames(
  //                                 active ? "border" : "border-2",
  //                                 checked
  //                                   ? "border-indigo-500"
  //                                   : "border-transparent",
  //                                 "pointer-events-none absolute -inset-px rounded-lg"
  //                               )}
  //                               aria-hidden="true"
  //                             />
  //                           </>
  //                         )}
  //                       </RadioGroup.Option>
  //                     ))}
  //                   </div>
  //                 </RadioGroup>

  //                 {selectedSource.formComponent}
  //               </div>
  //             </div>

  //             <Form.Item noStyle>
  //               <Divider />
  //             </Form.Item>
  //           </div>
  //           <div className="px-4 py-3 text-right sm:px-6">
  //             <button
  //               type="submit"
  //               className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
  //             >
  //               Save
  //             </button>
  //           </div>
  //         </div>
  //       </Form>
  //     </>
  //   );
}
