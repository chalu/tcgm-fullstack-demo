import axios from 'axios';

import type { Request, Response } from 'express';
import type { QueryResult } from '../../../api/sdk/model/queryResult';
import type { APIResponseError } from '../../../api/sdk/model/aPIResponseError';

import { SortByParam } from '../../../api/sdk/model/sortByParam';
import { OrderByParam } from '../../../api/sdk/model/orderByParam';

type APIResponse = APIResponseError | QueryResult

const searchEndpoint = async (req: Request, res: Response) => {
    let output: APIResponse;
    const ScryfallAPI = process.env['ScryfallBase'];

    const term = req.query['term'];
    const sortBy = `${req.query['sortby'] || SortByParam.Auto}`.toLowerCase();
    const orderBy = `${req.query['orderBy'] || OrderByParam.Name}`.toLowerCase();
    
    try {
      const url = `${ScryfallAPI}/cards/search?q=${term}&order=${orderBy}&dir=${sortBy}`;
      const { status, data} = await axios.get(url);
      console.warn(status);
      output = data;
    } catch (error) {
      console.warn(error);
      output = {
        message: 'Unable to handle your request at this time'
      };
    }
  
    res.json(output);
    
  }

export default searchEndpoint;