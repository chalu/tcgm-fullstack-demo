import React from 'react';

const maxPerPage = 175;

const getPageParam = (nav: string) => {
    const page = nav.substring(nav.indexOf('?') + 1)
        ?.split('&')
        ?.find((param) => param.startsWith('page='))
        ?.split('=')[1];
    return parseInt(`${page}`, 10);
};

const Footer = ({ searchResults, navHandler }) => {
    const { total, next, previous } = searchResults || {};

    let currentPage = 1;
    if (next) currentPage = getPageParam(next) - 1;
    if (previous) currentPage = getPageParam(previous) + 1;

    const totalPages = parseInt(`${total / maxPerPage}`) + (total % maxPerPage === 0 ? 0 : 1);

    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-4 dark:bg-gray-800 dark:border-gray-600">
            {total >= 1 ?
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span>
                    of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                </span>
                : ''
            }
            {
                (previous || next) &&
                <div className="inline-flex xs:mt-0">
                    <button disabled={!previous} onClick={navHandler(previous)}
                        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 disabled:opacity-25 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg className="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                        </svg>
                        Prev
                    </button>

                    <button disabled={!next} onClick={navHandler(next)}
                        className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 disabled:opacity-25 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                        <svg className="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </button>
                </div>
            }
        </footer>
    );
};

export default Footer;