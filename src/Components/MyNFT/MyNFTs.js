import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {
    Button,
    CardMedia,
    Container,
    Grid,
    Typography
} from '@mui/material'

import { getAnalytics, logEvent } from '@firebase/analytics'