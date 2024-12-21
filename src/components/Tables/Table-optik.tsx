import PageError from '../src/pages/notFound';
import Pagination from './pagination';
import Search from './search';

const Table = ({ data = [], column = [], action, useNotFound = true }) => {
  return (
    <div className="row">
      <div className="col-12 p-1">
        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead>
              <tr>
                {column.map((item, idx) => {
                  return (
                    <th className={item.className} key={idx}>
                      {item.title}
                    </th>
                  );
                })}
                {action ? <th className="text-end">Action</th> : null}
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {data.length > 0 ? (
                data.map((item, idx) => {
                  Object.byString = function (o, s) {
                    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                    s = s.replace(/^\./, ''); // strip a leading dot
                    var a = s?.split('.');

                    for (var i = 0, n = a.length; i < n; ++i) {
                      var k = a[i];
                      if (k in o) {
                        o = o[k];
                      } else {
                        return;
                      }
                    }
                    return o;
                  };
                  return (
                    <tr key={idx}>
                      {column.map((itemColumn, idxColumn) => (
                        <td className={itemColumn.className} key={idxColumn}>
                          {Object.byString(item, itemColumn.key) || '-'}
                        </td>
                      ))}
                      {action ? <td className="text-end">{action}</td> : null}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  {useNotFound ? (
                    <td
                      colSpan={action ? column.length + 1 : column.length}
                      className="text-center"
                    >
                      <PageError title="Data Not Found" />
                    </td>
                  ) : null}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
