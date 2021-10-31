import { Box } from '@mui/system'
import React from 'react'
import SimpleAccordion from '../Components/Faq/Faq'
import Roadmap from '../Components/RoadMap/RoadMap'

const RoadMapScreen = () => {
    return (
        <Box mb={16}>
            <Roadmap />
            <SimpleAccordion />
        </Box>

    )
}

export default RoadMapScreen
