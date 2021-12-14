import { Box } from '@mui/system'
import {React, useEffect} from 'react'
import { useParams } from "react-router-dom";
import Drop from '../Components/Drop/Drop'
import { getAnalytics, logEvent } from '@firebase/analytics'

const DropScreen = () => {
    let { id } = useParams();
    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'drop',
            drop_id: id
        })
    }, []);

    return (
        <Box mt={10} mb={16}>
            <Drop dropId={id}/>
        </Box>
    )
}

export default DropScreen
