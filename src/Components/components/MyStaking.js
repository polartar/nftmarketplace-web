import React, { memo, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStakeCount, setVIPCount } from '../../GlobalState/User';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createSuccessfulTransactionToastContent } from '../../utils';
import config from '../../Assets/networks/rpc_config.json';
import { Contract, utils } from 'ethers';
import RewardsPoolABI from "../../Contracts/RewardsPool.json";

const MyStaking = ({ walletAddress = null }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const stakeCount = user.stakeCount;
  const vipCount = user.vipCount;
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [amount, setAmount] = useState(1);
  const [harvestAmount, setHarvestAmount] = useState(0);

  const getStakeAmount = useCallback(async() => {
    if (!user.stakeContract) return;
    try {
      setIsHarvesting(true);
      const completedPool = await user.stakeContract.completedPool();
      if (completedPool !== '0x000000000000000000000000000000000000') {
        const rewardsContract = new Contract(completedPool, RewardsPoolABI.abi, user.provider.getSigner());
        const finalBalance = await rewardsContract.finalBalance();
        if (finalBalance <= 0) {
          toast.error("Not available balance");      
        } else {
          const share = await rewardsContract.shares(walletAddress);
          const totalShares = await rewardsContract.totalShares();
          const balance = finalBalance.mul(share).div(totalShares);
          setHarvestAmount(utils.formatEther(balance));
        }          
      }
    } catch(err) {
      toast.error(err.message);
    } finally {
      setIsHarvesting(false);
    }    
  }, [user.provider, user.stakeContract, walletAddress]);

  useEffect(() => {
    getStakeAmount();
    const harvetstInterval = setInterval(getStakeAmount, 1000 * 60 * 60);

    return () => {
      clearInterval(harvetstInterval);
    }
  }, [getStakeAmount])

 

  const stake = async () => {
    if (!user.stakeContract || amount <= 0) return;
    if (amount >= vipCount) {
      toast.error("Exceed amount");
      return;
    }
    try {
      setIsStaking(true);
      await user.membershipContract.setApprovalForAll(config.stake_contract, true, { gasPrice: 5000000000000 });
      await user.stakeContract.stake(amount, { gasPrice: 5000000000000 });
      dispatch(setStakeCount(stakeCount + amount));
      dispatch(setVIPCount(vipCount - amount));
      toast.success(createSuccessfulTransactionToastContent("Successfully staked"));
    } catch(err) {
      toast.error(err.message);
    } finally {
      setIsStaking(false);
    }    
  }

  const unStake = async () => {
    if (!user.stakeContract || amount <=0) return;
    if (amount >= stakeCount) {
      alert("Exceed amount");
      return;
    }
    try {
      setIsUnstaking(true);
      await user.stakeContract.unstake(amount, { gasPrice: 5000000000000 });
      dispatch(setStakeCount(stakeCount - amount));
      dispatch(setVIPCount(vipCount + amount));
      toast.success(createSuccessfulTransactionToastContent("Successfully unstaked"));
    } catch(err) {
      toast.error(err.message);
    } finally {
      setIsUnstaking(false);
    }    
  }

  const harvest = async () => {
    if (!user.stakeContract) return;
   
    try {
      setIsHarvesting(true);
      const completedPool = await user.stakeContract.completedPool();
      if (completedPool !== '0x000000000000000000000000000000000000') {
        const rewardsContract = new Contract(completedPool, RewardsPoolABI.abi, user.provider.getSigner());
        try {
          const released = await rewardsContract.released(walletAddress);

          if (released > 0) {
            toast.error("Already released");      
          } else {
            const share = await rewardsContract.shares(walletAddress);
            console.log({share})
            if (share > 0) {
              try {
                await user.stakeContract.harvest(walletAddress, { gasPrice: 5000000000000 });
                toast.success(createSuccessfulTransactionToastContent("Successfully harvested"));
                await getStakeAmount();
              } catch(err) {
                toast.error(err.message);      
              }
            } else {
              toast.error("No shares");      
            }
          }          
        } catch(err) {
          console.log({err})
          toast.error("No harvest available");    
        }
      }
    } catch(err) {
      toast.error(err.message);
    } finally {
      setIsHarvesting(false);
    }    
  }

  const onAmountChnage = (e) => {
    setAmount(parseInt(e.target.value));
  }
  return (
    <>
      <div className="row mt-4 d-flex justify-content-center">
        <div className="col-lg-6 text-center d-flex justify-content-sm-between">
          <h4>VipCount: {vipCount} </h4>
          <h4>StakedCount: {stakeCount}</h4>
          <h4>Harvest balance: {harvestAmount} Cro</h4>
        </div>
      </div>
      <div className="row mt-4 text-center d-flex justify-content-center">  
        <div className="col-lg-2 text-center">
          <Form.Control type="number" placeholder="Input the amount" onChange={onAmountChnage} value={amount}/>
        </div>
      </div>
      <div className="row mt-4">
        <div className='col-lg-12 d-flex justify-content-center'>
          <button className="btn-main lead mx-5" onClick={stake} disabled={amount ===0 || vipCount === 0}>
            {isStaking ? (
              <>
                Staking...
                <Spinner animation="border" role="status" size="sm" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              <>Stake</>
            )}
          </button>

          <button className="btn-main lead mx-5" onClick={unStake} disabled={amount === 0 || stakeCount === 0}>
            {isUnstaking ? (
              <>
                UnStaking...
                <Spinner animation="border" role="status" size="sm" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              <>UnStake</>
            )}
          </button>

          <button className="btn-main lead mx-5" onClick={harvest} disabled={parseInt(harvestAmount) === 0}>
            {isHarvesting ? (
              <>
                Harvesting...
                <Spinner animation="border" role="status" size="sm" className="ms-1">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </>
            ) : (
              <>Harvest</>
            )}
          </button>
        </div>
      </div>
    </>  
  );
};

export default memo(MyStaking);
