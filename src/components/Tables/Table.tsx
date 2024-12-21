import React, { ReactNode, useState } from 'react';
import Loader2 from '../../common/Loader/Loader';
import { EyeSlashFill } from 'react-bootstrap-icons';

interface TableProps {
  headers: { title: string; key: string }[];
  data: { [key: string]: string | number }[];
  isLoading?: boolean;
  action?: any;
  expand?: boolean;
  className?: string;
  expandedRows?: { [key: string]: string | number }[];
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  action,
  isLoading,
  expand,
  className,
  expandedRows,
}) => {
  const [expandRows, setExpandRows] = useState([]);
  const byString = (o: any, s: string) => {
    // Return early if object is null or undefined
    if (o === null || o === undefined) {
      return null;
    }

    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');

    var a = s?.split('.');

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return null; // Return null if property does not exist
      }
    }
    return o;
  };
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const expandRow = (item: any, isExpanded: boolean) => {
    return (
      <tr key={item.id}>
        <td colSpan={headers.length}>
          {isExpanded && (
            <div>{/* Render your expanded row content here */}</div>
          )}
        </td>
      </tr>
    );
  };

  const handleExpandRow = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div
      className={`relative w-full flex flex-col rounded-lg overflow-auto border border-stroke bg-white shadow-default  dark:border-strokedark dark:bg-boxdark min-h-90 ${className}`}
    >
      <table className={`border-collapse w-auto dark:border-strokedark`}>
        <thead>
          <tr className="border-t bg-primary-color border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5">
            {headers.map((item, index) => (
              <th className="text-sm font-medium  text-white  py-3" key={index}>
                {item.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="h-50">
              <td className="items-center" colSpan={headers.length}>
                <Loader2 />
              </td>
            </tr>
          ) : data?.length > 0 ? (
            data?.map((item, key) => {
              return (
                <>
                  <tr
                    className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                    key={key}
                    onClick={() => handleExpandRow(key)}
                  >
                    {headers.map((header, index) => (
                      <td
                        className="text-sm px-5 items-center text-black text-center py-2"
                        key={index}
                      >
                        {byString(item, header.key) || '-'}
                      </td>
                    ))}
                    {action && <td className="items-center">{action}</td>}
                  </tr>
                  {expand &&
                    expandRows?.map((row, index) => {
                      return expandRow(row, index === expandedIndex);
                    })}
                </>
              );
              // Object.byString = function (o: any, s: any) {
              //   s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
              //   s = s.replace(/^\./, ''); // strip a leading dot
              //   var a = s?.split('.');

              //   for (var i = 0, n = a.length; i < n; ++i) {
              //     var k = a[i];
              //     if (k in o) {
              //       o = o[k];
              //     } else {
              //       return;
              //     }
              //   }
              //   return o;
              // };
              // return (
              //   <tr
              //     className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
              //     key={key}
              //   >
              //     {data.map((itemColumn, indexColumn) => (
              //       <td className="items-center" key={indexColumn}>
              //         {Object.byString(item, itemColumn.key) || null}
              //       </td>
              //     ))}
              //     {action ? <td className="items-center">{action}</td> : null}
              //   </tr>
              // );
            })
          ) : (
            <tr className="h-50 justify-center items-center">
              <td colSpan={headers?.length} className="text-center text-black">
                Tidak ada data tersedia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
