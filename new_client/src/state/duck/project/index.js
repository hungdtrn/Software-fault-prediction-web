/* INDEX FILE

This file, from a module perspective, behaves as the duck file form the original proposal.
It exports as default the reducer function of the duck.
It exports as named export the selectors and the operations.
Optionally it exports the actions and types if they are needed in other ducks.

*/

import { projectReducer } from './reducers'
import * as projectSelectors from './selectors'
import projectOperations from './operations'
import * as projectActions from './actions'
import * as projectTypes from './types'

export {
    projectSelectors,
    projectOperations,
    projectActions,
    projectTypes
}

export default projectReducer