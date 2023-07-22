import {
    CHANNELPASSWORD_REQUEST,
    CHANNELPASSWORD_SUCCESS,
    CHANNELPASSWORD_FAIL
} from '../actionType'

export const channelPasswordReducer = (
   state = {
      loading: true,
      status: null,
   },
   action
) => {
   const { payload, type } = action

   switch (type) {
      case CHANNELPASSWORD_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case CHANNELPASSWORD_SUCCESS:
         return {
            ...state,
            status: "success",
            loading: false,
            password: payload
         }
      case CHANNELPASSWORD_FAIL:
         return {
            ...state,
            loading: false,
            error: payload,
            status: "fail"
         }
      default:
         return state
   }
}
