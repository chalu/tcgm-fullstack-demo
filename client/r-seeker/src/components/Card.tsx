import React from 'react';

const Card = () => {
    return (
        <div className="ml-5 max-w-fit bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700">
            <img className="rounded-t-lg m-2 ml-5 block" src="https://cards.scryfall.io/small/front/c/0/c05da08d-8fac-47bc-80d8-78a80d1463d2.jpg?1576385321" alt="" />
            <div className="max-w-xs p-5 dark:bg-gray-800">
                <h5 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Altered Ego
                </h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Games: paper | mtgo
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Prices: $1.17 | €0.47
                </p>
            </div>
        </div>
    );
};

export default Card;