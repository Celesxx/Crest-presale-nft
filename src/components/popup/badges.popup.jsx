import React from "react";
import Popup from 'reactjs-popup';
import 'assets/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/blocks/home.assets.css'
import 'assets/css/popup/badges.assets.css'
import 'assets/css/popup/mobile/badgesMobile.assets.css'
import { connect } from 'react-redux'
import { LoginActions } from 'store/actions/login.actions.js'
import { DashboardActions } from 'store/actions/dashboard.actions.js'
import Language from 'assets/data/language.json'
import Ruby from 'assets/img/ruby.mp4'
import Amber from 'assets/img/amber.mp4'
import Amethyst from 'assets/img/amethyst.mp4'
import ContractHelper from "helpers/contract.helper.js";
import Address from 'contracts/address.contracts.json'

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
    }
}
class BadgesPopup extends React.Component 
{  


    constructor(props) 
    {
        super(props);
        this.state = 
        {
            address: this.props.address,
            language: this.props.language,
            videoSrc: [Amber, Amethyst, Ruby],
            title: ["Amber", "Amethyst", "Ruby"],
            badges: [this.props.amber, this.props.amethyst, this.props.ruby],
            badgesIndex : parseInt(props.badgesIndex),
            buyNbr : 1,
            isWhitelist: this.props.isWhitelist,
            balanceToken: this.props.balanceToken,
            balanceStable: this.props.balanceStable,
            allowanceToken: this.props.allowanceToken,
            allowanceStable: this.props.allowanceStable,
            erc20Selected: "token",
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                this.state[key] = this.props[key] 
                this.forceUpdate();
            }else if(key === "badges")
            {
                if(this.state.badges[this.state.badgesIndex] !== this.props[this.state.title[this.state.badgesIndex].toLowerCase()])
                {
                    this.state.badges[this.state.badgesIndex] = this.props[this.state.title[this.state.badgesIndex].toLowerCase()]
                    this.forceUpdate();
                }
            }
        }
    }


    handleChange(event)
    {
        let target = event.target
        this.state.erc20Selected = target.id
        this.forceUpdate()
    }

    async setAllowance()
    {
        let contractHelper = new ContractHelper()
        let provider = await contractHelper.getProvider()
        await contractHelper.setApprove(provider, this.state.erc20Selected === "token" ? Address.token : Address.stable)
        if(this.state.erc20Selected === "token") this.props.dashboardAction({data: {allowanceToken: true }, action: "save-data"})
        else this.props.dashboardAction({data: {allowanceStable: true }, action: "save-data"})
        
    }

    addBadges()
    {
        this.state.buyNbr += 1
        this.forceUpdate()
    }

    removeBadges()
    {
        if(this.state.buyNbr > 1) this.state.buyNbr -= 1
        this.forceUpdate()
    }


    async buyBadges()
    {
        let contractHelper = new ContractHelper()
        const provider = await contractHelper.getProvider()
        if(this.state.erc20Selected === "token") await contractHelper.setPurchase(provider, Address.token, this.state.badgesIndex, this.state.buyNbr)
        else if(this.state.erc20Selected === "stable") await contractHelper.setPurchase(provider, Address.stable, this.state.badgesIndex, this.state.buyNbr)
        else console.log("An error append to the buyBadges function")
        let data = {}
        switch(this.state.badgesIndex)
        {
            case 0:
                let amber = 
                {
                    "purchased": (await contractHelper.getPurchased(provider, this.state.address))[0],
                    "totalSupply": await contractHelper.getTotalSupply(provider, 0),
                    "balanceUser": await contractHelper.getBalanceUser(provider, 0, this.state.address)
                }
                data["amber"] = amber
                break;

            case 1:
                let amethyst = 
                {
                    "purchased": (await contractHelper.getPurchased(provider, this.state.address))[1],
                    "totalSupply": await contractHelper.getTotalSupply(provider, 1),
                    "balanceUser": await contractHelper.getBalanceUser(provider, 1, this.state.address)
                }
                data["amethyst"] = amethyst
                break;

            case 2:
                let ruby = 
                {
                    "purchased": (await contractHelper.getPurchased(provider, this.state.address))[2],
                    "totalSupply": await contractHelper.getTotalSupply(provider, 2),
                    "balanceUser": await contractHelper.getBalanceUser(provider, 2, this.state.address)
                }
                data["ruby"] = ruby
                break;
        }
        this.props.dashboardAction({data : data, action: 'save-data'})
    }
    
    render()
    {
        let contractHelper = new ContractHelper()
        return(
            <Popup trigger=
            {
                <button className="button home-personnal-button">
                    Buy {'\u00A0'}
                    {
                        this.state.isWhitelist 
                        ? contractHelper.getNb(this.state.badges[this.state.badgesIndex].priceWhitelist, 2)
                        : contractHelper.getNb(this.state.badges[this.state.badgesIndex].pricePublic, 2)
                    }{'\u00A0'} $CREST
                </button>
            } modal nested>
            {
                
                close => 
                (
                    <div className="shop-popup-base flex row">
                        
                        <button className="shop-popup-close button" onClick={close}> &times; </button>
                        <div className="shop-popup-items flex center">  
                            <video className="shop-video-popup" autoPlay muted loop>
                                <source src={this.state.videoSrc[this.state.badgesIndex]} type="video/mp4" />
                            </video>
                        </div>

                        <div className="shop-popup-cards flex column">

                            <h1 className="shop-popup-title no-margin no-padding">{this.state.title[this.state.badgesIndex]}</h1>

                            <div className="shop-popup-count-core flex row center">
                                <button className="button shop-popup-min" onClick={() => this.removeBadges()}>-</button>
                                <h1 className="shop-popup-count-text">{this.state.buyNbr}</h1>
                                <button className="button shop-popup-max" onClick={() => this.addBadges()}>+</button>
                            </div>

                            <div className="shop-popup-info-core flex row">

                                <div className="shop-popup-info-title flex column">
                                    <p className="shop-popup-text-title">{Language[this.state.language].buyPopup.cost}</p>
                                    <p className="shop-popup-text-title">Lifetime</p>
                                    <p className="shop-popup-text-title">Daily Rewards</p>
                                    <p className="shop-popup-text-title">Daily ROI</p>
                                    <p className="shop-popup-text-title">{Language[this.state.language].buyPopup.remaining}</p>
                                </div>

                                <div className="shop-popup-info-desc flex column">
                                    <p className="shop-popup-text-desc">
                                        {
                                            this.state.isWhitelist 
                                            ? contractHelper.getNb(this.state.badges[this.state.badgesIndex].priceWhitelist, 2)
                                            : contractHelper.getNb(this.state.badges[this.state.badgesIndex].pricePublic, 2)
                                        }{'\u00A0'}$CREST{'\u00A0'}/{'\u00A0'}
                                        {
                                            this.state.isWhitelist 
                                            ? contractHelper.getNb(parseFloat(this.state.badges[this.state.badgesIndex].priceWhitelist) * 10, 2)
                                            : contractHelper.getNb(parseFloat(this.state.badges[this.state.badgesIndex].pricePublic) * 10, 2)
                                        }{'\u00A0'}$USDC
                                    </p>
                                    <p className="shop-popup-text-desc">365 {Language[this.state.language].buyPopup.lifetimeValue}</p>
                                    <p className="shop-popup-text-desc">{contractHelper.getNb(this.state.badges[this.state.badgesIndex].rewardAmount, 2)} $CREST</p>
                                    <p className="shop-popup-text-desc"> {contractHelper.getNb(parseFloat(this.state.badges[this.state.badgesIndex].rewardAmount) / parseFloat(this.state.badges[this.state.badgesIndex].priceStandard) * 100, 2)}% </p>
                                    <p className="shop-popup-text-desc"> {contractHelper.getNb(parseFloat(this.state.badges[this.state.badgesIndex].max) - parseFloat(this.state.badges[this.state.badgesIndex].totalSupply), 0)} </p>
                                </div>

                            </div>

                            <div className="shop-popup-button-core flex row">
                                <form className="shop-popup-select flex center" tabIndex="1" onChange={this.handleChange}>
                                    <input name="popup-shop" className="shop-popup-select-input" type="radio" id="token" defaultChecked/>
                                    <label htmlFor="token" className="shop-popup-select-option">CREST</label>
                                    <input name="popup-shop" className="shop-popup-select-input" type="radio" id="stable"/>
                                    <label htmlFor="stable" className="shop-popup-select-option">USDC</label>
                                </form>

                                {
                                    this.state.erc20Selected === "stable"
                                    ? (
                                        !this.state.allowanceStable 
                                        ? <button className="button shop-popup-button" onClick={() => this.setAllowance()}>{Language[this.state.language].buyPopup.approve}</button>
                                        : <button className="button shop-popup-button" onClick={() => this.buyBadges()}>{Language[this.state.language].buyPopup.buy}</button>
                                    ): (
                                        !this.state.allowanceToken 
                                        ? <button className="button shop-popup-button" onClick={() => this.setAllowance()}>{Language[this.state.language].buyPopup.approve}</button>
                                        : <button className="button shop-popup-button" onClick={() => this.buyBadges()}>{Language[this.state.language].buyPopup.buy}</button>
                                    )
                                }
                                
                            </div>         
                           
                            
                            
                        </div>
                        
                    </div>
                )
            }
            </Popup>
        )
    }
}


export default connect(MapStateToProps, mapDispatchToProps)(BadgesPopup)
    