export default function Heading() {
  return (
    <div>
      <div className='relative'>
        <img
          className='h-32 w-full object-cover lg:h-48'
          src='bg-img.png'
          alt=''
        />
        <h1 className='w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl lg:text-7xl font-bold text-white'>
          Message Management
        </h1>
      </div>
    </div>
  );
}
