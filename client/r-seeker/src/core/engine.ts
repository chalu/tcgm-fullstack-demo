import { wait, settle } from "./utils";

const CallStatusReady = 'READY';
const CallStatusInFlight = 'INFLIGHT';

let delayChain;
let APICallStatus = CallStatusReady;
const apiBase = 'https://tcg-backend-demo.onrender.com';

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

const readyToIssueSearch = async (term, setResults, pagedTo = '') => {
    let apiCall = searchForTerm(term, pagedTo);

    if (APICallStatus === CallStatusInFlight) {
        if (!delayChain) delayChain = Promise.resolve();

        delayChain = settle(wait()).after(delayChain);
        return;
    }

    const result = await issueSearch(apiCall);
    setResults(result);

    if (delayChain) {
        await delayChain;
        delayChain = undefined;
        const result = await issueSearch(apiCall);
        setResults(result);
    }
};

export default readyToIssueSearch;