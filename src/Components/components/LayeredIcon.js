import React, { memo } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";

const LayeredIcon = ({ icon, bgIcon = faCircle, bgClass = 'layer-1', stackClass= 'eb-icon_stack', shrink = 7 }) => {
    return (
        <span className={`fa-layers fa-fw fa-2x ${stackClass}`}>
            <FontAwesomeIcon icon={bgIcon} className={bgClass} />
            <FontAwesomeIcon icon={icon} inverse transform={`shrink-${shrink}`}/>
        </span>
    )
}

export default memo(LayeredIcon);