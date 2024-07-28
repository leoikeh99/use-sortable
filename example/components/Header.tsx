const Header = () => {
  return (
    <header>
      <div className="flex flex-col items-center justify-center py-4 px-2 text-center">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
          Drag n Drop Example
        </h1>
        <p className="leading-7 mt-2">
          Using{' '}
          <a
            href="https://github.com/leoikeh99/use-sortable"
            target="_blank"
            className="underline"
          >
            @wazza/use-sortable
          </a>{' '}
          (for sorting) and{' '}
          <a
            href="https://github.com/hello-pangea/dnd"
            target="_blank"
            className="underline"
          >
            @hello-pangea/dnd
          </a>{' '}
          (drag and drop UI)
        </p>
      </div>
    </header>
  );
};

export default Header;
