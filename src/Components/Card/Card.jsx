import React from 'react'
import {makeStyles} from '@mui/styles';
import {
  Card,
  CardActions,
  Button,
  Typography,
  Menu,
  MenuItem,
  Grid
} from '@mui/material'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import './card.css'
import 'aos/dist/aos.css'

const useStyles = makeStyles((theme) => ({
  root2: {
    maxWidth: 330,
    borderRadius: '15px 15px 15px 15px',
    margin:'10px auto',
    // border:'1px solid',
    background:'transparent'
  },

  media: {
    height: 140,
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

export default function MyCard({
  data,
  dots,
  value,
  menu,
  handleSellPopup,
  handleBuyNow,
}) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div className={`${classes.root} cardContainer `}>
      <Grid container spacing={1} justifyContent="center"  alignItems="center">
        {data.map((val, j) => {
          // console.log(val)
          return (
            <Grid item xs={12} xl={4} lg={4} md={4} sm={6}  key={j}>
              <Card
                className={`${classes.root2} cusClassCard`}
                
                // data-aos="fade-up"
                // data-aos-offset="200"
                // data-aos-delay="10"
                // data-aos-duration="1000"
                // data-aos-easing="ease-in-out"
              >
                {/* <CardActionArea> */}
                {val.img ? (
                  <img className="cardImgs" src={val.img} alt="..." />
                ) : (
                  <video className="cardImgs" loop autoPlay muted>
                    <source src={val.video} type="video/mp4" />
                  </video>
                )}
                <div className="cardBody">
                  <div className="cardTitle">
                  <Typography  variant="h5" color='primary' component="p">
                    {val.title}
                  </Typography>
                  <p className="cardPriceTag">Price</p>
                  </div>
                  <div className="cardDecs">

                  <Typography className='cDecs' component="p">
                    {val.descs}
                  </Typography>
                  <p className="price">5433</p>
                  </div>
                </div>
                {/* </CardActionArea> */}
                {dots ? (
                  <CardActions className='bordershow'>
                    <Button
                      // size="small"
                      // color="primary"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={
                        !value
                          ? (event) => {
                              handleClick(event)
                              handleBuyNow(val)
                            }
                          : () => handleBuyNow(val)
                      }
                      // className="btnClr"
                      color='primary'
                    >
                      {value ? 'Buy Now' : <MoreVertIcon />}
                    </Button>
                    {/* menu for ny nft section  */}
                    {menu ? (
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        
                      >
                        <MenuItem
                          onClick={() => {
                            handleClose()
                            handleSellPopup()
                          }}
                        >
                          Sell
                        </MenuItem>
                        <MenuItem onClick={handleClose}>Copy Link</MenuItem>
                        <MenuItem onClick={handleClose}>Transfer</MenuItem>
                      </Menu>
                    ) : null}
                  </CardActions>
                ) : null}
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
