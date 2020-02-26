// import isomorphicFetch from "isomorphic-fetch";

const BASEURL = "http://localhost:5000/api";
export default ( url, method, body, token ) => {
    const options = {
        method,
        headers: requestHeaders( token ),
        body: method !== "GET" ? JSON.stringify( body ) : null,
    };

    url = BASEURL + url
    return fetch( url, options )
        .then( res => parseStatus( res.status, res.json() ) );
};

function parseStatus( status, res ) {
    return new Promise( ( resolve, reject ) => {
        if ( status >= 200 && status < 300 ) {
            res.then( response => resolve( response ) );
        } else {
            res.then( response => reject( { status, response } ) );
        }
    } );
}


function requestHeaders( token ) {
    if (!token)
        return {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
    else {
        return {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
}
