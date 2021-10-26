import {configureStore} from '@reduxjs/toolkit'
import {reducer} from '../GlobalState/CreateSlice'

export const store = configureStore({
    reducer:{
        reducer
    }
})