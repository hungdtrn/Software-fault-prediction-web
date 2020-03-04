/* INDEX FILE

This file, from a module perspective, behaves as the duck file form the original proposal.
It exports as default the reducer function of the duck.
It exports as named export the selectors and the operations.
Optionally it exports the actions and types if they are needed in other ducks.

*/

import fileReducer from './reducers'
import * as fileSelectors from './selectors'
import fileOperations from './operations'
import * as fileActions from './actions'
import * as fileTypes from './types'

export {
    fileSelectors,
    fileOperations,
    fileActions,
    fileTypes
}

export default fileReducer