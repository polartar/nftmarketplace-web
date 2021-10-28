import { useState, useRef } from 'react'
import './header.css'
import mainLogo from "../../Assets/web_logo.svg"
import { NavLink } from 'react-router-dom'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
// import {NavTabs} from '../../Router/Router';

const Header = () => {
  const [activeNav, sectActiveNav] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const deskHeader = useRef()
  // let lastScroll = 0
  // const headerSticky = () => {
  //   const currentScroll = window.pageYOffset
  //   if (currentScroll <= 0 && deskHeader.current) {
  //     deskHeader.current.classList.remove('hide-scroll-header')
  //     return
  //   }
  //   if (currentScroll > lastScroll && deskHeader.current) {
  //     deskHeader.current.classList.add('hide-scroll-header')
  //   } else if (currentScroll < lastScroll && deskHeader.current) {
  //     deskHeader.current.classList.remove('hide-scroll-header')
  //   }
  //   lastScroll = currentScroll
  // }
  // useEffect(() => {
  //   window.addEventListener('scroll', headerSticky)
  // })

  return (
    <header ref={deskHeader} className="web-header">
      <div className="header-container">
        <div className="logo-part">
          <NavLink to="/"><img className='logo' src={mainLogo} alt="G-Fox" /></NavLink>
          {/* <a href="/" className='logo'>Logo</a> */}
        </div>
        <nav className={menuOpen ? 'opened-navs nav-sec' : 'nav-sec'}>
          {/* <a href="/" className="mob-logo"><img src={mainLogo} alt="G-Fox" /></a> */}
          <ul>

            <li>
              <NavLink
                
                onClick={() => {
                  sectActiveNav(0)
                  setMenuOpen(false)
                }}
                to="/marketplace"
                activeClassName='active-nav'
              >
                Marketplace
              </NavLink>
            </li>
            <li>
              <NavLink
                className={activeNav === 1 ? 'active-nav' : ''}
                onClick={() => {
                  sectActiveNav(1)
                  setMenuOpen(false)
                }}
                activeClassName='active-nav'
                to="/mynft"
              >
                My NFTs
              </NavLink>
            </li>
            <li>
              <NavLink
                className={activeNav === 2 ? 'active-nav' : ''}
                onClick={() => {
                  sectActiveNav(2)
                  setMenuOpen(false)
                }}
                activeClassName='active-nav'
                to="/roadmap"
              >
                Road Map
              </NavLink>
            </li>
            <li>
              <button className="walletBtn">
                <AccountBalanceWalletIcon color='primary' className='wIcon' />
              </button>
            </li>
          </ul>

          <div className="nav-bottom">
            <p>
              Design & Developed by{' '}
              <a className="primary-anchor" href="https://smashcode.dev/">
                Smash Code
              </a>
            </p>
          </div>
        </nav>
        <div className="menu-btn">
          <div
            className={menuOpen ? 'ham-burg-opened' : ''}
            id="nav-icon2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div
        className={`nav-shadow  ${menuOpen ? 'show-shadow' : ''}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </header>
  )
}

export default Header
