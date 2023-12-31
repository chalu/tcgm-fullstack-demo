import { wait, settle } from "./utils";

import type { QueryResponse } from '../../../api/sdk/model/queryResponse';
import type { APIResponseError } from '../../../api/sdk/model/aPIResponseError';

type APIResponse = APIResponseError | QueryResponse;
type APIInvokerFn = () => Promise<APIResponse>;
type ResultsReceiverFn = (results: APIResponse) => void;

const CallStatusReady = 'READY';
const CallStatusInFlight = 'INFLIGHT';

let delayChain: Promise<any> | undefined;
let APICallStatus = CallStatusReady;
const apiBase = 'https://tcg-backend-demo.onrender.com';

const searchForTerm = (term: string, pagedTo = ''): APIInvokerFn => {
    return async (): Promise<APIResponse> => {
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

const issueSearch = async (apiCall: APIInvokerFn): Promise<APIResponse> => {
    APICallStatus = CallStatusInFlight;
    console.log('Calling backend API ...');
    const data = await apiCall();
    console.log('Done!');
    APICallStatus = CallStatusReady;
    return data;
};

// Aready issued a call? wait for it while 'staging' new ones.
// Though we can delay issuing the API call, we also don't want
// 10 calls all going out within a very short time window because
// the delays all elapsed in quick succession.
// 
// Thus, calling readyToSearchAndDisplayResults('red') over a loop
// of 10 iterations will:
// 1. allow the first call go through to the backend immediately
// 2. delay till 1 seconds after the last of the remaining 9 calls was issued
// 3. make only one backend call (not 9) for a search, which is likely
//    what the user wants to see results for
// 
// Not rigorously tested, but works fine. 
// Uncomment the loop at the
// bottom of the startApp function in client/v-seeker/src/index.js,
// run `pnpm --filter v-seeker start`, (re)load the app in the browser and view the console logs
const readyToIssueSearch = async (term: string, setResults: ResultsReceiverFn, pagedTo = '') => {
    let apiCallr = searchForTerm(term, pagedTo);

    if (APICallStatus === CallStatusInFlight) {
        if (!delayChain) delayChain = Promise.resolve();

        delayChain = settle(wait()).after(delayChain);
        return;
    }

    const result = await issueSearch(apiCallr);
    setResults(result);

    if (delayChain) {
        await delayChain;
        delayChain = undefined;
        const result = await issueSearch(apiCallr);
        setResults(result);
    }
};

export default readyToIssueSearch;