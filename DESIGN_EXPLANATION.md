b# Design, Decisions & Thoughts

Hello 👋,

Thanks for putting the assessment together. I enjoyed taking the chalenge, though it stretched me in some areas. Below are some things in my implementation that I believe are worthy of note.

## What Counts ?

 

> ### Key Assets Delivered
>
> ***
>
> 1.  The backend [API spec](./api/spec/api.yaml), deployed at <https://tcg-api-demo.onrender.com> as documentation for integrators
> 2.  The backend [search service](./server/searchservice), deployed at [https://tcg-backend-demo.onrender.com](https://tcg-backend-demo.onrender.com/)
> 3.  The frontend [React search client](./client/r-seeker), deployed at <https://tcg-react-client-demo.onrender.com>

 
 

### Requirements

1.  ✅ Backend - Using Node, Express & Typescript:
    *   ✅ Create a single **REST** endpoint to retrieve a list of Magic cards from the Scryfall API based on a provided search string from the client.
    *   ✅ Read the Scryfall API url from a `.env` file (in dev mode) / environment variables (in prod)
2.  ✅ Frontend - Using React & Typescript:
    *   ✅ Build a search bar to input a card name to search and then make a call to your Node endpoint to lookup cards. The search should work without the user needing to click a button. And it should be impossible for a user to submit more than `1` API request per second using this search bar.
    *   ✅ Display the card results to the user. All cards must display the following: The card's image(s), name, set name, number, and rarity.
3.  ✅ General TypeScript/ES6 knowledge
4.  ✅ Bonus:
    *   ✅ Node endpoint tested using a framework of your choice
    *   ✅ Frontend pagination. Not enough time to support sorting results in the UI, but it is supported in the API/backend
    *   ✅ Design aesthetically pleasing and responsive in the browser
    *   ✅ Entire interface is styled using [Tailwindcss](https://tailwindcss.com)

## Implementation Details

### Monorepo Approach

I elected to use pnpm workspaces as a monorepo structure for the project. This helps to better manage multiple sub-projects / modules within a single monolithic codebase, but with better dependency management and code reuse.

For instance, [expressbare and logger](https://github.com/chalu/tcgm-fullstack-demo/tree/main/shared) are independent sub-modules which the backend `searchservice` adds as dependencies in its own package.json file. With this, the `searchservice` focuses on implementing the `/search` endpoint and does not worry about setting up Express or logging

### API-first Approach

> The API-first approach prioritizes APIs at the beginning of the software development process, positioning APIs as the building blocks of software. API-first organizations develop APIs before writing other code, instead of treating them as afterthoughts\
>    -- [postman.com/api-first/](postman.com/api-first/)

Adopting an API-first approach enabled me prioritise designing the API (contract between the React frontend and Node backend service) using the OpenAPI standard, and treating the API as a first class citizen in the project.

With this, the project can benefit from generating API [documentation](https://tcg-api-demo.onrender.com) for integrators, generating Typescript [types/interfaces](https://github.com/chalu/tcgm-fullstack-demo/tree/main/api/sdk/model) that the dependent services (e.g frontend and backend) can (re)use, and potentially build/test/mock/deploy the API without affecting/breaking other services.

The API spec clearly specifies:

1.  The shape and form of query parameters in the `/search` endpoint, including data types and contraints. Models are defined and refereced throughout the spec. These models get generated into Typescript types/interfaces that the backend and frontend can reuse if they so desire
2.  A home endpoint so that there's a basic response if anyone hits the `/` endpoint apart from the `/search` endpoint that gets something meaningful done.

### Backend [Search Service](./server/searchservice)

1.  (re)uses the [expressbare and logger sub-modules](https://github.com/chalu/tcgm-fullstack-demo/tree/main/shared) I created in the monorepo. This makes the backend search service's code cleaner, leaner, more focused and more maintainable.
2.  Uses a *3rd party middleware* to automatically validate incoming requests and auto respond with `4xx` errors [if the request does not confirm with the API spec](https://github.com/chalu/tcgm-fullstack-demo/blob/main/server/searchservice/src/index.ts#L18-L22). This means the backend **validation and unit tests** can focus on business logic - if any (not if the search term is `0` chars long 🙃). A major win for API-first design!
3.  (re)use Typescript [types/interfaces](./api/sdk/model) generated from the API spec. Yet another win for API-first design!
4.  Though the requirements hinted on not allowing the UI to issue more than one search within 1 second, I went ahead and added [a rate-limiter](https://github.com/chalu/tcgm-fullstack-demo/blob/main/server/searchservice/src/index.ts#L24-L29) *(with a 3rd party module)* to the backend so that the behaviour will apply even to integrators/clients who call the backend directly instead of using the React app.
5.  Since the backend relies on the external **Scryfall API**, I added [exponential backoff and retries](./server/searchservice/src/search.route.ts#L44-L55) *(with a 3rd party module)* when calling the Scryfall API. This adds more resilience to the backend, even when (not if) the Scryfall API is slow or down.
6.  Though the Scryfall API supports paignation by indicating if there's a `next` page in a result list and also providing a link to the said next page, my backend service computes a `previous` page link where applicable. This allows the frontend client to easily setup two-way navigation across search results.

### Frontend [React Client](./client/r-seeker)

> PS: I initially created [this client](https://tcg-frontend-demo.onrender.com) in vanilla [HTML/CSS/Javascript](./client/v-seeker) because correctly scaffolding the React project with Parceljs and Tailwindcss (my preference over create-react-app) was problematic. I switched back to React once I figured things out 🙃!

1.  The search input field applies basic validation (`minLength` and `required`) which conforms with the backend API but the client also eforces similar validation with a `/^\w{3,}$/` RegEx before attempting to issue a search call. The extra RegEx validation helps to ensure *power* users (e.g developers) who can disable event handling or validation in the UI/input/form are still not allowed to get nonsense search terms through to the backend.

2.  The `App` component manages and centralizes common application state across its children `SearchBar`, `ResultsView` and `Footer` components.

3.  The `ResultsView` component acknowleges its empty state and displays a nice message welcoming users to take action and enter a search term.

4.  The `CardView` component uses a placeholder image for cases where the returned card from the ScryFall API does not have an image.

5.  Users can paginate over large search results such that they'd know their current page and can use the next/previous buttons which also automatically gets disabled at the right point during pagination. Note that the Scryfall API only provides a *next* page while our implementation provides two-way next/previous pages

6.  Both the React and vanilla clients reuse the shared [clientcore](./shared/clientcore) which handles calling the backend API and ensures only the right number of calls go out to the backend.
