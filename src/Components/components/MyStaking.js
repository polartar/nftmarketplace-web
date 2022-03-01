import React, { memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setStakeCount, setVIPCount } from '../../GlobalState/User';
import { Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createSuccessfulTransactionToastContent } from '../../utils';
import config from '../../Assets/networks/rpc_config.json';

const MyStaking = ({ walletAddress = null }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const stakeCount = user.stakeCount;
  const vipCount = user.vipCount;
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [amount, setAmount] = useState(0);
  
  const stake = async () => {
    if (!user.stakeContract || amount === 0) return;
    if (amount >= vipCount) {
      toast.error("Exceed amount");
      return;
    }
    try {
      setIsStaking(true);
      const isApproved = await user.membershipContract.isApprovedForAll(walletAddress, config.stake_contract);
      if (!isApproved) {
        await user.membershipContract.setApprovalForAll(config.stake_contract, true);
      }
      await user.stakeContract.stake(amount);
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
    if (!user.stakeContract || amount ===0) return;
    if (amount >= stakeCount) {
      alert("Exceed amount");
      return;
    }
    try {
      setIsUnstaking(true);
      await user.stakeContract.unstake(amount);
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
      await user.stakeContract.harvest(walletAddress);
      toast.success(createSuccessfulTransactionToastContent("Successfully harvested"));
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
        <div className="col-lg-4 text-center d-flex justify-content-sm-between">
          <h4>VipCount: {vipCount} </h4>
          <h4>StakedCount: {stakeCount}</h4>
        </div>
      </div>
      <div className="row mt-4 text-center d-flex justify-content-center">  
        <div className="col-lg-2 text-center">
          <Form.Control type="number" placeholder="Input the amount" onChange={onAmountChnage} value={amount}/>
        </div>
      </div>
      <div className="row mt-4">
        <div className='col-lg-12 d-flex justify-content-center'>
          <button className="btn-main lead mx-5" onClick={stake} disabled={vipCount === 0}>
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

          <button className="btn-main lead mx-5" onClick={unStake} disabled={stakeCount === 0}>
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

          <button className="btn-main lead mx-5" onClick={harvest}>
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
