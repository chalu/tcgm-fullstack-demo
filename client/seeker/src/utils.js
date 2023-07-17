const delayASec = () => new Promise((resolve) => {
    setTimeout(() => {
        return resolve();
    }, 1000);
});

const toSingleChainedCall = async (chain, apiCall) => {
    const preResults = await chain;
    await delayASec();
    const result = await apiCall();
    
    const out = !preResults ? [result] : [...preResults, result];
    return Promise.resolve(out)
};

export const waitUntilASec = (apiCallFn) => {
    return () => {
        return [apiCallFn].reduce(toSingleChainedCall, Promise.resolve([]));
    }
};