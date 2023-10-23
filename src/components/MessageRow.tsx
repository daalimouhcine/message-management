import { Message } from "../types";

const MessageRow = ({
  message,
  index,
}: {
  message: Message;
  index: number;
}) => {
  return (
    <tr
      className={`hover:bg-gray-100 ${
        index % 2 === 0 ? undefined : "bg-gray-50"
      }`}>
      <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
        {message.messageName}
      </td>
      <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
        <p className='max-w-5xl truncate'>{message.messageText}</p>
      </td>
    </tr>
  );
};

export default MessageRow;
