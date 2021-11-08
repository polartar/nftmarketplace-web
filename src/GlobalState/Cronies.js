import {createSlice} from '@reduxjs/toolkit'

const cronieSlice = createSlice({
    name: 'cronies',
    initialState: {
        price : 100,
        maxMint : 5,
        discount: 0,
        count : 0,
        max : 10000
    },
    reducers: {

    }
})

export const cronies = cronieSlice.reducer;
