import { useState } from "react";
import {
  DocumentDuplicateIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Content } from "../types";
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
}) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);

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
    <div className='relative Actions w-fit mx-auto'>
      <Loader display={showLoader} />
      <div className={`w-fit flex gap-x-1 Actions`}>
        {displayDetails && (
          <button
            onClick={() => {
              viewDetails && viewDetails();
            }}
            className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
            <EyeIcon className='w-4 h-4 pointer-events-none inline-block text-green-400' />
          </button>
        )}
        <button
          onClick={() => {
            editContent(content!);
          }}
          className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
          <PencilSquareIcon className='w-4 h-4 pointer-events-none inline-block text-blue-400' />
        </button>
        <button
          onClick={() => {
            cloneContent(content!);
          }}
          className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
          <DocumentDuplicateIcon className='w-4 h-4 pointer-events-none inline-block text-yellow-400' />
        </button>
        <button
          onClick={() => {
            removeContent(content!.messageId!);
          }}
          className='w-full flex items-center justify-center px-1 py-1 text-xs text-gray-700 bg-white hover:bg-gray-100 hover:text-gray-900'>
          <TrashIcon className='w-4 h-4 pointer-events-none inline-block text-red-400' />
        </button>
      </div>
    </div>
  );
};

export default ContentActions;
