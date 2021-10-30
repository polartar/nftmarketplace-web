import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MyCard from '../Card/Card'
import AlertDialogSlide from '../Popup/Popup'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'
import Radio from '@mui/material/Radio'
import './marketplace.css'


const ShowPopUpList = ({ data }) => {
  const [selectedValue, setSelectedValue] = React.useState('')
  let [counter, setCounter] = React.useState(1)

  const handleChange = (event) => {
    setSelectedValue(event.target.value)
  }
  const handleAddItem = (event) => {
    if (counter > 0 && event === 'minus') {
      setCounter(--counter)
    }
    if (event === 'add') {
      setCounter(++counter)
    }
  }
  return (
    <div className="selecteditemBox">
      <div className="itemHead">
        <h4>Item</h4>
        <h4>Subtotal</h4>
      </div>
      <div className="itemList">
        <div className="itemInfo">
          {data.img ? (
            <img className="itemImg" src={data.img} alt="..." />
          ) : (
            <video className="itemImg" loop autoPlay muted>
              <source src={data.video} type="video/mp4" />
            </video>
          )}
          <div className="iInfo">
            <p className="blue">InterGalctic alien</p>
            <p className="name">{data.title}</p>
            <p className="smP">RayalTies: 7%</p>
          </div>
        </div>
        <div className="itemCounter">
          <button onClick={() => handleAddItem('minus')}>
            <RemoveOutlinedIcon className="itemIcon" />
          </button>
          <p>{counter}</p>
          <button onClick={() => handleAddItem('add')}>
            <AddOutlinedIcon className="itemIcon" />
          </button>
        </div>
        <div className="itemPri">
          <h5>5343</h5>
          <p>3%443.44</p>
        </div>
      </div>
      <div className="itemTotal">
        <h4>Total</h4>
        <div className="totalBlnce">
          <h4>0.07343</h4>
          <p>$554.5435</p>
        </div>
      </div>
      <div className="checkItem">
        <Radio
          checked={selectedValue === 'a'}
          onChange={handleChange}
          value="a"
          name="radio-button-demo"
          inputProps={{ 'aria-label': 'A' }}
        />
        <div className="termsDiv">
          By checking this box, I agree to Opensea's{' '}
          <button>Terms of Service</button>{' '}
        </div>
      </div>
    </div>
  )
}

const MarketPlace = () => {
  const cardSelector = useSelector((state) => {
    return state.reducer.marketplaceCard
  })
  const [open, setOpen] = React.useState(false)
  let [selectedItem, setSelectedItem] = useState({})

  const handleClickOpen = (event) => {
    setOpen(true)
    // console.log(event)
    setSelectedItem(event)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className="marketplaceContainer" id="market">

      <AlertDialogSlide
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        children={<ShowPopUpList data={selectedItem} />}
        title='Complete Purchase'
        headColor='#d32f2f'
        btnValue='Confirm checkout'
      />
      <MyCard data={cardSelector} value dots handleBuyNow={handleClickOpen} />

    </div>
  )
}

export default MarketPlace
