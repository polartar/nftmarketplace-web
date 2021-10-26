import React from 'react'
import SimpleAccordion from '../Components/Faq/Faq'
import Header from '../Components/Header/Header'
import RoadMap from '../Components/RoadMap/index'

const RoadMapScreen = () => {
    return (
        <div>
            <Header />
            <RoadMap />
            <SimpleAccordion />
        </div>
    )
}

export default RoadMapScreen
