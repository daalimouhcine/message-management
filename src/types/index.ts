export type Message = {
  messageNumber: number;
  messageName: string;
  messageText: string;
};

export type Content = {
  messageId?: number;
  campaign: string;
  countryCode: string;
  description: string;
  updateDate: string;
  createdBy: string;
  messageActive: boolean;
  messages: Message[];
};

export type createContentForm = {
  campaign: string;
  countryCode: string;
  description: string;
  messageActive: boolean;
};

export type createMessageForm = {
  messageNumber?: number;
  messageName: string;
  messageText: string;
};

export type Search = {
  search: string;
  byActive: boolean;
  byInActive: boolean;
};
