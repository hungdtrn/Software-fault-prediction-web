/* INDEX FILE

This file, from a module perspective, behaves as the duck file form the original proposal.
It exports as default the reducer function of the duck.
It exports as named export the selectors and the operations.
Optionally it exports the actions and types if they are needed in other ducks.

*/

import { registerReducer } from './reducers'

import * as registerSelectors from './selectors'
import registerOperations from './operations'
import * as registerActions from './actions'
import * as registerTypes from './types'

export {
    registerSelectors,
    registerOperations,
    registerActions,
    registerTypes
};

export default registerReducer;
