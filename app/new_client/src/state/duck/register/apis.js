import fetch from "../../utils/fetch"

async function register( user ) {
    return await fetch("/auth/register", "POST", {
        ...user
    });
}

export {
    register
}