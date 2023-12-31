import { Content, Search } from "../types";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useForm } from "react-hook-form";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import ContentDetails from "./ContentDetails";
import CreateContent from "./CreateContent";
import ContentActions from "./ContentActions";

const ContentTable = () => {
  const [createContentOpen, setCreateContentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content[]>([]);
  const [reFetch, setReFetch] = useState(false);
  const [contentToEdit, setContentToEdit] = useState<Content | undefined>();
  const [contentToClone, setContentToClone] = useState<Content | undefined>();
  const { register, watch, reset } = useForm<Search>();
  const [tableData, setTableData] = useState<Content[]>(content || []);
  const [openDetails, setOpenDetails] = useState(false);
  const [contentDetails, setContentDetails] = useState<Content | undefined>();

  useEffect(() => {
    setLoading(true);
    const getContents = async () => {
      await axios
        .get(
          "https://6s7y94oheg.execute-api.eu-west-2.amazonaws.com/dev/messages"
        )
        .then((res: { data: { body: { Items: Content[] } } }) => {
          setContent(res.data.body.Items);
          setLoading(false);
        });
    };
    getContents();
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
        className={`px-2 inline-flex text-xs leading-5 font-semibold ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
        {status ? "Active" : "Inactive"}
      </span>
    );
  };

  return (
    <div className='px-4 sm:px-6 lg:px-8 mt-10'>
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
        <div className='w-1/4 max-md:w-2/4 mt-2 relative'>
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
            className='px-5 pl-10 w-3/3 border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6'
          />
        </div>
        <div className='max-w-2/4  max-md:ml-auto flex gap-x-8 max-sm:gap-x-5 items-center justify-center'>
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
        <div className='w-1/4 max-md:w-2/4 flex justify-end max-md:ml-auto'>
          <button
            onClick={() => setCreateContentOpen(true)}
            type='button'
            className=' px-3.5 py-2 m-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-indigo-700 text-indigo-700'>
            Add Content
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
        onRowClick={(event) => {
          // Change the argument to DataTableRowClickEvent
          const rowData = event.data as Content;
          const excludedColumn = "Actions";
          const target = event.originalEvent.target as HTMLElement;
          // Check if the click event is not on the excluded column
          if (!target || !target.classList.contains(excludedColumn)) {
            setContentDetails(rowData);
            setOpenDetails(true);
          }
        }}>
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
          style={{ maxWidth: "200px" }}
          className='truncate text-sm'></Column>
        <Column
          field='description'
          header='Description'
          sortable
          style={{ maxWidth: "300px" }}
          className='truncate text-sm'></Column>
        <Column
          field='messages.length'
          header='Messages Number'
          alignHeader={"center"}
          sortable
          style={{ textAlign: "center", width: "200px" }}
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
          bodyClassName='text-center'
          alignHeader={"center"}
          className='Actions'
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
              />
            );
          }}></Column>
      </DataTable>
    </div>
  );
};

export default ContentTable;
