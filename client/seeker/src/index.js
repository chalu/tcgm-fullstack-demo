import { waitUntilASec } from "./utils";

let InProgress = true;
const apiBase = 'https://chalu-silver-cod-4wvgjrqww35q9q-5000.preview.app.github.dev';

const startApp = () => {
    const form = document.querySelector('#form');
    form.addEventListener("submit", attemptSubmit);
    const searchField = form.querySelector("input[type=text]");
    searchField.focus();
};

const attemptSubmit = (event) => {
    event.preventDefault();

    const field = event.target.term;
    if (!field.validity.valid) return;

    searchAndDisplayResults(field.value);
};

const searchForTerm = (term) => {
    return async () => {
        try {
            const resp = await fetch(`${apiBase}/search?term=${term}`);
            return await resp.json();
        } catch (error) {
            console.warn(error);
        }
    };
};

const searchAndDisplayResults = async (term) => {
    // if not the first call, delay it for 1 second
    const apiCall = InProgress === true ? 
        waitUntilASec(searchForTerm(term)) : searchForTerm(term);
    
    const resp = await apiCall();
    console.log(resp);
    InProgress = false;

};

document.addEventListener("DOMContentLoaded", startApp);