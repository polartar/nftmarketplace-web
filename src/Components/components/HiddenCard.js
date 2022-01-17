import React, { memo } from 'react';
import Opesc from "../../Assets/opesc.jpeg"

const HiddenCard = () => {

    return (
        <div className="card eb-nft__card h-100 shadow">
            <img src={Opesc} className={`card-img-top marketplace`} />
            <div className="badge bg-rarity-none text-wrap mt-1 mx-1">
                Rank: N/A
            </div>
            <div className="card-body d-flex flex-column">

            </div>
        </div>
    );
};

export default memo(HiddenCard);