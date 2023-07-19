import axios from 'axios';
import { expect, describe, test, jest } from '@jest/globals';

const apiBase = 'http://localhost:3001';
jest.setTimeout(10000);

describe('API Rate Limiter', () => {
    describe('Disallow too many calls', () => {
        test('disallow more than one call per second', async () => {
            const manyCalls = [
                axios.get(`${apiBase}/search?term=pokey`),
                axios.get(`${apiBase}/search?term=pokey`),
                axios.get(`${apiBase}/search?term=pokey`)
            ]
            try {
                await Promise.all(manyCalls);
            } catch (error) {
                expect(error.response.status).toEqual(429);
            }
        });
    });

    // describe('Allow calls within rate limit window', () => {
    //     test('allow max of one call per second', async () => {
    //         const delay = () => new Promise<void>((resolve) => {
    //             setTimeout(() => {
    //                 return resolve();
    //             }, 1000);
    //         });
    
    //         const calls = [
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`),
    //             () => axios.get(`${apiBase}/search?term=pokey`)
    //         ];
    
    //         const toSingleChainedCall = async (chain, aCall): Promise<number[]> => {
    //             const prevStatuses = await chain;
    //             const { status } = await aCall();
    //             await delay();
    //             const out = !prevStatuses ? [status] : [...prevStatuses, status];
    //             return Promise.resolve(out)
    //         }
    //         const chained = calls.reduce(toSingleChainedCall, Promise.resolve([]));
    
    //         try {
    //             const results = await chained;
    //             const all200s = results.every((s) => s === 200)
    //             expect(all200s).toBeTruthy();
    //         } catch (error) {
    //             console.warn(error.message);
    //             expect(error.response.status).not.toEqual(429);
    //         }
    //     });
    // });
});