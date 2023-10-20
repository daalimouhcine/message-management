import { Content } from "../types";

export interface CreateContentProps {
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  contentToEdit?: Content;
  contentToClone?: Content;
  removeDefaultContent: () => void;
}

export interface ContentActionsProps {
  content: Content | undefined;
  viewDetails?: () => void;
  displayDetails: boolean;
  setReFetch: () => void;
  setContentToEdit: (content: Content) => void;
  setContentToClone: (content: Content) => void;
  setOpenEdit: () => void;
  index?: number;
}

export interface ContentRowProps {
  content: Content;
  index: number;
  setReFetch: () => void;
  setContentToEdit: (content: Content) => void;
  setContentToClone: (content: Content) => void;
  setOpenEdit: () => void;
}

export interface ContentDetailsProps {
  isOpen: boolean;
  setOpen: () => void;
  setReFetch: () => void;
  content: Content | undefined;
  setContentToEdit: (content: Content) => void;
  setContentToClone: (content: Content) => void;
  setOpenEdit: () => void;
}
