import { Box } from '@mui/system'
import {React, useEffect} from 'react'
import Drop from '../Components/Drop/Drop'
import { getAnalytics, logEvent } from '@firebase/analytics'

const DropScreen = () => {
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'drop'
        })
    }, []);

    return (
        <Box mt={10} mb={16}>
            <Drop />
        </Box>
    )
}

export default DropScreen
