import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string | undefined;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="flex flex-col lg:justify-end lg:flex xsm:hidden mt-2 gap-1 sm:flex-row sm:items-center sm:justify-between">
      <nav>
        <ol className="flex items-end gap-2">
          {items?.map((item, index) => (
            <li key={index}>
              {item.link ? (
                <>
                  <Link className="font-medium link" to={item.link}>
                    {item.label}
                  </Link>
                  <span className="ml-1">/</span>
                </>
              ) : (
                <span className="font-medium text-black">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
