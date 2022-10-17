import Address from 'contracts/address.contracts.json'
import AbiToken from 'contracts/abis/Token.sol/Token.json'
import abiBadges from 'contracts/abis/Badge.sol/Badge.json'
import abiPresaleToken from 'contracts/abis/PresaleToken.sol/PresaleToken.json'
import abiPresaleNFT from 'contracts/abis/PresaleNFT.sol/PresaleNFT.json'
import abiPresaleWhitelist from 'contracts/abis/PresaleWhitelist.sol/PresaleWhitelist.json'
import  {ethers, BigNumber, utils, constants } from "ethers"
import Web3Modal from 'web3modal'
import Notiflix from 'notiflix'

const { formatUnits, parseUnits } = utils

function displayError(str) {
	Notiflix.Notify.warning(
		str,
		{
			timeout: 1500,
			width: '500px',
			position: 'center-top',
			fontSize: '22px'
		}
	)
}

class ContractHelper
{
    async getProvider()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true, theme: "dark" });
        const instance = await web3Modal.connect(); 
        const provider = await new ethers.providers.Web3Provider(instance);

        return provider
    }


	async getInstance()
    {
        const web3Modal = new Web3Modal({ cacheProvider: true });
        let provider, instance
        if (web3Modal.cachedProvider) 
        {
            instance = await web3Modal.connect()
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        else 
        {
            web3Modal = await new Web3Modal({ cacheProvider: true });
            instance = await web3Modal.connect();
            provider = await new ethers.providers.Web3Provider(instance); 
        }
        return {instance, provider}
    }
	
	
	getNb(number, decimal) 
    {
        let fractionDigits = 0;
        if (decimal) fractionDigits = decimal;
        if (isNaN(number)) return null
        return parseFloat(number).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: fractionDigits })
    }

	async getIsWhitelist(provider)
	{
		const presale = new ethers.Contract(Address.presaleNft, abiPresaleNFT, provider)
		return await presale.openWhitelist()
	}

	async getBalanceOf(provider, erc20Addr, userAddr, decimals)
	{
		const erc20 = new ethers.Contract(erc20Addr, AbiToken, provider)
		return formatUnits(await erc20.balanceOf(userAddr), decimals)
	}
	
	async getAllowance(provider, erc20Addr, userAddr)
	{
		const erc20 = new ethers.Contract(erc20Addr, AbiToken, provider)
		return (await erc20.allowance(userAddr, Address.presaleNft)).gt(0)
	}

	async getDatas(provider, decimals)
	{
		const presale = new ethers.Contract(Address.presaleNft, abiPresaleNFT, provider)
		const datas = await presale.viewDatas()
		return {
			pricesWhitelist: datas[0].map(x => formatUnits(x, decimals)),
			pricesPublic: datas[1].map(x => formatUnits(x, decimals)),
			maxUser: datas[2].map(x => x.toString()),
		}
	}

	async getPurchased(provider, userAddr)
	{
		const presale = new ethers.Contract(Address.presaleNft, abiPresaleNFT, provider)
		const datas = await presale.viewUser(userAddr)
		return datas.map(x => x.toString())
	}

	async getRewardAmount(provider, i, decimals)
	{
		const nft = new ethers.Contract(Address.badges[i], abiBadges, provider)
		return formatUnits(await nft.rewardAmount(), decimals)
	}
	
	async getPriceStandard(provider, i, decimals)
	{
		const nft = new ethers.Contract(Address.badges[i], abiBadges, provider)
		return formatUnits(await nft.price(), decimals)
	}
	
	async getMax(provider, i)
	{
		const nft = new ethers.Contract(Address.badges[i], abiBadges, provider)
		return (await nft.max()).toString()
	}
	
	async getTotalSupply(provider, i)
	{
		const nft = new ethers.Contract(Address.badges[i], abiBadges, provider)
		return (await nft.totalSupply()).toString()
	}
	
	async getBalanceUser(provider, i, userAddr)
	{
		const nft = new ethers.Contract(Address.badges[i], abiBadges, provider)
		return (await nft.balanceOf(userAddr)).toNumber()
	}
	
	async setApprove(provider, erc20Addr) 
    {
		try {
			const erc20 = new ethers.Contract(erc20Addr, AbiToken, provider)
			await(await erc20.connect(provider.getSigner())
				.approve(Address.presaleNft, constants.MaxUint256)
			).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
	}
	
    async setPurchase(provider, erc20Addr, i, amount) 
    {
		try {
			const presale = new ethers.Contract(Address.presaleNft, abiPresaleNFT, provider)
			await(await presale.connect(provider.getSigner())
				.purchase(erc20Addr, i, amount)
			).wait()
		} catch(e) {
			if (e.reason != undefined)
				displayError(e.reason)
			throw "Error"
		}
    }

}


export default ContractHelper