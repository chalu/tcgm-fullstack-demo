import React from 'react';

import CardView from './CardView';

const ResultsView = ({ searchResults }) => {
    const { data = [] } = searchResults;
    const isEmptyState = !data || data.length === 0;
    return (
        <div className="grid grid-cols-2 ml-1 mr-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {

                (
                    isEmptyState &&
                    <div className='m-10 min-w-full'>
                        <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
                            Our collection is massive! <br />
                            You are welcome to &nbsp;
                            <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-pink-500 relative inline-block">
                                <span className="relative text-white">search</span>
                            </span>
                            &nbsp; for your favourite trading card and see for yourself
                        </blockquote>
                    </div>
                )

                ||

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