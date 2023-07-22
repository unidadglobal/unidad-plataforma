import { createStore, applyMiddleware, combineReducers } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import { authReducer } from './reducers/auth.reducer'
import {
   relatedVideoReducer,
} from './reducers/videos.reducer'
import { selectedVideoReducer } from './reducers/videos.reducer'
import { noticiasReducer } from './reducers/noticias.reducer'
import { radioReducer } from './reducers/radio.reducer'
import { publicidadReducer } from './reducers/publicidad.reducer'
import { searchReducer } from './reducers/search.reducer'
import { webinfoReducer } from './reducers/webinfo.reducer'
import { channelPasswordReducer } from './reducers/channelPassword.reducer'

const rootReducer = combineReducers({
   auth: authReducer,
   selectedVideo: selectedVideoReducer,
   relatedVideos: relatedVideoReducer,
   noticias: noticiasReducer,
   radio: radioReducer,
   publicidad: publicidadReducer,
   search: searchReducer,
   webinfo: webinfoReducer,
   channelPassword: channelPasswordReducer
})

const store = createStore(
   rootReducer,
   {},
   composeWithDevTools(applyMiddleware(thunk))
)

export default store