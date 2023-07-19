import performSearch from 'clientcore';

const startApp = () => {
    const form = document.querySelector('#form');
    form.addEventListener("submit", attemptSubmit);
    const searchField = form.querySelector("input[type=text]");
    searchField.focus();

    const pagerEl = document.querySelector('#pager');
    pagerEl.classList.remove('visually-hidden');
    pagerEl.addEventListener('click', navigate);
    pagerEl.classList.add('visually-hidden');

    // ====================================
    // Only here as a quick and dirty test
    // ====================================
    // for (const count of [1, 2, 3, 4, 5, 6, 7, 8, 9, 20]) {
    //     performSearch('red', () => {});
    // }
};

const navigate = async (event) => {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    if (!href || href === '#') return;

    const searchTerm = href.substring(href.indexOf('?') + 1)
        .split('&')
        .find((param) => param.startsWith('term='))
        .split('=')[1];

    await performSearch(searchTerm, displayResults, href);
};

const attemptSubmit = (event) => {
    event.preventDefault();

    const field = event.target.term;
    if (!field.validity.valid) return;

    try {
        performSearch(term.value, displayResults);
    } catch (error) {
        console.warn(error);
    }
};

const resultItemTemplate = ({ id, name, img, games, prices }) => `
    <div id="${id}" class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${img}" alt="${name}" />
            </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">Games: ${(games && games.join(' | ')) || 'N/A'}</p>
                <p class="card-text">
                    <small class="text-body-secondary"> 
                        Prices: ${(prices && prices.join(' | ')) || 'N/A'}
                    </small>
                </p>
            </div>
        </div>
    </div>
  </div>
`;

const displayResults = ({ total, next, previous, data }) => {

    const cards = []
    for (const cd of data) {
        const priceFigures = cd.prices && Object.keys(cd.prices)
            .map((currency) => {
                return new Intl.NumberFormat('en-US', {
                    currency,
                    style: 'currency'
                });
            }).reduce((figures, fmt, index) => {
                const fig = fmt.format(Object.values(cd.prices)[index]);
                return [...figures, fig];
            }, []);

        cards.push(resultItemTemplate({
            id: cd.id,
            name: cd.name,
            games: cd.games,
            prices: priceFigures,
            img: cd.image_uris.small || cd.image_uris.normal
        }));
    }

    document.querySelector('#results').innerHTML = cards.join(' ');

    const pagerEl = document.querySelector('#pager');
    const [prevNav, currentNav, nextNav] = pagerEl.querySelectorAll('li');

    if (!total || (!next && !previous)) {
        pagerEl.classList.add('visually-hidden');
    } else {
        pagerEl.classList.remove('visually-hidden');
    }

    let currPage = undefined;

    if (next) {
        nextNav.classList.remove('disabled');
        nextNav.querySelector('a').setAttribute('href', next);
        currPage = next.substring(next.indexOf('page=')).split('=')[1];
        currPage = parseInt(currPage, 10) - 1;
    } else {
        nextNav.classList.add('disabled');
        nextNav.querySelector('a').setAttribute('href', '#');
    }

    if (previous) {
        prevNav.classList.remove('disabled');
        prevNav.querySelector('a').setAttribute('href', previous);
        currPage = previous.substring(previous.indexOf('page=')).split('=')[1];
        currPage = parseInt(currPage, 10) + 1;
    } else {
        prevNav.classList.add('disabled');
        prevNav.querySelector('a').setAttribute('href', '#');
    }

    currentNav.querySelector('a').textContent = currPage;

};

document.addEventListener("DOMContentLoaded", startApp);