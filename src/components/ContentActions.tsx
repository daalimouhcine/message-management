import { useState } from "react";
import {
  DocumentDuplicateIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Content } from "../types";
import { useClickOutside } from "../hooks/useClickOutside";
import Swal from "sweetalert2";
import axios from "axios";
import { ContentActionsProps } from "../interfaces";
import Loader from "./Loader";

const ContentActions: React.FC<ContentActionsProps> = ({
  content,
  viewDetails,
  displayDetails,
  setReFetch,
  setContentToEdit,
  setContentToClone,
  setOpenEdit,
  index,
}) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => {
    setOpen(false);
  });

  const removeContent = (messageId: number) => {
    Swal.fire({
      showClass: {
        popup: "swal2-noanimation",
        backdrop: "swal2-noanimation",
        icon: "swal2-noanimation",
      },
      hideClass: {
        popup: "",
      },
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowLoader(true);
        axios
          .delete(
            "https://6s7y94oheg.execute-api.eu-west-2.amazonaws.com/dev/" +
              messageId
          )
          .then((res) => {
            if (res.data.statusCode == 200) {
              setShowLoader(false);
              Swal.fire({
                showClass: {
                  popup: "swal2-noanimation",
                  backdrop: "swal2-noanimation",
                  icon: "swal2-noanimation",
                },
                hideClass: {
                  popup: "",
                },
                title: "Deleted!",
                text: res.data.body.message,
                icon: "success",
              });
              setReFetch();
            }
          });
      }
    });
  };

  const editContent = (content: Content) => {
    setContentToEdit(content);
    setOpenEdit();
  };
  const cloneContent = (content: Content) => {
    setContentToClone(content);
    setOpenEdit();
  };

  return (
    <div ref={open ? ref : undefined} className='relative '>
      <Loader display={showLoader} />
      <button
        onClick={() => setOpen(!open)}
        className='p-1 bg-gray-300 rounded-md hover:bg-gray-200 transition-colors ease-linear duration-200'>
        <EllipsisVerticalIcon className='w-5 h-5 text-gray-800' />
      </button>
      <div
        className={`w-fit flex flex-col absolute right-0 -translate-x-1/3 top-0 ${
          index! === 0 || !displayDetails
            ? "-translate-y-2/3"
            : "-translate-y-full"
        } mt-8 bg-white rounded-md overflow-hidden shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
          open ? "" : "hidden"
        }`}>
        {displayDetails && (
          <button
            onClick={() => {
              setOpen(false);
              viewDetails && viewDetails();
            }}
            className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
            <span>Details</span>
            <EyeIcon className='w-4 h-4 ml-2 inline-block text-green-400' />
          </button>
        )}
        <button
          onClick={() => {
            setOpen(false);
            editContent(content!);
          }}
          className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Edit</span>
          <PencilSquareIcon className='w-4 h-4 ml-2 inline-block text-blue-400' />
        </button>
        <button
          onClick={() => {
            setOpen(false);
            cloneContent(content!);
          }}
          className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Duplicate</span>
          <DocumentDuplicateIcon className='w-4 h-4 ml-2 inline-block text-yellow-400' />
        </button>
        <button
          onClick={() => {
            setOpen(false);
            removeContent(content!.messageId!);
          }}
          className='w-full flex items-center justify-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
          <span>Delete</span>
          <TrashIcon className='w-4 h-4 ml-2 inline-block text-red-400' />
        </button>
      </div>
    </div>
  );
};

export default ContentActions;
