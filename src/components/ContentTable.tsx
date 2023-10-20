import { Content, Search } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import Swal from "sweetalert2";
import ContentDetails from "./ContentDetails";
import CreateContent from "./CreateContent";
import ContentActions from "./ContentActions";

const contentDefault: Content[] = [
  {
    messageId: 1234,
    campaign: "CPL",
    countryCode: "ENG",
    description: "These are the messages for October 2023",
    updateDate: "11/10/2023",
    createdBy: "Nigel Ryan",
    messageActive: true,
    messages: [
      {
        messageNumber: 1,
        messageName: "agentAvailablilty",
        messageText: "We are sorry but there are currently no agents available",
      },
      {
        messageNumber: 2,
        messageName: "errorMessage",
        messageText: "We are sorry but an error has occurred",
      },
    ],
  },
  {
    messageId: 1235,
    campaign: "CPL",
    countryCode: "ENG",
    description: "These are the messages for October 2023",
    updateDate: "11/10/2023",
    createdBy: "Nigel Ryan",
    messageActive: false,
    messages: [
      {
        messageNumber: 1,
        messageName: "agentAvailablilty",
        messageText: "We are sorry but there are currently no agents available",
      },
      {
        messageNumber: 2,
        messageName: "errorMessage",
        messageText: "We are sorry but an error has occurred",
      },
    ],
  },
];

const ContentTable = () => {
  const [createContentOpen, setCreateContentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content[]>(contentDefault);
  const [reFetch, setReFetch] = useState(false);
  const [contentToEdit, setContentToEdit] = useState<Content | undefined>();
  const [contentToClone, setContentToClone] = useState<Content | undefined>();
  const { register, watch, reset } = useForm<Search>();
  const [tableData, setTableData] = useState<Content[]>(content || []);
  const [openDetails, setOpenDetails] = useState(false);
  const [contentDetails, setContentDetails] = useState<Content | undefined>();
  const [selectedContents, setSelectedContents] = useState<Content[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // setLoading(true);
    setSelectAll(false);
    setSelectedContents([]);
    const getContents = async () => {
      await axios
        .get(
          "https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys"
        )
        .then((res: { data: { body: { content: Content }[] } }) => {
          const contentsWithoutContent = res.data.body
            .filter((item: { content: Content }) => item.content)
            .map((item: { content: Content }) => {
              const { content } = item;
              return content;
            });
          setContent([...contentsWithoutContent]);

          setLoading(false);
        });
    };
    // getContents();
  }, [reFetch]);

  useEffect(() => {
    if (contentToClone) {
      setCreateContentOpen(true);
    }
    if (contentToEdit) {
      setCreateContentOpen(true);
    }
  }, [contentToEdit, contentToClone]);

  const removeEditContent = () => {
    setContentToEdit(undefined);
    setContentToClone(undefined);
  };

  const searchValue = watch("search");
  const byActive = watch("byActive");
  const byInActive = watch("byInActive");

  useEffect(() => {
    if (searchValue || byActive || byInActive) {
      const filteredContents = content.filter((content) => {
        if (searchValue && byActive && byInActive) {
          return Object.keys(content).some((key) =>
            content[key as keyof Content]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byActive) {
          return Object.keys(content).some((key) =>
            content[key as keyof Content]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue && byInActive) {
          return Object.keys(content).some((key) =>
            content[key as keyof Content]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (searchValue) {
          return Object.keys(content).some((key) =>
            content[key as keyof Content]!.toString()
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          );
        } else if (byActive && byInActive) {
          return content.messageActive === true || !content.messageActive;
        } else if (byActive) {
          return content.messageActive === true || content.messageActive;
        } else if (byInActive) {
          return content.messageActive === false || !content.messageActive;
        }
      });
      setTableData([...filteredContents]);
    } else {
      setTableData([...content]);
    }
  }, [searchValue, content, byActive, byInActive]);

  const resetSearch = () => {
    reset({ search: "" });
  };

  const editContent = (content: Content) => {
    setContentToEdit(content);
  };
  const cloneContent = (content: Content) => {
    setContentToClone(content);
  };

  const statusBodyTemplate = (content: Content) => {
    const status = content.messageActive;
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    );
  };

  const onSelectionChange = (e: any) => {
    const value = e.value;
    setSelectedContents(value);
    setSelectAll(value.length === tableData.length);
  };
  const onSelectAllChange = (e: any) => {
    const selectAll = e.checked;

    if (selectAll) {
      setSelectedContents(tableData);
      setSelectAll(true);
    } else {
      setSelectAll(false);
      setSelectedContents([]);
    }
  };

  const deleteAll = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "green",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        selectedContents.forEach((content) => {
          axios
            .delete(
              `https://at2l22ryjg.execute-api.eu-west-2.amazonaws.com/dev/surveys/${content.messageId}`
            )
            .then(() => {
              setSelectedContents([]);
              setReFetch(!reFetch);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        Swal.fire(
          "Deleted!",
          "The selected contents has been deleted.",
          "success"
        );
      }
    });
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-20'>
      <div className='sm:flex sm:items-center'>
        <div className='sm:flex-auto relative'>
          <div
            className={`flex items-center justify-between gap-x-5 px-5 py-3 max-sm:px-3 max-sm:py-1.5 bg-indigo-500/70 rounded-md absolute bottom-0 max-sm:bottom-3 transition-all ease-linear duration-300 ${
              selectedContents.length ? "left-0" : "-left-full"
            }`}>
            <p className='text-white font-semibold'>
              {selectedContents.length} Content
              {selectedContents.length > 1 && "s"} Selected
            </p>
            <button
              onClick={() => deleteAll()}
              className='rounded-md px-3.5 py-1.5 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-white hover:border-red-600 transition-colors duration-150 ease-linear shadow-red-600/60 shadow-md  text-white'>
              <span className='absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-red-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease'></span>
              <span className='relative text-white transition duration-300 group-hover:text-white ease'>
                Delete All
              </span>
            </button>
          </div>
        </div>
      </div>

      <ContentDetails
        content={contentDetails}
        isOpen={openDetails}
        setReFetch={() => setReFetch(!reFetch)}
        setOpen={() => setOpenDetails(!openDetails)}
        setContentToEdit={editContent}
        setContentToClone={cloneContent}
        setOpenEdit={() => setCreateContentOpen(true)}
      />
      <CreateContent
        isOpen={createContentOpen}
        setOpen={() => setCreateContentOpen(false)}
        setReFetch={() => setReFetch(!reFetch)}
        contentToEdit={contentToEdit}
        contentToClone={contentToClone}
        removeDefaultContent={removeEditContent}
      />
      <div className='w-full flex flex-wrap-reverse justify-between gap-5 mb-5'>
        <div className='w-2/3 sm:w-1/3 mt-2 relative'>
          <MagnifyingGlassIcon className='absolute w-5 h-5 text-gray-400 left-3 translate-y-1/2' />
          {searchValue && (
            <XMarkIcon
              onClick={() => resetSearch()}
              className='absolute w-5 h-5 text-gray-400 right-3 translate-y-1/2 cursor-pointer '
            />
          )}
          <input
            type='text'
            {...register("search")}
            id='search'
            placeholder='Keyword Search'
            className='px-5 pl-10 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6'
          />
        </div>
        <div className='max-w-1/3 max-md:w-fit flex max-md:ml-auto gap-x-8 max-sm:gap-x-5 items-center justify-center'>
          <p className='font-semibold'>Filter by Status:</p>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register("byActive")}
              id='byActive'
              className='w-5 h-5'
            />
            <label htmlFor='byActive' className='ml-2 max-sm:ml-1'>
              Active
            </label>
          </div>
          <div className='flex items-center'>
            <input
              type='checkbox'
              {...register("byInActive")}
              id='byInActive'
              className='w-5 h-5'
            />
            <label htmlFor='byInActive' className='ml-2 max-sm:ml-1'>
              Inactive
            </label>
          </div>
        </div>
        <div className='max-w-1/3 max-md:ml-auto'>
          <button
            onClick={() => setCreateContentOpen(true)}
            type='button'
            className='relative inline-flex items-end justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-100 group'>
            <span className='absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full'></span>
            <span className='absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200'>
              <svg
                className='w-5 h-5 text-green-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M14 5l7 7m0 0l-7 7m7-7H3'></path>
              </svg>
            </span>
            <span className='relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white'>
              Add Content
            </span>
          </button>
        </div>
      </div>
      <DataTable
        value={tableData}
        key='messageId'
        stripedRows
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{}}
        loading={loading}
        emptyMessage='No Contents Found'
        scrollHeight='500px'
        selection={selectedContents}
        onSelectionChange={onSelectionChange}
        selectAll={selectAll}
        onSelectAllChange={onSelectAllChange}
        cellSelection={false}
        selectionMode='multiple'>
        <Column selectionMode='multiple' headerStyle={{ width: "3rem" }} />
        <Column
          field='campaign'
          header='Campaign'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='countryCode'
          header='Country Code'
          sortable
          style={{ maxWidth: "250px" }}
          className='truncate text-sm'></Column>
        <Column
          field='description'
          header='Description'
          sortable
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='messages.length'
          header='Messages Number'
          sortable
          style={{ minWidth: "104px", textAlign: "center" }}
          className='text-sm'></Column>
        <Column
          field='Status'
          header='Status'
          dataType='boolean'
          body={statusBodyTemplate}
          style={{}}></Column>
        <Column
          field='updateDate'
          header='Update Date'
          className='text-sm'
          style={{}}></Column>
        <Column
          field='Actions'
          header='Actions'
          body={(rowData: Content) => {
            return (
              <ContentActions
                content={rowData}
                viewDetails={() => {
                  setContentDetails(rowData);
                  setOpenDetails(true);
                }}
                displayDetails={true}
                setReFetch={() => setReFetch(!reFetch)}
                setContentToEdit={editContent}
                setContentToClone={cloneContent}
                setOpenEdit={() => setCreateContentOpen(true)}
                index={0}
              />
            );
          }}
          style={{ textAlign: "center" }}></Column>
      </DataTable>
    </div>
  );
};

export default ContentTable;
