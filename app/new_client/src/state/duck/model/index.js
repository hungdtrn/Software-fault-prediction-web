/* INDEX FILE

This file, from a module perspective, behaves as the duck model form the original proposal.
It exports as default the reducer function of the duck.
It exports as named export the selectors and the operations.
Optionally it exports the actions and types if they are needed in other ducks.

*/

import modelReducer from './reducers'
import * as modelSelectors from './selectors'
import modelOperations from './operations'
import * as modelActions from './actions'
import * as modelTypes from './types'

export {
    modelSelectors,
    modelOperations,
    modelActions,
    modelTypes
}

export default modelReducer