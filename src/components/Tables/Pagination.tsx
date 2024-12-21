import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

interface Props {
  currentPage: number;
  totalPage: number;
  handlePage?: any;
  totalData: number;
  totalItems: string | number;
}

export default function Pagination({
  currentPage,
  totalPage,
  handlePage,
  totalItems,
  totalData,
}: Props) {
  const [page, setPage] = useState<number[]>([]);

  const buildPages = useCallback(() => {
    let start = 0;
    let end = totalPage >= 5 ? 5 : totalPage;

    if (currentPage > 3 && currentPage < totalPage - 3) {
      start = currentPage - 1;
      end = currentPage - 1 + 3;
    }

    if (currentPage > 5 && currentPage > totalPage - 5) {
      start = totalPage - 5;
      end = totalPage - 1;
    }

    const newPages = [];
    for (let i = start; i < end; i++) {
      newPages.push(i);
    }

    setPage(newPages);
  }, [currentPage, totalPage]);

  const onChange = (page: number) => handlePage(page);

  useEffect(() => {
    buildPages();
  }, [currentPage, totalPage]);

  const isActive = (page: number) => {
    return currentPage - 1 === page ? 'bg-primary-color text-white' : '';
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Menampilkan <span className="font-medium mx-1">{currentPage}</span>{' '}
            hingga
            <span className="font-medium mx-1">{totalItems}</span> dari
            <span className="font-medium mx-1">{totalData}</span> entri
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              href="#"
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                currentPage === 1
                  ? 'text-gray-400'
                  : 'text-primary-color  hover:bg-indigo-800'
              } ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
              onClick={
                currentPage === 1 ? () => null : () => onChange(currentPage - 1)
              }
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              <span className="">PREV</span>
            </a>
            {/* Current: "" */}
            {currentPage > 4 && (
              <a
                href="#"
                aria-current="page"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${isActive(
                  1,
                )}`}
                onClick={() => onChange(1)}
              >
                1
              </a>
            )}
            {currentPage > 4 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            )}
            {page.map((item: any, idx: number) => (
              <a
                href="#"
                className={`relative inline-flex items-center px-4 py-2 text-sm hover:text-white font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-800 focus:z-20 focus:outline-offset-0  ${isActive(
                  item,
                )}`}
                key={idx}
                onClick={() => onChange(item + 1)}
              >
                {item + 1}
              </a>
            ))}
            {currentPage < totalPage - 4 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            )}
            {currentPage > 5 && (
              <a
                href="#"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-800 focus:z-20 focus:outline-offset-0 ${isActive(
                  totalPage - 1,
                )}`}
                onClick={() => onChange(totalPage)}
              >
                {totalPage}
              </a>
            )}
            <a
              href="#"
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              onClick={
                currentPage === totalPage
                  ? () => null
                  : () => onChange(currentPage + 1)
              }
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
              <span className="">NEXT</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
