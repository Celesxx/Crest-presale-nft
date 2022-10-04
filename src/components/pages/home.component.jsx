import 'assets/animation/keyframes.assets.css'
import 'assets/css/index.assets.css'
import 'assets/css/global.assets.css'
import React from "react";
import NavbarPresale from "components/blocks/navbar.block.jsx"
import NavbarPresaleMobile from "components/blocks/mobile/navbarMobile.block.jsx"
import LeftbarPresale from "components/blocks/leftbar.block.jsx"
import HomeBlock from "components/blocks/home.block.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
import Restricted from "components/blocks/restricted.block.jsx"
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    startLoading: state.dashboard.startLoading,
    endLoading: state.dashboard.endLoading,
  }; 
};

class Home extends React.Component 
{

  constructor(props) 
  {
      super(props);
      this.state = 
      {
        address: this.props.address,
        startLoading: this.props.startLoading,
        endLoading: this.props.endLoading,
        width: window.innerWidth,
      };

  }


  UNSAFE_componentWillMount() { window.addEventListener('resize', this.handleWindowSizeChange); }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  handleWindowSizeChange = () => { this.state.width = window.innerWidth };

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
    for(const [key, value] of Object.entries(this.state))
    {
      if (prevProps[key] !== this.props[key])
      {   
        this.state[key] = this.props[key]
        this.forceUpdate();
      }
    }
  }

  render()
  {
    const isMobile = this.state.width <= 1500;
    return(
      <div className="home">

        { isMobile != true ? <NavbarPresale/> : <NavbarPresaleMobile/> }
        { isMobile != true && <LeftbarPresale /> }
        <HomeBlock />
        {
          this.state.address === "" &&
          ( <Restricted /> )
        }
        {
          this.state.startLoading === true && this.state.endLoading === false && this.state.address !== "" &&
          ( <LoadingData /> )
        }

      
      </div>

    );
  }
}

export default connect(MapStateToProps)(Home);
