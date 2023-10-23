import { XMarkIcon } from "@heroicons/react/20/solid";
import MessageRow from "./MessageRow";
import { ContentDetailsProps } from "../interfaces";
import { Content } from "../types";
import ContentActions from "./ContentActions";

const ContentDetails: React.FC<ContentDetailsProps> = ({
  isOpen,
  setOpen,
  setReFetch,
  setContentToEdit,
  setContentToClone,
  content,
  setOpenEdit,
}) => {
  const editContent = (content: Content) => {
    setContentToEdit(content);
  };

  const cloneContent = (content: Content) => {
    setContentToClone(content);
  };

  return (
    <div
      className={`h-fit w-screen sm:w-[90vw] flex flex-col rounded-sm gap-y-3 px-5 py-8 sm:p-10 bg-gray-400 fixed z-30 ${
        !isOpen ? "-top-full" : "top-1/2"
      } left-1/2 transition-all ease-out duration-100 -translate-x-1/2 -translate-y-1/2 overflow-y-scroll hide-scroll-bar`}>
      <div className='bg-white h-3 w-28  absolute top-2 left-1/2 -translate-x-1/2'></div>
      <div className='w-full flex justify-between items-center'>
        <h3 className='font-bold text-xl lg:text-3xl text-gray-900'>
          Content Details:
        </h3>
        <div className='flex gap-x-2 items-center'>
          <ContentActions
            content={content}
            displayDetails={false}
            setReFetch={setReFetch}
            setContentToEdit={editContent}
            setContentToClone={cloneContent}
            setOpenEdit={() => {
              setOpen();
              setOpenEdit();
            }}
          />
          <button
            onClick={() => setOpen()}
            className='p-1 lg:p-2 bg-white rounded-sm grid place-items-center shadow-md hover:shadow-2xl transition'>
            <XMarkIcon className='h-5 w-5 lg:h-6 lg:w-6 text-gray-900' />
          </button>
        </div>
      </div>
      <div className='w-full h-fit flex flex-col gap-y-8 bg-gray-50  p-5 mt-5'>
        <div className='flex gap-x-8'>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Campaign
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {content?.campaign}
            </p>
          </div>
          <div className='w-1/2'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Country Code
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {content?.countryCode}
            </p>
          </div>
        </div>
        <div className='flex gap-x-5'>
          <div className='w-1/2 flex gap-x-5'>
            <div className='w-1/3'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Update Date
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {content?.updateDate}
              </p>
            </div>
            <div className='w-1/3'>
              <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
                Content Status
              </h4>
              <p className='text-sm lg:text-base text-gray-500'>
                {content?.messageActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
          <div className='w-2/4'>
            <h4 className='text-lg lg:text-xl font-semibold text-gray-900'>
              Description
            </h4>
            <p className='text-sm lg:text-base text-gray-500'>
              {content?.description}
            </p>
          </div>
        </div>
      </div>
      <div className='mt-8 flex flex-col'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 '>
              <table className='min-w-full divide-y divide-gray-300'>
                <thead className='bg-gray-50'>
                  <tr>
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
                  </tr>
                </thead>
                <tbody className='bg-white'>
                  {content && content.messages?.length > 0 ? (
                    content.messages.map((message, index) => (
                      <MessageRow key={index} index={index} message={message} />
                    ))
                  ) : (
                    <tr>
                      <td
                        align='center'
                        colSpan={4}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        No messages added yet
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

export default ContentDetails;
