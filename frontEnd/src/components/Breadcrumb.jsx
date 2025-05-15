import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineRight } from "react-icons/ai";
import { FaHome } from "react-icons/fa";

const Breadcrumb = ({ currentPage, links = [] }) => {
  return (
    <div className="w-full flex gap-3 my-5">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to={"/"}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-sky-800 "
            >
              <FaHome />
              Home
            </Link>
          </li>

          {links &&
            links.map((link, index) => (
              <li key={index} className="inline-flex items-center">
                <Link
                  to={link.path}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-blue-600 "
                >
                  <AiOutlineRight className="text-gray-400" />

                  {link.title}
                </Link>
              </li>
            ))}

          <li aria-current="page">
            <div className="flex items-center">
              <AiOutlineRight className="text-gray-400" />
              <span className="ms-1 text-sm font-medium text-gray-700 md:ms-2">
                {currentPage}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;