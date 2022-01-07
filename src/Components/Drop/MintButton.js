import React, { memo } from 'react';
import {Button, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";

const MintButton = ({mintCallback, maxMintPerTx, numToMint, title}) => {

    const user = useSelector((state) => {
        return state.user;
    });

    return (
        <>
            {user.connectingWallet ?
                <Button className='btn-main lead mb-5 mr15' disabled>
                    <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Button>
                :
                <Button className='btn-main lead mb-5 mr15' onClick={mintCallback}>
                    {title ?
                        <>{title}</>
                        :
                        <>
                            {maxMintPerTx && maxMintPerTx > 1 ?
                                <>Mint {numToMint}</>
                                :
                                <>Mint</>
                            }
                        </>
                    }
                </Button>
            }
        </>
    );
};

export default memo(MintButton);