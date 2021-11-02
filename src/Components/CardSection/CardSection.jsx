import React, {useState} from 'react'
import MyCard from '../Card/Card'
import {useSelector} from 'react-redux'
import './cardSec.css'
import { 
    Button,
    CardMedia, 
    Container, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    Grid, 
    Stack, 
    Typography, 
    useMediaQuery 
} from '@mui/material'

import { useTheme } from '@mui/material/styles';


const CardSection = () => {
    const cardSelector = useSelector((state)=>{
        return state.reducer.nftCard
    })
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false)
    let [selectedItem, setSelectedItem] = useState({})
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen = (event) => {
        setOpen(true)
        setSelectedItem(event)
      }

    return (
        <Container>
            <div className='cardSectContainer'>
                <MyCard data={cardSelector} handleActionArea={handleClickOpen}/>
            </div>
            <Dialog
             open={open}
             onClose={handleClose}
             fullScreen={fullScreen}
             maxWidth='lg'>
                 <DialogContent dividers={true}>
                    <Grid container spacing={{sm : 4}} columns={fullScreen ? 1 : 2}>
                        <Grid item xs={2} md={1} key='1'>
                            <Container>
                                <CardMedia component='img' src={selectedItem.img} width='350' />
                            </Container>
                        </Grid>
                        <Grid item xs={1} key='2' >
                        <Stack spacing={2} direction='column' alignItems='flex-start'>
                            <Stack spacing={2} direction='row' alignItems='baseline'>
                                <Typography  variant="h5" color='primary' component="p">
                                    {selectedItem.title}
                                </Typography>
        
                                <Typography variant='subtitle2' component='p'>
                                    {selectedItem.price} CRO
                                </Typography>
                            </Stack>
                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p1}
                            </Typography>
                            <Typography variant='subtitle1' component='p'>
                                {selectedItem.p2}
                            </Typography>
                        </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>

    )
}

export default CardSection
