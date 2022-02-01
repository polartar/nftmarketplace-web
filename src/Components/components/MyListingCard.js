import React, { memo } from 'react';
import styled from "styled-components";
import { useHistory  } from "react-router-dom";
import { ethers } from "ethers";
import {Card} from "react-bootstrap";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  height: 100%;
`;

const MyListingCard = ({
    nft,
    className = 'col-sm-12 col-md-12 col-lg-6 d-item',
    width,
    onImgLoad
}) => {
    const history = useHistory();

    const navigateTo = (link) => {
        history.push(link);
    }

    const viewListingDetails = () => {
        navigateTo(`/listing/${ nft.listingId }`);
    }

    return (
        <Card>
            <div className="row g-0">
                <div className="col-md-4">
                    <img src={nft.image} className="img-fluid rounded-start" alt="" />
                </div>

                <Card.Body className="col-md-8">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                </Card.Body>
            </div>
            <Card.Footer>
                Put buttons here
            </Card.Footer>
        </Card>
    );
};

export default memo(MyListingCard);
