import React, {memo} from 'react';
import {faBook, faGlobe, faLink} from "@fortawesome/free-solid-svg-icons";
import {faDiscord, faMedium, faTelegram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import LayeredIcon from "../components/LayeredIcon";
import {toast} from "react-toastify";

const SocialsBar = ({collection}) => {

    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        toast.success('Copied!');
    }

    return (
        <div className="mt-2">
            {collection.metadata.website &&
                <a href={collection.metadata.website} target="_blank">
                    <LayeredIcon
                        icon={faGlobe}
                    />
                </a>
            }
            {collection.metadata.twitter &&
                <a href={collection.metadata.twitter} target="_blank">
                    <LayeredIcon
                        icon={faTwitter}
                    />
                </a>
            }
            {collection.metadata.discord &&
            <a href={collection.metadata.discord} target="_blank">
                <LayeredIcon
                    icon={faDiscord}
                />
            </a>
            }
            {collection.metadata.telegram &&
            <a href={collection.metadata.telegram} target="_blank">
                <LayeredIcon
                    icon={faTelegram}
                />
            </a>
            }
            {collection.metadata.medium &&
            <a href={collection.metadata.medium} target="_blank">
                <LayeredIcon
                    icon={faMedium}
                />
            </a>
            }
            {collection.metadata.gitbook &&
            <a href={collection.metadata.gitbook} target="_blank">
                <LayeredIcon
                    icon={faBook}
                />
            </a>
            }
            <span onClick={handleCopy(collection.address)} style={{cursor:'pointer'}}>
                <LayeredIcon
                    icon={faLink}
                />
            </span>
        </div>
    );
};

export default memo(SocialsBar);
