import React from 'react'
import makeStyles from '@mui/styles/makeStyles';
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineDot from '@mui/lab/TimelineDot'
// import FastfoodIcon from '@mui/icons-material/Fastfood'
// import LaptopMacIcon from '@mui/icons-material/LaptopMac'
// import HotelIcon from '@mui/icons-material/Hotel'
// import RepeatIcon from '@mui/icons-material/Repeat'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
// import AOS from 'aos'
// import 'aos/dist/aos.css'
import './roadmap.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50px',
    borderTopRightRadius: '50px',
    borderBottomRightRadius: '50px',
    border: `1px solid ${theme.palette.primary.main}`,
  },
}))

export default function TimeLine() {
  const classes = useStyles()

  // useEffect(() => {
  //   AOS.init()
  // }, [])
  return (
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent></TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent 
        // data-aos="fade-right" data-aos-once="true"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color="primary">Commemorative and membership NFTs drop.</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent
          // data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="10"
          // data-aos-duration="1000"
          // data-aos-once="true"
          // data-aos-easing="ease-in-out"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color="primary">
              Marketplace opens on Cronos and Songbird networks. Members can
              post their NFTs for sale.
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent
          // data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="20"
          // data-aos-duration="1000"
          // data-aos-once="true"
          // data-aos-easing="ease-in-out"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color='primary'>
              Auction house opens, members can post items up for bid.
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent
          // data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="30"
          // data-aos-duration="1000"
          // data-aos-once="true"
          // data-aos-easing="ease-in-out"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color="primary">
              Member profiles, collections, and advanced filtering and searches.
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent
          // data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="40"
          // data-aos-duration="1000"
          // data-aos-easing="ease-in-out"
          // data-aos-once="true"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color="primary">
              The Mint Opens! Members will be able to mint their own NFTs.
            </Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" />
        </TimelineSeparator>
        <TimelineContent
          // data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="50"
          // data-aos-duration="1000"
          // data-aos-easing="ease-in-out"
          // data-aos-once="true"
        >
          <Paper elevation={2} className={classes.paper}>
            <Typography color="primary">The Launchpad opens.</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
