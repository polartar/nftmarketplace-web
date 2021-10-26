import React from 'react'
import TimeLine from './RoadMap'
import './roadmap.css'

const RoadMap = () => {
    return (
        <div className='roadMapContainer' id='roadmap'>
            {/* <h1>RoadMap <hr className='cusHr' /></h1> */}
            <div className="roadmapMain">

            <TimeLine />
            </div>
        </div>
    )
}

export default RoadMap
