import React from 'react';

const CardView = ({ id, name, games, prices, img = 'https://placehold.co/146x204?text=No+Image' }) => {

    const priceFigures = prices && Object.keys(prices)
        .map((currency) => {
            return new Intl.NumberFormat('en-US', {
                currency,
                style: 'currency'
            });
        }).reduce<string[]>((figures, fmt, index) => {
            const fig = fmt.format(
                Object.values(prices)[index] as number
            );
            return [...figures, fig];
        }, []);
    return (
        <div id={id}
            className="ml-5 max-w-xs max-h-fit bg-gray-800 pt-0 border rounded-lg shadow border-gray-700">
                <div className='bg-white pb-1 pt-1'>
                    <img className="rounded-t-lg m-2 bg-white m-auto mt-2.5 mb-2.5 block" src={img} alt={name} />
                </div>
    
            <div className="max-w-xs p-5 bg-gray-800">
                <h5 className="mb-2 text-1xl break-words font-bold tracking-tight text-gray-900 text-white">
                    {name}
                </h5>
                <p className="mb-3 font-normal text-gray-300">
                    Games: {(games && games.join(' | ')) || 'N/A'}
                </p>
                <p className="mb-3 font-normal text-gray-300">
                    Prices: {(priceFigures && priceFigures.join(' | ')) || 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default CardView;