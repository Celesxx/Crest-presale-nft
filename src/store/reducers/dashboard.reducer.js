import { createSlice } from '@reduxjs/toolkit'

const initialState = 
{
  startLoading: false,
  endLoading: false,
  loading: 0,
  loadingMax: 13,
  isWhitelist: false,
  ruby: 
  {
    priceWhitelist: null,
    pricePublic: null,
    maxUser: null,
    purchased: null,
    rewardAmount: null,
    priceStandard: null,
    max: null,
    totalSupply: null,
    balanceUser: null
  },
  amethyst: 
  {
    priceWhitelist: null,
    pricePublic: null,
    maxUser: null,
    purchased: null,
    rewardAmount: null,
    priceStandard: null,
    max: null,
    totalSupply: null,
    balanceUser: null
  },
  amber: 
  {
    priceWhitelist: null,
    pricePublic: null,
    maxUser: null,
    purchased: null,
    rewardAmount: null,
    priceStandard: null,
    max: null,
    totalSupply: null,
    balanceUser: null
  },
  balanceToken: null,
  balanceStable: null,
  allowanceToken: null,
  allowanceStable: null
}

export const dashboardSlice = createSlice(
{
  name: 'dashboard',
  initialState: 
  {
    startLoading: false,
    endLoading: false,
    loading: 0,
    loadingMax: 13,
    isWhitelist: false,
    ruby: 
    {
      priceWhitelist: null,
      pricePublic: null,
      maxUser: null,
      purchased: null,
      rewardAmount: null,
      priceStandard: null,
      max: null,
      totalSupply: null,
      balanceUser: null
    },
    amethyst: 
    {
      priceWhitelist: null,
      pricePublic: null,
      maxUser: null,
      purchased: null,
      rewardAmount: null,
      priceStandard: null,
      max: null,
      totalSupply: null,
      balanceUser: null
    },
    amber: 
    {
      priceWhitelist: null,
      pricePublic: null,
      maxUser: null,
      purchased: null,
      rewardAmount: null,
      priceStandard: null,
      max: null,
      totalSupply: null,
      balanceUser: null
    },
    balanceToken: null,
    balanceStable: null,
    allowanceToken: null,
    allowanceStable: null
  },

  
  reducers: 
  {
    dashboard: (state, action) => 
    {
      switch(action.payload.action)
      {
        case 'save-data': 
        for(const [key, value] of Object.entries(action.payload.data))
        {
            if(state[key] !== undefined)
            { 
                if(typeof(value) === "object" && !Array.isArray(value))
                {
                    for(const [key1, value1] of Object.entries(value)) 
                    { 
                        if(state[key][key1] !== undefined)state[key][key1] = value1
                        else console.log(`value not exist for ${key1} in ${key}`)
                    }
                }else state[key] = value 
            }else console.log(`value not exist : ${key}`)
        }
        break;

        case 'loading':
            state.loading += 1
            if(state.loading == state.loadingMax) { state.loadingOver = true }
            break

        case 'start-loading': 
          state.startLoading = true
          state.loading = 0
          break

        case 'end-loading': 
          state.startLoading = false
          state.endLoading = false
          break

        case 'reset': 
          for(const [key, value] of Object.entries(initialState)) state[key] = value
          break

        default:
          console.log(`wrong action !`)
          break;           
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions

export default dashboardSlice.reducer