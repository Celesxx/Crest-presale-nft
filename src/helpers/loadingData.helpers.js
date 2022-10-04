import Address from 'contracts/address.contracts.json'
import ContractHelper from './contract.helper'



class LoadingHelper
{


    /*------------------------------  ------------------------------*/
    /** 
    * @param {String} address
    * @param {Structure} provider
    * @param {Structure} props
    **/
    async loadAllContractFunction(address, provider, props)
    {

        let contractHelper = new ContractHelper()
        const presaleData = await contractHelper.getDatas(provider, 6)
        const purchaseData = await contractHelper.getPurchased(provider, address)

        let data = 
        {
          isWhitelist : null, 
          balanceToken: null, 
          balanceStable: null, 
          allowanceToken: null, 
          allowanceStable: null, 
          amber: { priceWhitelist: null, pricePublic: null, maxUser: null, purchased: null, rewardAmount: null, priceStandard: null, max: null, totalSupply: null, balanceUser: null, },
          ruby: { priceWhitelist: null, pricePublic: null, maxUser: null, purchased: null, rewardAmount: null, priceStandard: null, max: null, totalSupply: null, balanceUser: null, },
          amethyst: { priceWhitelist: null, pricePublic: null, maxUser: null, purchased: null, rewardAmount: null, priceStandard: null, max: null, totalSupply: null, balanceUser: null, },
        }


        data.isWhitelist = await contractHelper.getIsWhitelist(provider)
        data.balanceToken= await contractHelper.getBalanceOf(provider, Address.token, address, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        data.balanceStable= await contractHelper.getBalanceOf(provider, Address.stable, address, 6)
        props.dashboardAction({loading : {}, action: "loading"})
        data.allowanceToken= await contractHelper.getAllowance(provider, Address.token, address)
        props.dashboardAction({loading : {}, action: "loading"})
        data.allowanceStable= await contractHelper.getAllowance(provider, Address.stable, address)
        props.dashboardAction({loading : {}, action: "loading"})

        data.amber.priceWhitelist = presaleData.pricesWhitelist[0]
        data.amber.pricePublic = presaleData.pricesPublic[0]
        data.amber.maxUser = presaleData.maxUser[0]
        data.amber.purchased = purchaseData[0]
        props.dashboardAction({loading : {}, action: "loading"})
        data.amber.rewardAmount= await contractHelper.getRewardAmount(provider, 0, 6)
        data.amber.priceStandard= await contractHelper.getPriceStandard(provider, 0 , 6)
        data.amber.max= await contractHelper.getMax(provider, 0)
        props.dashboardAction({loading : {}, action: "loading"})
        data.amber.totalSupply= await contractHelper.getTotalSupply(provider, 0)
        data.amber.balanceUser= await contractHelper.getBalanceUser(provider, 0, address) 
        props.dashboardAction({loading : {}, action: "loading"})
        
        data.amethyst.priceWhitelist = presaleData.pricesWhitelist[1]
        data.amethyst.pricePublic= presaleData.pricesPublic[1]
        data.amethyst.maxUser= presaleData.maxUser[1]
        data.amethyst.purchased= purchaseData[1]
        props.dashboardAction({loading : {}, action: "loading"})
        data.amethyst.rewardAmount= await contractHelper.getRewardAmount(provider, 1, 6)
        data.amethyst.priceStandard= await contractHelper.getPriceStandard(provider, 1 , 6)
        data.amethyst.max= await contractHelper.getMax(provider, 1)
        props.dashboardAction({loading : {}, action: "loading"})
        data.amethyst.totalSupply= await contractHelper.getTotalSupply(provider, 1)
        data.amethyst.balanceUser= await contractHelper.getBalanceUser(provider, 1, address) 
        props.dashboardAction({loading : {}, action: "loading"})
        
        data.ruby.priceWhitelist= presaleData.pricesWhitelist[2]
        data.ruby.pricePublic= presaleData.pricesPublic[2]
        data.ruby.maxUser= presaleData.maxUser[2]
        data.ruby.purchased= purchaseData[2]
        props.dashboardAction({loading : {}, action: "loading"})
        data.ruby.rewardAmount= await contractHelper.getRewardAmount(provider, 2, 6)
        data.ruby.priceStandard= await contractHelper.getPriceStandard(provider, 2 , 6)
        data.ruby.max= await contractHelper.getMax(provider, 2)
        props.dashboardAction({loading : {}, action: "loading"})
        data.ruby.totalSupply= await contractHelper.getTotalSupply(provider, 2)
        data.ruby.balanceUser= await contractHelper.getBalanceUser(provider, 2, address) 
        props.dashboardAction({loading : {}, action: "loading"})
        
        await new Promise(r => setTimeout(r, 2000));
        props.dashboardAction({data: data, action: "save-data"})
        props.dashboardAction({loading : {}, action: "end-loading"})
        return
    }

}

export default LoadingHelper