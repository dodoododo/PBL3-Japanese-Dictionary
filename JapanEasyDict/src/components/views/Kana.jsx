import React, { useState, useEffect, Suspense} from 'react';
import { hiragana } from "../data/hiragana";
import { katakana } from "../data/katakana";
import KanaContainer from "../KanaContainer";
import H1 from '../H1'
// import FallbackLoading from '../FallbackLoading';

const Kana = (props) => {
    const [kana, setKana] = useState([]);
    useEffect(() => {
        if (props.title === "Hiragana") {
            setKana(hiragana);
        } else if (props.title === "Katakana"){
            setKana(katakana);
        }
        window.scrollTo(0,0)
    }, [props.title])
    return(
        <div className="text-center lg:mx-36">
            <H1 span={props.symbol} text={props.title}/>
            <div className="grid grid-cols-1 lg:grid-cols-2 px-3 py-4 lg:p-6 shadow-inner mx-1 bg-gray-200 dark:bg-gray-900 space-y-4 lg:space-y-0 p-8 rounded-2xl">
                
                    <KanaContainer kana={kana}/>
                
            </div>
        </div>
    )
}

export default Kana;