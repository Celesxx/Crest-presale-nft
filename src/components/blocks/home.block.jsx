import 'assets/animation/keyframes.assets.css';
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/blocks/home.assets.css'
import 'assets/css/blocks/mobile/homeMobile.assets.css'
import React from "react";
import Amethyst from 'assets/img/amethyst.mp4'
import Amber from 'assets/img/amber.mp4'
import Ruby from 'assets/img/ruby.mp4'
import Language from 'assets/data/language.json'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import BadgesPopup from 'components/popup/badges.popup.jsx'
import ContractHelper from 'helpers/contract.helper';

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    language: state.login.language,
    isWhitelist: state.dashboard.isWhitelist,
    ruby: state.dashboard.ruby,
    amethyst: state.dashboard.amethyst,
    amber: state.dashboard.amber,
    balanceToken: state.dashboard.balanceToken,
    balanceStable: state.dashboard.balanceStable,
    allowanceToken: state.dashboard.allowanceToken,
    allowanceStable: state.dashboard.allowanceStable
  }; 
};

const mapDispatchToProps = (dispatch) => {
  return {
      loginAction: (data) => { dispatch(LoginActions(data)); },
      dashboardAction: (data) => { dispatch(DashboardActions(data)); },
  };
};

class Shop extends React.Component 
{

  constructor(props) 
  {
    super(props);

    this.state = 
    {
      address: this.props.address,
      language: this.props.language,
      isWhitelist: this.props.isWhitelist,
      ruby: this.props.ruby,
      amethyst: this.props.amethyst,
      amber: this.props.amber,
      balanceToken: this.props.balanceToken,
      balanceStable: this.props.balanceStable,
      allowanceToken: this.props.allowanceToken,
      allowanceStable: this.props.allowanceStable,
      width: window.innerWidth,
      isMobile: false,
    };
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
  }

  UNSAFE_componentWillMount() 
  { 
    window.addEventListener('resize', this.handleWindowSizeChange); 
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
    this.forceUpdate()
  }
  componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
  handleWindowSizeChange(event) 
  { 
    this.state.width = document.documentElement.clientWidth
    if(this.state.width <= 1500) this.state.isMobile = true
    else this.state.isMobile = false
    this.forceUpdate()
  }

  componentDidMount()
  {
    document.getElementById('amber-global-bar').style.setProperty('--widthMin',`0`)
    document.getElementById('amber-global-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.amber.totalSupply) / parseFloat(this.state.amber.max) * 100)}%`)
    document.getElementById('amber-personnal-bar').style.setProperty('--widthMin',`0`)
    document.getElementById('amber-personnal-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.amber.purchased) / parseFloat(this.state.amber.maxUser) * 100)}%`)
    document.getElementById('amethyst-global-bar').style.setProperty('--widthMin',`0`);
    document.getElementById('amethyst-global-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.amethyst.totalSupply) / parseFloat(this.state.amethyst.max) * 100)}%`);
    document.getElementById('amethyst-personnal-bar').style.setProperty('--widthMin',`0`);
    document.getElementById('amethyst-personnal-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.amethyst.purchased) / parseFloat(this.state.amethyst.maxUser) * 100)}%`);
    document.getElementById('ruby-global-bar').style.setProperty('--widthMin',`0`);
    document.getElementById('ruby-global-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.ruby.totalSupply) / parseFloat(this.state.ruby.max) * 100)}%`);
    document.getElementById('ruby-personnal-bar').style.setProperty('--widthMin',`0`);
    document.getElementById('ruby-personnal-bar').style.setProperty('--widthMax',`${(parseFloat(this.state.ruby.purchased) / parseFloat(this.state.ruby.maxUser) * 100)}%`);
  }

  

  async componentDidUpdate(prevProps, prevState, snapshot) 
  {
    for(const [key, value] of Object.entries(this.state))
    {
      if(prevProps[key] !== this.props[key])
      {   
        this.state[key] = this.props[key]
        this.forceUpdate();
        
        if(key === "amber")
        {
          let amberGlobal = document.getElementById('amber-global-bar')
          let amberPersonnal = document.getElementById('amber-personnal-bar')

          amberGlobal.classList.value = "home-personnal-bar-inner inner-bar-amber"
          amberGlobal.style.setProperty('--widthMin',`${(parseFloat(this.state.amber.totalSupply - 1) / parseFloat(this.state.amber.max) * 100)}%`);
          amberGlobal.style.setProperty('--widthMax',`${(parseFloat(this.state.amber.totalSupply) / parseFloat(this.state.amber.max) * 100)}%`);
          amberGlobal.classList.add("amber-global-bar")

          amberPersonnal.classList.value = "home-personnal-bar-inner inner-bar-amber"
          amberPersonnal.style.setProperty('--widthMin',`${(parseFloat(this.state.amber.purchased - 1) / parseFloat(this.state.amber.maxUser) * 100)}%`);
          amberPersonnal.style.setProperty('--widthMax',`${(parseFloat(this.state.amber.purchased) / parseFloat(this.state.amber.maxUser) * 100)}%`);
          amberPersonnal.classList.add("amber-personnal-bar")
        }else if(key === "amethyst")
        {
          let amethystGlobal = document.getElementById('amethyst-global-bar')
          let amethystPersonnal = document.getElementById('amethyst-personnal-bar')
          
          amethystGlobal.classList.value = "home-personnal-bar-inner inner-bar-amethyst"
          amethystGlobal.style.setProperty('--widthMin',`${(parseFloat(this.state.amethyst.totalSupply - 1) / parseFloat(this.state.amethyst.max) * 100)}%`);
          amethystGlobal.style.setProperty('--widthMax',`${(parseFloat(this.state.amethyst.totalSupply) / parseFloat(this.state.amethyst.max) * 100)}%`);
          amethystGlobal.classList.add("amethyst-personnal-bar")

          amethystPersonnal.classList.value = "home-personnal-bar-inner inner-bar-amethyst"
          amethystPersonnal.style.setProperty('--widthMin',`${(parseFloat(this.state.amethyst.purchased - 1) / parseFloat(this.state.amethyst.maxUser) * 100)}%`);
          amethystPersonnal.style.setProperty('--widthMax',`${(parseFloat(this.state.amethyst.purchased) / parseFloat(this.state.amethyst.maxUser) * 100)}%`);
          amethystPersonnal.classList.add("amethyst-personnal-bar")
          

        }else if(key === "ruby")
        {
          let rubyGlobal = document.getElementById('ruby-global-bar')
          let rubyPersonnal = document.getElementById('ruby-personnal-bar')

          rubyGlobal.classList.value = "home-personnal-bar-inner inner-bar-ruby"
          rubyGlobal.style.setProperty('--widthMin',`${(parseFloat(this.state.ruby.totalSupply - 1) / parseFloat(this.state.ruby.max) * 100)}%`);
          rubyGlobal.style.setProperty('--widthMax',`${(parseFloat(this.state.ruby.totalSupply) / parseFloat(this.state.ruby.max) * 100)}%`);
          rubyGlobal.classList.add("ruby-global-bar")

          rubyPersonnal.classList.value = "home-personnal-bar-inner inner-bar-ruby"
          rubyPersonnal.style.setProperty('--widthMin',`${(parseFloat(this.state.ruby.purchased - 1) / parseFloat(this.state.ruby.maxUser) * 100)}%`);
          rubyPersonnal.style.setProperty('--widthMax',`${(parseFloat(this.state.ruby.purchased) / parseFloat(this.state.ruby.maxUser) * 100)}%`);
          rubyPersonnal.classList.add("ruby-personnal-bar")
        }
        
      }

    }
  }


    render()
    {
      const contractHelper = new ContractHelper()
      return (
        
        <div className='home-base flex column'>
          

          <div className='home-head-core flex row'>

            <div className='home-head-title-core flex column center'>
                <h1 className='home-head-title no-margin no-padding'>{Language[this.state.language].home.headTitleP1} <span className='gradient-pink-reverse'>{Language[this.state.language].home.headTitleP2}</span></h1>
                <h1 className='home-head-discount no-margin no-padding'>
                  {
                    this.state.isWhitelist
                    ? ( contractHelper.getNb(100 - parseFloat(this.state.amber.priceWhitelist) / parseFloat(this.state.amber.priceStandard) * 100, 1) )
                    :( contractHelper.getNb(100 - parseFloat(this.state.amber.pricePublic) / parseFloat(this.state.amber.priceStandard) * 100, 1) )
                  }% {Language[this.state.language].home.headDiscount}
                </h1>
                <p className='home-head-start no-margin no-padding'>{`Start -> 10/10 00:00`}</p>
                <p className='home-head-end no-margin no-padding'>{`Start -> 17/10 00:00`}</p>
            </div>

            <div className='home-head-separator'></div>
            
            <div className='home-head-time-core home-head-timer flex column center'>
              { this.state.isMobile != true && <h1 className='home-head-time-title no-margin no-padding'>{Language[this.state.language].home.headTimeTitle}</h1> }
              { this.state.isMobile != true && <h2 className='home-head-time-desc no-margin no-padding'>{Language[this.state.language].home.headTimeDesc}</h2> }
              <h1 className='home-head-time-nbr home-head-title-timer no-margin no-padding'>3:13:40</h1>
            </div>


            { this.state.isMobile != true && <div className='home-head-separator'></div> }

            <div className='home-head-wallet-core flex column center'>
                <h1 className='home-head-wallet-title no-margin no-padding'>{Language[this.state.language].home.headWalletTitle}</h1>
                <h2 className='home-head-wallet-desc no-margin no-padding'>{Language[this.state.language].home.headWalletDesc}</h2>
                <h1 className='home-head-wallet-nbr no-margin no-padding'>{this.state.amber.balanceUser + this.state.amethyst.balanceUser + this.state.ruby.balanceUser}</h1>
            </div>

          </div>



          <div className='home-content-core flex row'>
            
            <div className='home-personnal-card-core flex column center'>

              <div className='home-personnal-title-core flex center'>
                <h1 className='home-personnal-title'>Ruby</h1>
              </div>

              <video playsInline className="home-badges-video" autoPlay muted loop>
                <source src={Ruby} type="video/mp4" />
              </video>

              <div className='home-personnal-bar-core flex column center'>
                <div className='personnal-bar-global-head flex row'>
                  <p className='bar-global-title no-margin no-padding'>{Language[this.state.language].home.barGlobalTitle}</p>
                  <p className='bar-global-desc no-margin no-padding'>{this.state.ruby.totalSupply} / { this.state.ruby.max}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-ruby ruby-global-bar' id='ruby-global-bar'></div>
                </div>
              </div>

              <div className='home-personnal-bar-core flex column center'>
              <div className='personnal-bar-user-head flex row'>
                  <p className='bar-user-title no-margin no-padding'>{Language[this.state.language].home.barPersonnalTitle}</p>
                  <p className='bar-user-desc no-margin no-padding'>{this.state.ruby.purchased} / { this.state.ruby.maxUser}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-ruby ruby-personnal-bar' id='ruby-personnal-bar'></div>
                </div>
              </div>

              <div className='home-personnal-button-core flex row center'>
                <BadgesPopup badgesIndex="2" />
              </div>
            </div>

            

            <div className='home-personnal-card-core flex column center'>

              <div className='home-personnal-title-core flex center'>
                <h1 className='home-personnal-title'>Amethyst</h1>
              </div>

              <video playsInline className="home-badges-video" autoPlay muted loop>
                <source src={Amethyst} type="video/mp4" />
              </video>

              <div className='home-personnal-bar-core flex column center'>
                <div className='personnal-bar-global-head flex row'>
                  <p className='bar-global-title no-margin no-padding'>{Language[this.state.language].home.barGlobalTitle}</p>
                  <p className='bar-global-desc no-margin no-padding'>{this.state.amethyst.totalSupply} / { this.state.amethyst.max}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-amethyst amethyst-global-bar' id='amethyst-global-bar' ></div>
                </div>
              </div>

              <div className='home-personnal-bar-core flex column center'>
              <div className='personnal-bar-user-head flex row'>
                  <p className='bar-user-title no-margin no-padding'>{Language[this.state.language].home.barPersonnalTitle}</p>
                  <p className='bar-user-desc no-margin no-padding'>{this.state.amethyst.purchased} / { this.state.amethyst.maxUser}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-amethyst amethyst-personnal-bar' id='amethyst-personnal-bar'></div>
                </div>
              </div>

              <div className='home-personnal-button-core flex row center'>
                <BadgesPopup badgesIndex="1" />
              </div>

            </div>



            <div className='home-personnal-card-core flex column center'>

              <div className='home-personnal-title-core flex center'>
                <h1 className='home-personnal-title'>Amber</h1>
              </div>

              <video playsInline className="home-badges-video" autoPlay muted loop>
                <source src={Amber} type="video/mp4" />
              </video>

              <div className='home-personnal-bar-core flex column center'>
                <div className='personnal-bar-global-head flex row'>
                  <p className='bar-global-title no-margin no-padding'>{Language[this.state.language].home.barGlobalTitle}</p>
                  <p className='bar-global-desc no-margin no-padding'>{this.state.amber.totalSupply} / { this.state.amber.max}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-amber amber-global-bar' id='amber-global-bar'></div>
                </div>
              </div>

              <div className='home-personnal-bar-core flex column center'>
              <div className='personnal-bar-user-head flex row'>
                  <p className='bar-user-title no-margin no-padding'>{Language[this.state.language].home.barPersonnalTitle}</p>
                  <p className='bar-user-desc no-margin no-padding'>{this.state.amber.purchased} / { this.state.amber.maxUser}</p>
                </div>
                <div className='home-personnal-bar-outer'>
                  <div className='home-personnal-bar-inner inner-bar-amber amber-personnal-bar' id='amber-personnal-bar'></div>
                </div>
              </div>

              <div className='home-personnal-button-core flex row center'>
                <BadgesPopup badgesIndex="0" />
              </div>

            </div>
          </div>

        </div>
      );
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Shop);
