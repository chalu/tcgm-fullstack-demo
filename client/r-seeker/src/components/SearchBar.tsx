import React from 'react';

const SearchBar = () => {
    const [term, setTerm] = React.useState('');
    const validationPtrn = /^\w+$/;
    const handleChange = ({target}) => {
        setTerm(target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validationPtrn.test(term) !== true) return;
        console.log(term);
    };

    return (
        <form className="flex items-center ml-5 mt-5 mb-5" onSubmit={handleSubmit}>
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
                <input className="max-w-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    type="text"
                    id="search" 
                    minLength={3}
                    placeholder="try pokey or red" 
                    value={term}
                    onChange={handleChange}
                    required />
            </div>
            <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
                <span className="sr-only">Search</span>
            </button>
        </form>
    );
};

export default SearchBar;