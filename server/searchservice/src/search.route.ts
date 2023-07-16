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
  const sortBy = `${req.query['sortby'] || SortByParam.Auto}`.toLowerCase();
  const orderBy = `${req.query['orderBy'] || OrderByParam.Name}`.toLowerCase();

  try {
    const url = `${ScryfallAPI}/cards/search?q=${term}&order=${orderBy}&dir=${sortBy}`;
    const { data } = await axios.get(url);
    output = parseForResponse(data, url);
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

const paginate = (url: string, hasMore: boolean): Pagination => {
  const nav: Pagination = {};
  if (hasMore === true) {
    // TODO compute correct URL
    nav.next = `${url}`;
  }

  // TODO maybe url param can tell if we are paginated
  // can we then set out.previous?

  return nav;
}

const parseForResponse = (list: CardsList, url: string): QueryResponse => {
  const { has_more, total_cards } = list;

  const cards: Card[] = [];
  const nav = paginate(url, has_more);
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