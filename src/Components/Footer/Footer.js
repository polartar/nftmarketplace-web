import React from "react";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import TwitterIcon from '@mui/icons-material/Twitter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import "./footer.css"
import "../../App.css"

import { AppBar, Toolbar, IconButton, Typography, Box, Link } from "@mui/material";


const Footer = () => {
  return(
    <AppBar position="fixed" color="inherit" sx={{ top: 'auto', bottom: 0, zIndex: 9 }}>
        <Toolbar className='toolbar'>
            <IconButton size='large' color='primary' aria-label='email' target='_blank' href='mailto:admin@ebisusbay.com'>
              <MailOutlineIcon className='icons' />
            </IconButton>
            <IconButton color='primary' aria-label='twitter' target='_blank' href='https://twitter.com/EbisusBay'>
              <TwitterIcon className='icons'/>
            </IconButton>
            <IconButton color='primary' aria-label='discord' target='_blank' href='https://discord.gg/ebisusbay'>
              <FontAwesomeIcon icon={faDiscord} className='discord'/>
            </IconButton>
        </Toolbar>
        <Typography variant='body2' align='center' color='primary' className='footer'>
                Copyright © 2021 EbisusBay.com. All rights reserved
                <Link  target='_blank' href='/tos.html' underline='hover'>
              {' | Terms of Service'}
          </Link>
              </Typography>
    </AppBar>
  )
};

export default Footer;

