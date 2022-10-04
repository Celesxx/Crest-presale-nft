import 'assets/animation/keyframes.assets.css'
import 'assets/css/global.assets.css';
import 'assets/css/blocks/mobile/navbarMobile.assets.css';
import React from "react";
import walletImg from "assets/img/wallet-mobile.png"
import Web3 from 'web3'
import Notiflix from 'notiflix'
import Web3Modal from 'web3modal'
import WalletConnectProvider from "@walletconnect/web3-provider"
import network from 'contracts/network.contracts.js'
import { ethers } from 'ethers'
import ContractHelper from "helpers/contract.helper"
import LoadingHelper from 'helpers/loadingData.helpers.js'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    language: state.login.language,
  }; 
};

const mapDispatchToProps = (dispatch) => {
  return {
      loginAction: (data) => { dispatch(LoginActions(data)); },
      dashboardAction: (data) => { dispatch(DashboardActions(data)); },
  };
};

class Navbar extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = 
      {
        menuToggle: false,
        isMetamaskSupported: false,
        isLoggedIn: false,
        language: this.props.language,
        address: this.props.address,
        interval: null,
      };

  }

  async UNSAFE_componentWillMount() 
  {
    if (window.ethereum) 
    {
      this.state.isMetamaskSupported = true
      if(this.props.address != "") 
      { 
        this.state.isLoggedIn = true 
        const contractHelper = new ContractHelper()
        let provider = await contractHelper.getProvider()

        if(this.state.interval == null) this.state.interval = setInterval(async () => 
        {
          let data =
          {
            amber: { totalSupply: await contractHelper.getTotalSupply(provider, 0) },
            amethyst: { totalSupply: await contractHelper.getTotalSupply(provider, 1) },
            ruby: { totalSupply: await contractHelper.getTotalSupply(provider, 2) }
          }
          this.props.dashboardAction({data: data, action: "save-data"})
        }, 5000)

      }
    }
  }

  componentWillUnmount()
  {
      clearInterval(this.state.interval)
      this.state.interval = null
  }

  componentDidUpdate(prevProps, prevState, snapshot) 
  {
      for(const [key, value] of Object.entries(this.state))
      {
          if (prevProps[key] !== this.props[key])
          {  
            this.state[key] = this.props[key]
            this.forceUpdate()
          }
      }
  }

  connectWallet = async () => 
  {
      if (this.state.isMetamaskSupported) 
      {
        const providerOptions = { walletconnect: { package: WalletConnectProvider, options: { rpc: { [network.chainId]: network.rpcUrls[0] } } } }
        let web3Modal = new Web3Modal( { cacheProvider: true, providerOptions, disableInjectedProvider: false, theme: "dark" })

        const instance = await web3Modal.connect()
        const newProvider = new ethers.providers.Web3Provider(instance)
        const chainId = (await newProvider.getNetwork()).chainId

        if (chainId == network.chainId) 
        {
          this.state.isLoggedIn = true
          this.props.loginAction({address: await newProvider.getSigner().getAddress(), action: 'address'})
          this.props.dashboardAction({loading : {}, action: "start-loading"})
          const contractHelper = new ContractHelper()
          const loadingHelper = new LoadingHelper()
          await loadingHelper.loadAllContractFunction(await newProvider.getSigner().getAddress(), newProvider, this.props)

          if(this.state.interval == null) this.state.interval = setInterval(async () => 
          {
            let data =
            {
              amber: { totalSupply: await contractHelper.getTotalSupply(newProvider, 0) },
              amethyst: { totalSupply: await contractHelper.getTotalSupply(newProvider, 1) },
              ruby: { totalSupply: await contractHelper.getTotalSupply(newProvider, 2) }
            }
            this.props.dashboardAction({data: data, action: "save-data"})
          }, 5000)

        }else 
        {
          Notiflix.Notify.warning(
          "Required Network - " + network.chainName, { timeout: 1500, width: '500px', position: 'center-top', fontSize: '22px' })
        }

      }else if (window.web3) window.web3 = new Web3(window.web3.currentProvider)
      else window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }

  toggleMenu()
  {
    this.state.menuToggle = !this.state.menuToggle
    if(this.state.menuToggle) document.querySelectorAll('.home').forEach((element) => { element.classList.add("menu-toggle") })
    else if(!this.state.menuToggle) document.querySelectorAll('.home').forEach((element) => { element.classList.remove("menu-toggle") })
  }

  render()
    {
      return(
        <div className="navbar-mobile-core flex row">

          <input id="navbar-toggle" type="checkbox" onClick={() => this.toggleMenu()} />
          <label className="navbar-mobile-label" htmlFor="navbar-toggle">
            <span className="navbar-mobile-span"></span>
          </label>

          <ul className="navbar-mobile">
              <li><a className="navbar-mobile-item" href="https://playcrest.xyz">Crest</a></li>
              <li><a className="navbar-mobile-item" href="https://discord.com/invite/mUHGNqN8Vj">Community</a></li>
              <li><a className="navbar-mobile-item" href="https://medium.com/@playCrest">Doc</a></li>
              <li><a className="navbar-mobile-item" href="https://twitter.com/playCrest">Twitter</a></li>
          </ul>

          <div className='navbar-mobile-wallet-core flex center'>
           
            {
              this.state.address !== "" 
              ?<div className="navbar-mobile-wallet-address flex row center"><p className='navbar-address'>{ this.state.address.substr(0, 6) + '...' +  this.state.address.substr( this.state.address.length - 6,  this.state.address.length)  }</p></div>
              :(
                <button className='navbar-mobile-wallet-button button flex center' onClick={() => this.connectWallet()}>
                  <img className='navbar-mobile-wallet-img' src={walletImg} alt={walletImg}></img>
                </button>
              )
            }
          </div>

            
        </div>

      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Navbar);
