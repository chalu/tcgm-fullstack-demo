import axios from 'axios';

import type { Request, Response } from 'express';
import type { APIResponse } from '../../../api/sdk/model/aPIResponse';

const searchEndpoint = async (req: Request, res: Response) => {
    const query = req.query['q'];
    let output: APIResponse;
    try {
      const url = `https://api.scryfall.com/cards/search?q=${query}`;
      const { status, data} = await axios.get(url);
  
      console.log(status);
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