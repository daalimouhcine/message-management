export default function Heading() {
  return (
    <div>
      <div className='relative'>
        <div className='h-32 w-full bg-gray-500 lg:h-48'>
          <h1 className='w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl lg:text-7xl font-bold text-white'>
            Message Management
          </h1>
        </div>
      </div>
    </div>
  );
}
