import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MyCard from '../Card/Card'
import AlertDialogSlide from '../Popup/Popup'
import { makeStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import './mynft.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const ListPopUp = ({ data }) => {
  const classes = useStyles()
  const [age, setAge] = React.useState('')
  const handleChange = (event) => {
    setAge(event.target.value)
  }
  return (
    <div className="listPopupContainer">
      <div className="itemFormMain">
        {/* <h1>List item for sale </h1> */}
        <div className="priceInp">
          <h5>Price</h5>
          <div className="itemInp">
            <FormControl variant="outlined" disabled className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                ETH
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={age}
                onChange={handleChange}
                label="ETH"
                color="secondary"
                
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-secondary"
              label="Price"
              variant="outlined"
              color="secondary"
              className="priInp"
              style={{marginLeft:'8px'}}
            />
          </div>
          <p className="botmPrice">${data.price}</p>
        </div>
      </div>
      <div className="previewMain">
        <h2>Preview</h2>
        <div className="previewCard">
          {data.img ? (
            <img src={data.img} alt="..." />
          ) : (
            <video loop autoPlay muted>
              <source src={data.video} type="video/mp4" />
            </video>
          )}
          <div className="prevCardBody">
            <div className="prevPrice">
              <div className="priceDetail">
                <p className="grey">lorem ispum dolor</p>
                <p>{data.title}</p>
              </div>
              <p className="price">{data.price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MyNft = () => {
  const cardSelector = useSelector((state) => {
    return state.reducer.myNftCard
  })

  const [open, setOpen] = React.useState(false)
  let [selectedItem, setSelectedItem] = useState({})

  const handleClickOpen = (event) => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  
  const handleBuyItem = (event) => {
    setSelectedItem(event)
  }

  return (
    <div className="myNftContainer" id="mynft">
      {/* <h1 className="myHead">My NFTs <hr className='cusHr' /></h1> */}
      <AlertDialogSlide
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        title='List item for sale'
        btnValue='Complete Listing'
        headColor='#d32f2f'
        children={<ListPopUp data={selectedItem} />}
      />
      <MyCard
        data={cardSelector}
        dots
        menu
        handleSellPopup={handleClickOpen}
        handleBuyNow={handleBuyItem}

      />
    </div>
  )
}

export default MyNft
