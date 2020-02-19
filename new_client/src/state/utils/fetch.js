// import isomorphicFetch from "isomorphic-fetch";

const BASEURL = "http://localhost:5000/api";
export default ( url, method, body ) => {
    const options = {
        method,
        headers: requestHeaders( ),
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

function requestHeaders( ) {
    return {
        Accept: "application/json",
        "Content-Type": "application/json",
    };
}
