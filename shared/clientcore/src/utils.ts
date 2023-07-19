export const wait = ({ until } = { until: 1000 }) => new Promise<void>((resolve) => {
    setTimeout(() => {
        return resolve();
    }, until);
});

export const settle = (tailPromise: Promise<any>) => {
    return {
        async after(headPromise: Promise<any>) {
            await headPromise;
            await tailPromise;
        }
    }
};
