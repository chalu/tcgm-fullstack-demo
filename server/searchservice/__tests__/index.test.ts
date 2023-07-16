import axios from 'axios';
import { expect, describe, test } from '@jest/globals';

import { paginate } from '../dist/server/searchservice/src/search.route';

const apiBase = 'http://localhost:5000';

describe('GET /search - happy path', () => {
  test('use default query params and return valid response', async () => {
    const { status, data } = await axios.get(`${apiBase}/search?term=pokey`);
    expect(status).toEqual(200);
  });

  test('allow query parameters input', async () => {
    const { status, data } = await axios.get(`${apiBase}/search?orderby=name&sortby=AUTO&term=pokey&page=1`);
    expect(status).toEqual(200);
  });
});

describe('GET /search - error handling', () => {
  test('issue bad request if no term', async () => {
    try {
      await axios.get(`${apiBase}/search?`);
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });

  test('issue bad request if orderby parameter is incorect', async () => {
    try {
      await axios.get(`${apiBase}/search?orderby=ss&term==pokey`);
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });

  test('issue bad request if sortby parameter is incorect', async () => {
    try {
      await axios.get(`${apiBase}/search?sortby=disc&term==pokey`);
    } catch (error) {
      expect(error.response.status).toEqual(400);
    }
  });
});

describe('The paginate function works as expected', () => {
  test('has no previous nav on first page', async () => {
    const url = `${apiBase}/search?orderby=name&sortby=AUTO&term=red&page=1`;
    const { next, previous } = paginate(url, true, 1, 'auto');
    expect(previous).not.toBeDefined();
    expect(next).toBeDefined();
    expect(typeof next).toEqual('string');
  });

  test('has correct next nav on first page', async () => {
    const url = `${apiBase}/search?orderby=name&sortby=AUTO&term=red&page=1`;
    const { next } = paginate(url, true, 1, 'auto');
    expect(typeof next).toEqual('string');
    expect(next.indexOf('page=2') != -1).toBeTruthy();
  });

  test('has correct previous and next navs on second page', async () => {
    const url = `${apiBase}/search?orderby=name&sortby=AUTO&term=red&page=2`;
    const { next, previous } = paginate(url, true, 2, 'auto');
    expect(next).toBeDefined();
    expect(typeof next).toEqual('string');
    expect(next.indexOf('page=3') != -1).toBeTruthy();

    expect(previous).toBeDefined();
    expect(typeof previous).toEqual('string');
    expect(previous.indexOf('page=1') != -1).toBeTruthy();
  });
});