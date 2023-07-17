import { wait, settle } from "./utils";

const CallStatusReady = 'READY';
const CallStatusInFlight = 'INFLIGHT';

let delayChain;
let APICallStatus = CallStatusReady;

const apiBase = 'https://tcg-backend-demo.onrender.com';

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
    //     readyToSearchAndDisplayResults('red');
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

    await readyToSearchAndDisplayResults(searchTerm, href);
};

const attemptSubmit = (event) => {
    event.preventDefault();

    const field = event.target.term;
    if (!field.validity.valid) return;

    try {
        readyToSearchAndDisplayResults(term.value);
    } catch (error) {
        console.warn(error);
    }
};

const searchForTerm = (term, pagedTo = '') => {
    return async () => {
        let endpoint = `/search?term=${term}`;
        if (pagedTo !== '') {
            const url = new URL(pagedTo, `${apiBase}`);
            endpoint = `/search${url.search}`;
        }

        // bubble any error over
        const resp = await fetch(`${apiBase}${endpoint}`);
        return await resp.json();
    }
};

const issueSearch = async (apiCall) => {
    APICallStatus = CallStatusInFlight;
    console.log('Calling backend API ...');
    const data = await apiCall();
    console.log('Done!');
    APICallStatus = CallStatusReady;
    return data;
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

const readyToSearchAndDisplayResults = async (term, pagedTo = '') => {
    let apiCall = searchForTerm(term, pagedTo);

    // Aready issued a call. wait for it while staging these ones.
    // Though we can delay issueing the API call, we also don't want
    // 10 delayed calls all going out within a very short time window.
    // Thus, calling readyToSearchAndDisplayResults('red') over a loop
    // of 10 iterations will:
    // 1. allow the first call go through to the backend immediately
    // 2. delay till 1 seconds after the last of the remaining 9 calls was issued
    // 3. make only one backend call (not 9) for a search, which is likely
    //    what the user wants to see results for
    // 
    // Not rigorously tested, but works fine. Uncomment the loop at the
    // bottom of the startApp function, reload the app in dev mode
    // (pnpm --filter seeker start) and the view the console logs
    if (APICallStatus === CallStatusInFlight) {
        if (!delayChain) delayChain = Promise.resolve();

        delayChain = settle(wait()).after(delayChain);
        return;
    }

    const result = await issueSearch(apiCall);
    displayResults(result);

    if (delayChain) {
        await delayChain;
        delayChain = undefined;
        const result = await issueSearch(apiCall);
        displayResults(result);
    }
};

document.addEventListener("DOMContentLoaded", startApp);