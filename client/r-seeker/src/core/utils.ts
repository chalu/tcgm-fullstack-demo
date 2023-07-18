export const wait = ({ until } = { until: 1000 }) => new Promise<void>((resolve) => {
    setTimeout(() => {
        return resolve();
    }, until);
});

export const settle = (tailPromise) => {
    return {
        async after(headPromise) {
            await headPromise;
            await tailPromise;
        }
    }
};
