/* INDEX FILE

This file, from a module perspective, behaves as the duck file form the original proposal.
It exports as default the reducer function of the duck.
It exports as named export the selectors and the operations.
Optionally it exports the actions and types if they are needed in other ducks.

*/

import userReducer from './reducers'
import * as userSelectors from './selectors'
import userOperations from './operations'
import * as userActions from './actions'
import * as userTypes from './types'

export {
    userSelectors,
    userOperations,
    userActions,
    userTypes
}

export default userReducer