import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
// import FastfoodIcon from '@material-ui/icons/Fastfood'
// import LaptopMacIcon from '@material-ui/icons/LaptopMac'
// import HotelIcon from '@material-ui/icons/Hotel'
// import RepeatIcon from '@material-ui/icons/Repeat'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
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
