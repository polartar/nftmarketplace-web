import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useSelector } from 'react-redux'
import './faq.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '92%',
    margin: '50px auto',
    marginBottom: '50px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    // color:'black'
  },
  text: {
    // color: 'black',
    fontSize: '1.1rem',
    fontWeight:'500'
  },
  border:{
    border:`1px solid ${theme.palette.primary.main}`
  }
}))

const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
    margin: '15px 0px',
  },

  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    marginBottom: -1,
    minHeight: 56,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, .125) ',
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails)
export default function SimpleAccordion() {
    const classes = useStyles()
  const faqSelector = useSelector((state) => {
    return state.reducer.faq
  })

  return (
    <div className={`${classes.root} faqContainer`}>
        {/* <h1 className="faqHead">Frequently Asked Question <hr className='cusHr' /></h1> */}
      {faqSelector.map((val,j) => {
        return (
          <Accordion square TransitionProps={{ unmountOnExit: true,timeout:400 }}   key={j}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className='expendIcon' color='inherit' />}
              aria-controls={val.tab}
              id={val.id}
              className={classes.border}
            >
              <Typography className={classes.heading} color='primary'>{val.head}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography  className={`${classes.text}  faqText`} color='primary' >{val.desc}</Typography>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </div>
  )
}
