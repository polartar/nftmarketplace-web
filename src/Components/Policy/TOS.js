import {React, Component} from "react";

import tos from './tos.html'

// function createMarkup() {
//     return{
//         __html: ''
//     };
// }

const TOSAgreement = () => {
    return(
        <div dangerouslySetInnerHTML={tos}/>
    )
}

export default TOSAgreement;