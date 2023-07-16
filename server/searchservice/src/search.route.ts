import axios from 'axios';

import type { Request, Response } from 'express';
import type { Card } from '../../../api/sdk/model/card';
import type { CardPrices } from '../../../api/sdk/model/cardPrices';
import type { Pagination } from '../../../api/sdk/model/pagination';
import type { QueryResponse } from '../../../api/sdk/model/queryResponse';
import type { CardImageURIs } from '../../../api/sdk/model/cardImageURIs';
import type { APIResponseError } from '../../../api/sdk/model/aPIResponseError';

import { SortByParam } from '../../../api/sdk/model/sortByParam';
import { OrderByParam } from '../../../api/sdk/model/orderByParam';

type APIResponse = APIResponseError | QueryResponse

type CardsList = {
  total_cards: number;
  has_more: boolean;
  data: Card[];
};

const searchEndpoint = async (req: Request, res: Response) => {
  let output: APIResponse;

  const ScryfallAPI = process.env['ScryfallBase'];

  const term = req.query['term'];
  const page = parseInt(`${req.query['page'] || 1}`, 10);
  const sortBy = `${req.query['sortby'] || SortByParam.Auto}`.toLowerCase();
  const orderBy = `${req.query['orderBy'] || OrderByParam.Name}`.toLowerCase();

  try {
    const url = `${ScryfallAPI}/cards/search?q=${term}&order=${orderBy}&dir=${sortBy}&page=${page}`;
    const { data } = await axios.get(url);
    output = parseForResponse(data, url, page, sortBy);
    console.log(req?.headers?.host);
  } catch (error) {
    console.warn(error);
    output = {
      message: 'Unable to handle your request at this time'
    };
  }

  res.json(output);

}

const parseCard = (raw: Card): Card => {
  const { id, name, lang, uri, released_at, games, foil, nonfoil, prices, image_uris } = raw;

  const parsedImgs: CardImageURIs = {};
  if (image_uris?.small) parsedImgs.small = image_uris.small;
  if (image_uris?.normal) parsedImgs.normal = image_uris.normal;
  if (image_uris?.large) parsedImgs.large = image_uris.large;

  const parsedPrices: CardPrices = {};
  if (prices?.usd) parsedPrices.usd = prices.usd;
  if (prices?.eur) parsedPrices.eur = prices.eur;

  const parsed: Card = {
    id, name, lang,
    uri, released_at,
    prices: parsedPrices,
    image_uris: parsedImgs,
    foil: foil === true, nonfoil: nonfoil === true
  };

  if (games?.length) parsed.games = games;

  return parsed;
};

const paginate = (fullUrl: string, hasMore: boolean, page: number, sortBy: string): Pagination => {
  const nav: Pagination = {};

  const fixParamsForAPIClients = (uri: string) => {
    return uri
      .replace(/q=/, 'term=')
      .replace(/order=/, 'orderby=')
      .replace(/dir=\w+/, `sortby=${sortBy.toUpperCase()}`);
  }

  const url = fullUrl.substring(fullUrl.indexOf('/search'));

  if (page >= 2) {
    const link = `${url}`.replace(/page=\d+/, `page=${page - 1}`);
    nav.previous = fixParamsForAPIClients(link);
  }

  if (hasMore === true) {
    const link = `${url}`.replace(/page=\d+/, `page=${page + 1}`);
    nav.next = fixParamsForAPIClients(link);
  }

  return nav;
}

const parseForResponse = (list: CardsList, url: string, page: number, sortBy: string): QueryResponse => {
  const { has_more, total_cards } = list;

  const cards: Card[] = [];
  const nav = paginate(url, has_more, page, sortBy);
  const response: QueryResponse = {
    total: total_cards,
    ...nav,
    data: cards
  };

  for (const crd of list.data) {
    cards.push(parseCard(crd));
  }

  return response;
};

export default searchEndpoint;