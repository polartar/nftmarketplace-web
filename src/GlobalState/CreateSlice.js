import {createSlice} from '@reduxjs/toolkit'
import {InitialState} from './InitialState'

const  NFTSlice = createSlice({
    name:'nft',
    initialState:InitialState,
    // reducers:{
      
    // }
})

export const reducer = NFTSlice.reducer