import { useForm } from "react-hook-form";
import {
  Message,
  Content,
  createMessageForm,
  createContentForm,
} from "../types";
import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Swal from "sweetalert2";
import axios from "axios";
import { CreateContentProps } from "../interfaces";

const CreateContent: React.FC<CreateContentProps> = ({
  isOpen,
  setOpen,
  setReFetch,
  contentToEdit,
  contentToClone,
  removeDefaultContent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageOnEdit, setMessageOnEdit] = useState<number>(0);

  const {
    register: registerContent,
    handleSubmit: handleSubmitContent,
    reset: resetContent,
    watch: watchContent,
    setError: setErrorContent,
    clearErrors: clearErrorsContent,
    formState: { errors: errorsContent },
  } = useForm<createContentForm>();
  const {
    register: registerMessage,
    handleSubmit: handleSubmitMessage,
    reset: resetMessage,
    watch: watchMessage,
    setError: setErrorMessage,
    clearErrors: clearErrorsMessage,
    formState: { errors: errorsMessage },
  } = useForm<createMessageForm>();

  useEffect(() => {
    setMessages(contentToEdit?.messages || contentToClone?.messages || []);
    resetContent({
      campaign: contentToEdit?.campaign || contentToClone?.campaign || "",
      countryCode:
        contentToEdit?.countryCode || contentToClone?.countryCode || "",
      description:
        contentToEdit?.description || contentToClone?.description || "",
      messageActive:
        contentToEdit?.messageActive || contentToClone?.messageActive || true,
    });
  }, [isOpen]);

  const onSubmitContent = (data: createContentForm) => {
    if (contentToEdit) {
      const editedContent: Content = {
        messageId: contentToEdit.messageId,
        updateDate: new Date().toISOString().substr(0, 10),
        campaign: data.campaign,
        countryCode: data.countryCode,
        description: data.description,
        messageActive: data.messageActive,
        createdBy: "Mouhcine Daali",
        messages: [...messages],
      };

      axios
        .patch(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys/" +
            contentToEdit.messageId,
          editedContent
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    } else {
      const newContent: Content = {
        updateDate: new Date().toISOString().substr(0, 10),
        campaign: data.campaign,
        countryCode: data.countryCode,
        createdBy: "Mouhcine Daali",
        description: data.description,
        messageActive: data.messageActive,
        messages: [...messages],
      };
      axios
        .post(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys",
          newContent
        )
        .then((res) => {
          setReFetch();
          if (res.data.statusCode == 200) {
            const responseMessage = JSON.parse(res.data.body);
            Swal.fire({
              position: "center",
              icon: "success",
              title: responseMessage.message,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Something Went Wrong",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    }
    cancel(false);
  };
  const onSubmitMessage = (data: createMessageForm) => {
    if (data.messageNumber) {
      const newMessage: Message = {
        messageNumber: data.messageNumber,
        messageName: data.messageName,
        messageText: data.messageText,
      };

      // edit message in messages array and update the state with the new array of messages with the edited message and the same order
      setMessages(
        messages.map((message) => {
          if (message.messageNumber === data.messageNumber) {
            return newMessage;
          } else {
            return message;
          }
        })
      );
      setMessageOnEdit(0);
    } else {
      const newMessage: Message = {
        messageNumber: messages.length + 1,
        messageName: data.messageName,
        messageText: data.messageText,
      };

      setMessages([...messages, newMessage]);
    }
    resetMessage({ messageName: "", messageText: "" });
  };

  const editMessage = (messageNumber: number) => {
    setMessageOnEdit(messageNumber);
    const message = messages.find(
      (message) => message.messageNumber === messageNumber
    );
    if (message) {
      resetMessage({
        messageNumber: message.messageNumber,
        messageName: message.messageName,
        messageText: message.messageText,
      });
    }
  };
  const cancelEdit = () => {
    setMessageOnEdit(0);
    resetMessage({ messageName: "", messageText: "" });
  };
  const removeMessage = (messageNumber: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // remove message from messages array and update the state with the new array of messages with the removed message and the same order and update the message numbers
        const newMessages = messages.filter(
          (message) => message.messageNumber !== messageNumber
        );
        setMessages(
          newMessages.map((message, index) => {
            return { ...message, messageNumber: index + 1 };
          })
        );
        console.log(messages);
        Swal.fire("Removed!", "Your message has been removed.", "success");
      }
    });
  };

  const cancel = (validation: boolean) => {
    if (
      validation &&
      (messages.length > 0 ||
        watchContent("campaign") ||
        watchContent("countryCode") ||
        watchContent("description") ||
        watchContent("messageActive"))
    ) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          resetContent({
            countryCode: "",
            campaign: "",
            description: "",
          });
          resetMessage({ messageName: "", messageText: "" });
          setMessages([]);
          setOpen();
          messageOnEdit && setMessageOnEdit(0);
          if (contentToEdit || contentToClone) {
            removeDefaultContent();
          }
          Swal.fire(
            "Canceled!",
            "Your operation has been canceled.",
            "success"
          );
        }
      });
    } else {
      resetContent({
        countryCode: "",
        campaign: "",
        description: "",
      });
      resetMessage({ messageName: "", messageText: "" });
      setMessages([]);
      setOpen();
      messageOnEdit && setMessageOnEdit(0);
    }
  };

  return (
    <div
      className={`h-[90vh] sm:h-[85vh] w-screen sm:w-[90vw] flex flex-col gap-y-3 px-5 py-8 sm:p-10 rounded-t-3xl bg-gray-400 fixed z-30 ${
        !isOpen ? "-bottom-full" : "-bottom-0"
      } transition-all ease-out duration-500 left-1/2 -translate-x-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28 rounded-full absolute top-2 left-1/2 -translate-x-1/2'></div>
      <form onSubmit={handleSubmitContent(onSubmitContent)}>
        <div className='w-full flex justify-between items-center'>
          <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
            {contentToEdit ? "Edit Content" : "Create Content"}
          </h3>
          <div className='flex gap-x-2'>
            <button
              type='submit'
              className='relative px-5 py-2.5 overflow-hidden font-medium text-green-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-green-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-green-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-green-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                {contentToEdit ? "Save" : "Create"}
              </span>
            </button>
            <button
              type='button'
              onClick={() => cancel(true)}
              className='relative px-5 py-2.5 overflow-hidden font-medium text-red-500 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group'>
              <span className='absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-red-400 group-hover:w-full ease'></span>
              <span className='absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-red-400 group-hover:h-full ease'></span>
              <span className='absolute inset-0 w-full h-full duration-300 delay-300 bg-red-500 opacity-0 group-hover:opacity-100'></span>
              <span className='relative transition-colors duration-300 delay-200 group-hover:text-white ease'>
                Cancel
              </span>
            </button>
          </div>
        </div>
        <div className='w-full h-fit flex flex-col gap-y-3 bg-gray-50 rounded-lg p-5 pb-8 mt-5'>
          <p className='text-gray-800 text-sm font-medium'>
            1. Start with setting up your content information
          </p>
          <div className='flex flex-col gap-y-8'>
            <div className='flex max-md:flex-col gap-x-5'>
              <div className='w-5/5 md:w-3/5 flex gap-x-5'>
                <div className='w-3/4 max-md:w-full relative mt-2'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsContent.campaign
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsContent.campaign
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='text'
                    id='campaign'
                    {...registerContent("campaign", {
                      required: true,
                    })}
                  />
                  <label
                    htmlFor='campaign'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Campaign
                  </label>
                  {errorsContent.campaign && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsContent.campaign.type === "required"
                        ? "This field is required"
                        : errorsContent.campaign.message}
                    </p>
                  )}
                </div>
                <div className='w-1/4'>
                  <label className='flex flex-col gap-y-1 cursor-pointer select-none items-center'>
                    <i className='text-gray-800 text-sm font-medium'>
                      Is Active
                    </i>
                    <div className='relative'>
                      <input
                        type='checkbox'
                        id='messageActive'
                        {...registerContent("messageActive")}
                        className='sr-only'
                      />
                      <div className='h-5 w-14 rounded-full bg-[#E5E7EB] shadow-inner'></div>
                      <div
                        className={`shadow-md absolute -top-1 flex h-7 w-7 items-center justify-center rounded-full transition-all ease-linear duration-200 ${
                          watchContent("messageActive")
                            ? "!bg-white left-1/2"
                            : "bg-white left-0"
                        }`}>
                        <span
                          className={`active h-4 w-4 rounded-full  ${
                            watchContent("messageActive")
                              ? "bg-blue-500"
                              : "bg-[#E5E7EB]"
                          }`}></span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className='w-2/5 max-md:mt-10 gap-x-5  max-md:w-full'>
                <div className='w-3/4 max-md:w-full relative mt-2'>
                  <input
                    className={`peer h-full w-full border-b ${
                      errorsContent.countryCode
                        ? "border-red-200"
                        : "border-gray-200"
                    } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                      errorsContent.countryCode
                        ? "placeholder-shown:border-red-200"
                        : "placeholder-shown:border-gray-200"
                    } focus:border-green-500 focus:outline-0 disabled:border-0`}
                    placeholder=' '
                    type='text'
                    id='countryCode'
                    {...registerContent("countryCode", {
                      required: true,
                    })}
                  />
                  <label
                    htmlFor='countryCode'
                    className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                    Country Code
                  </label>
                  {errorsContent.countryCode && (
                    <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                      {errorsContent.countryCode.type === "required"
                        ? "This field is required"
                        : errorsContent.countryCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full relative'>
              <textarea
                className={`peer h-full w-full border-b ${
                  errorsContent.description
                    ? "border-red-200"
                    : "border-gray-200"
                } bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all ${
                  errorsContent.description
                    ? "placeholder-shown:border-red-200"
                    : "placeholder-shown:border-gray-200"
                } focus:border-green-500 focus:outline-0 disabled:border-0`}
                placeholder=' '
                id='description'
                {...registerContent("description", { required: true })}
              />{" "}
              <label
                htmlFor='description'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Description
              </label>
              {errorsContent.description && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Description is required
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
      <div className='mt-8 flex flex-col p-1 bg-gray-100 rounded-lg'>
        <div className='flex justify-between items-center px-5 pt-3'>
          <p className='text-gray-800 text-sm font-medium'>2. Add Message</p>
        </div>
        <form
          onSubmit={handleSubmitMessage(onSubmitMessage)}
          className='flex flex-col gap-y-3 my-5 px-5'>
          <div className='w-full flex max-sm:flex-col gap-10'>
            <div className='w-2/4 max-sm:w-full relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='text'
                id='messageName'
                {...registerMessage("messageName", { required: true })}
              />
              <label
                htmlFor='messageName'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Message Name
              </label>
              {errorsMessage.messageName && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Message Name is required
                </p>
              )}
            </div>
            <div className='w-2/4 max-sm:w-full relative '>
              <input
                className='peer h-full w-full border-b border-gray-200 bg-transparent pt-4 pb-4 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all placeholder-shown:border-gray-200 focus:border-green-500 focus:outline-0 disabled:border-0'
                placeholder=' '
                type='text'
                id='messageText'
                {...registerMessage("messageText", { required: true })}
              />
              <label
                htmlFor='messageText'
                className="after:content[' '] pointer-events-none absolute left-0 -top-2.5 pb-14 flex h-full w-full select-none text-[14px] font-normal leading-tight text-gray-800 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-green-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-lg peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-gray-800 peer-focus:text-[14px] peer-focus:leading-tight peer-focus:text-green-500 peer-focus:after:scale-x-100 peer-focus:after:border-green-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-800">
                Message Text
              </label>
              {errorsMessage.messageText && (
                <p className='absolute bottom-0 translate-y-full left-0 text-xs text-red-500'>
                  Message Text is required
                </p>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='self-end relative inline-flex items-center justify-start px-5 py-2.5 mt-5 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group'>
            <span className='w-48 h-48 rounded rotate-[-40deg] bg-green-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0'></span>
            <span className='relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white'>
              {messageOnEdit ? "Edit Message" : "Add Message"}
            </span>
          </button>
        </form>
        <div className='w-full'>
          <div className='w-full p-3 '>
            <div className='overflow-x-scroll shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      N°
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Message Name
                    </th>
                    <th
                      scope='col'
                      className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
                      Message Text
                    </th>
                    <th
                      scope='col'
                      className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {messages.length > 0 ? (
                    messages.map((message: Message) => (
                      <tr
                        key={message.messageNumber}
                        className={`${
                          messageOnEdit === message.messageNumber &&
                          "border-4 border-gray-700"
                        }`}>
                        <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {message.messageNumber}
                        </td>
                        <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {message.messageName}
                        </td>
                        <td className='flex gap-x-3 px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <button
                            onClick={() => {
                              removeMessage(message.messageNumber);
                            }}
                            className='text-red-600 hover:text-red-900'>
                            <TrashIcon className='w-5 h-5' />
                          </button>
                          
                          <button
                            onClick={() => {
                              messageOnEdit === message.messageNumber
                                ? cancelEdit()
                                : editMessage(message.messageNumber);
                            }}
                            className={`${
                              messageOnEdit === message.messageNumber
                                ? "text-gray-600 hover:text-gray-900"
                                : "text-green-600 hover:text-green-900"
                            }`}>
                            {messageOnEdit === message.messageNumber ? (
                              <XMarkIcon className='w-5 h-5 bg-gray-200/70 rounded-md' />
                            ) : (
                              <PencilIcon className='w-5 h-5' />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        align='center'
                        colSpan={5}
                        className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        No Messages
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;
