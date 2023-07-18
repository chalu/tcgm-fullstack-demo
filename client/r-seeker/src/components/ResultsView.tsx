import React from 'react';

import CardView from './CardView';

const ResultsView = ({ searchResults }) => {
    const { data = [] } = searchResults;
    return (
        <div className="grid grid-cols-2 ml-1 mr-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {
                data.map(({ id, name, image_uris, games, prices }) => (
                    <CardView 
                        key={id} 
                        id={id} 
                        name={name}
                        games={games} 
                        prices={prices}
                        img={image_uris.small || image_uris.normal} />
                ))
            }
        </div>
    );
};

export default ResultsView;