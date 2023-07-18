import React from 'react';

// import Footer from './Footer';
import SearchBar from './SearchBar';
// import ResultsView from './ResultsView';

import performSearch from '../core/engine';

const App = () => {
    const [term, setTerm] = React.useState(null);
    const [query, setSearchQuery] = React.useState(null);
    const [results, setResults] = React.useState([]);

    const validationPtrn = /^\w+$/;
    const handleSubmission = (event) => {
        event.preventDefault();

        if (validationPtrn.test(term || '') !== true) return;
        setSearchQuery(term);
        console.log(term);
    };

    const handleNav = (navTo) => {
        return (event) => {
            console.log(navTo);
            performSearch(query, setResults, navTo)
            .catch((e) => { console.warn(e) });
        }
    };

    React.useEffect(() => {
        if (!query || query === '') return;
        performSearch(query, setResults)
        .catch((e) => { console.warn(e) });
    }, [query]);

    return (
        <>
            <SearchBar submitHandler={handleSubmission} inputHandler={setTerm} />
            {/* <ResultsView searchResults={results} /> */}
            {/* <Footer searchResults={results} navHandler={handleNav} /> */}
        </>
    );
}

export default App;