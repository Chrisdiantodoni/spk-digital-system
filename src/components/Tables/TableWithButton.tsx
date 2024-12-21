import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Loader2 from '../../common/Loader/Loader';
import Button from '../Forms/Button/Button';

interface TableProps {
  headers: string[];
  data: { [key: string]: string | number }[];
  linkUrlPrefix?: string;
  linkColumns: number[];
  statusColor?: (status: string) => string;
  ColumnName: string;
  isLoading?: boolean;
  Error?: ReactNode;
  hasButton?: boolean;
  onClick?: any;
  buttonName?: any;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  linkUrlPrefix,
  statusColor,
  linkColumns,
  ColumnName,
  isLoading,
  hasButton,
  onClick,
  buttonName,
  className,
}) => {
  return (
    <div className="rounded-lg overflow-auto border border-stroke bg-white shadow-default  dark:border-strokedark dark:bg-boxdark">
      <table className={`border-collapse w-full dark:border-strokedark`}>
        <thead>
          <tr className="border-t bg-primary-color border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5">
            {headers.map((item, index) => (
              <th
                className="text-base  font-medium  text-white  py-3"
                key={index}
              >
                {item}
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
          ) : (
            data.map((rowData, key) => (
              <tr
                className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                key={key}
              >
                {Object.entries(rowData).map(([key, cellData], columnIndex) => (
                  <td key={columnIndex + key} className="items-center">
                    {linkColumns.length > 2 &&
                    linkColumns.includes(columnIndex) ? (
                      hasButton ? (
                        <>
                          <Button
                            label={buttonName}
                            onClick={onClick}
                            className={className}
                          ></Button>
                        </>
                      ) : (
                        <Link
                          to={`${linkUrlPrefix}${
                            Object.keys(rowData)[columnIndex]
                          }`}
                          className={`font-normal text-sm text-center flex items-center justify-center link`}
                        >
                          {cellData}
                        </Link>
                      )
                    ) : linkColumns.includes(columnIndex) ? (
                      hasButton ? (
                        <>
                          <Button
                            label={buttonName}
                            onClick={onClick}
                            className={className}
                          ></Button>
                        </>
                      ) : (
                        <Link
                          to={`${linkUrlPrefix}${rowData[ColumnName]}`}
                          className={`font-normal text-sm text-center flex items-center justify-center link`}
                        >
                          {cellData}
                        </Link>
                      )
                    ) : (
                      <p
                        className={`font-normal text-sm text-black text-center py-3 ${
                          statusColor &&
                          statusColor(
                            key === 'status' || 'stock'
                              ? cellData.toString()
                              : '',
                          )
                        }`}
                      >
                        {cellData}
                      </p>
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
