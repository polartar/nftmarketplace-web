import { Box } from '@mui/system'
import {React, useEffect} from 'react'
import SimpleAccordion from '../Components/Faq/Faq'
import Roadmap from '../Components/RoadMap/RoadMap'
import { getAnalytics, logEvent } from '@firebase/analytics'

const RoadMapScreen = () => {

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'marketplace'
        })
    }, []);

    return (
        <Box mb={16}>
            <Roadmap />
            <SimpleAccordion />
        </Box>

    )
}

export default RoadMapScreen
