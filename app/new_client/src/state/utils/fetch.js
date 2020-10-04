// import isomorphicFetch from "isomorphic-fetch";

const BASEURL = "http://13.212.52.40:5000/api";
export default (url, method, body, token, is_form) => {
    const options = {
        method,
        headers: requestHeaders(token, is_form),
        body: method !== "GET" ? is_form ? body : JSON.stringify(body) : null,
    };

    url = BASEURL + url
    return fetch(url, options)
        .then(res => parseStatus(res.status, res.json()));
};

function parseStatus(status, res) {
    return new Promise((resolve, reject) => {
        if (status >= 200 && status < 300) {
            res.then(response => resolve(response));
        } else {
            res.then(response => reject({ status, response }));
        }
    });
}


function requestHeaders(token, is_form) {
    let BASE_JSON = {}
    if (is_form) {
        BASE_JSON = {
        }
    } else {
        BASE_JSON = {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    }
    if (!token)
        return {
            ...BASE_JSON
        };
    else {
        return {
            ...BASE_JSON,
            "Authorization": "Bearer " + token
        }
    }
}
