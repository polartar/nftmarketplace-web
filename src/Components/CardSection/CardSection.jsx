import React from 'react'
import MyCard from '../Card/Card'
import {useSelector} from 'react-redux'
import './cardSec.css'

const CardSection = () => {
    const cardSelector = useSelector((state)=>{
        return state.reducer.nftCard
    })
    return (
        <div className='cardSectContainer'>
            <MyCard data={cardSelector} />
        </div>
    )
}

export default CardSection
