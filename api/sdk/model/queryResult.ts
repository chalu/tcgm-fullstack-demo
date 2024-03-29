/**
 * TCG API Demo
 * A simple REST API for searching and listing trading game cards 
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Card } from './card';


export interface QueryResult { 
    /**
     * The total number of cards matching the search query
     */
    total: number;
    /**
     * A page of the cards matching the search query
     */
    data: Array<Card>;
}

