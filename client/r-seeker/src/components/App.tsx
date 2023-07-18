import React from 'react';

// import Card from './Card';
import Footer from './Footer';
import SearchBar from './SearchBar';
import ResultsView from './ResultsView';

const App = () => {
    return (
        <>
            <SearchBar />
            <ResultsView />
            <Footer />
        </>
    );
}

export default App;