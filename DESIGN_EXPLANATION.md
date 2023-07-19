# Design, Decisions & Thoughts

Hello 👋,

Thanks for putting the assessment together. I enjoyed taking the chalenge, though it stretched me in some areas. Below are some things in my implementation that I believe are worthy of note.

## What Counts ?

> ##### Key Assets Delivered
> ---
> 1. The backend [API spec]('https://github.com/chalu/tcgm-fullstack-demo/blob/main/api/spec/api.yaml'), deployed at [https://tcg-api-demo.onrender.com]('https://tcg-api-demo.onrender.com') as documentation for integrators
> 2. The backend [search service](https://github.com/chalu/tcgm-fullstack-demo/tree/main/server/searchservice), deployed at [https://tcg-backend-demo.onrender.com]('https://tcg-backend-demo.onrender.com/')
> 3. The frontend [React search client](https://github.com/chalu/tcgm-fullstack-demo/tree/main/client/r-seeker), deployed at [https://tcg-react-client-demo.onrender.com]('https://tcg-react-client-demo.onrender.com')
---

### Requirements
1.  ✅ Backend - Using Node, Express & Typescript:
    -   ✅ Create a single **REST** endpoint to retrieve a list of Magic cards from the Scryfall API based on a provided search string from the client.
    -   ✅ Read the Scryfall API url from a `.env` file (in dev mode) / environment variables (in prod)
2.  ✅ Frontend - Using React & Typescript:
    -   ✅ Build a search bar to input a card name to search and then make a call to your Node endpoint to lookup cards. The search should work <ins>without</ins> the user needing to click a button. And it should be impossible for a user to submit more than `1` API request per second using this search bar.
    -   ✅ Display the card results to the user. All cards must display the following: The card's image(s), name, set name, number, and rarity.
3.  ✅ General TypeScript/ES6 knowledge
4.  ✅ Bonus:
    -   ✅ Node endpoint tested using a framework of your choice
    -   ✅ Frontend pagination. Not enough time to support sorting results in the UI, but it is supported in the API/backend
    -   ✅ Design aesthetically pleasing and responsive in the browser
    -   ✅ Entire interface is styled using [Tailwindcss](https://tailwindcss.com) 

