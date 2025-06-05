import React, {useState, useEffect} from "react";
import {kana} from "../data/kana";
import H2 from "../H2";
import CategoryRadioButton from "./CategoryRadioButton";
import DropsContainer from "./DropsContainer";
import DragsContainer from "./DragsContainer";
import "./game-styles.css"

const DnDGame = () => {
    const [dragItem, setDragItem] = useState(null);
    const [from, setFrom] = useState("Hiragana");
    const [to, setTo] = useState("Romaji");
    const [game, setGame] = useState(false);
    const [correct, setCorrect] = useState([]);
    const [time, setTime] = useState(0);
    const [timeCount, setTimeCount] = useState(false);
    const [isStartDisabled, setIsStartDisabled] = useState(false);
    //audio

    const onDrop = (item) => {
        // console.log("dragItem");
        // console.log(dragItem);
        // console.log("dropItem");
        // console.log(item);
        if (item === dragItem) {
            // console.log("sama");
            setCorrect(correct.concat([dragItem]))
        } else{
            // console.log("ga sama");
            setDragItem(null)
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            timeCount && setTime(t => t + 1);
        }, 1000);
        if (kana.length === correct.length) {
            setTimeCount(false);
        }

        return () => {
            clearInterval(interval);
        };
    }, [timeCount, correct])

    // disable the button if `from` and `to` are the same
    useEffect(() => {
        setIsStartDisabled(from === to);
    }, [from, to]);

    const convertTime = (num) => {
        let res = "";
        let minutes = (Math.floor(num / 60));
        let sec = (num % 60);
        minutes = minutes < 10 ? "0"+minutes : minutes
        sec = sec < 10 ? "0"+sec : sec
        res = minutes + " : " + sec;
        return res;
    }
    const handleStart = () => {
        setGame(true); 
        setCorrect([]); 
        setTimeCount(true)
    }
    const handleBack = () => {
        setGame(false); 
        setTime(0);
    }
    const handleReset = () => {
        setTime(0); 
        setCorrect([]); 
        setTimeCount(true)
    }
    return(
        <div className="flex flex-col items-center justify-center px-4 py-8 min-h-150 from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
        <h1 className="game-title-text text-3xl lg:text-4xl font-bold text-primary">Pairing Kana</h1>

        {/* SETTINGS PANEL */}
        <div className={`${game ? "hidden" : "flex"} flex-col border border-gray-300  min-h-100 dark:border-gray-600 rounded-xl px-8 py-10 shadow-lg bg-white dark:bg-gray-800 w-full max-w-4xl`}>
            <div className="game-styles-settings text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">Game Settings</div>
            <div className="flex flex-col lg:flex-row justify-around items-start gap-8">
                {/* FROM COLUMN */}
                <div className="game-option-box flex flex-col items-center space-y-2">
                    <H2 text="From"/>
                    {["Romaji", "Hiragana", "Katakana"].map(option => (
                    <div className="game-from-to-option-box">
                        <CategoryRadioButton
                            key={option}
                            name="from"
                            value={option}
                            checked={from}
                            onSend={setFrom}
                        />
                    </div>
                    ))}
                </div>

                {/* TO COLUMN */}
                <div className="game-option-box flex flex-col items-center space-y-2">
                    <H2 text="To" />
                    {["Romaji", "Hiragana", "Katakana"].map(option => (
                    <div className="game-from-to-option-box">
                        <CategoryRadioButton
                            key={option}
                            name="to"
                            value={option}
                            checked={to}
                            onSend={setTo}
                        />
                    </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-10">
            <button
                onClick={handleStart}
                className={`game-styles-start-button flex items-center gap-2 px-8 py-3 text-lg font-medium rounded-lg transition-all duration-150 ${
                isStartDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
                disabled={isStartDisabled}
            >
                Start Game
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" d="M13.75 6.75L19.25 12L13.75 17.25" />
                <path stroke="currentColor" d="M19 12H4.75" />
                </svg>
            </button>
            </div>
        </div>

        {/* GAME PANEL */}
        <div className={`${game ? "flex" : "hidden"} flex-col space-y-8 w-full max-w-5xl`}>
            {/* Top Controls */}
            <div className="flex justify-between items-center">
            <button
                onClick={handleBack}
                className="game-styles-button flex items-center gap-2 bg-blue-200 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500 text-blue-900 dark:text-white px-5 py-2 rounded-lg transition"
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" d="M10.25 6.75L4.75 12L10.25 17.25" />
                <path stroke="currentColor" d="M19.25 12H5" />
                </svg>
                Back
            </button>

            <button
                onClick={handleReset}
                className="game-styles-button bg-yellow-300 hover:bg-yellow-400 text-black px-5 py-2 rounded-lg transition"
            >
                Reset
            </button>

            <div className="game-styles-button flex items-center gap-2 bg-green-200 dark:bg-green-600 px-4 py-2 rounded-lg text-lg">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="7.25" stroke="currentColor" />
                <path stroke="currentColor" d="M12 8V12L14 14" />
                </svg>
                <span>{convertTime(time)}</span>
            </div>
            </div>

            {/* Game Areas */}
            <div className="space-y-5">
            <DropsContainer data={kana} category={to} correct={correct} onSetDropItem={onDrop} />
            <DragsContainer data={kana} category={from} correct={correct} dragItem={dragItem} onSetDragItem={setDragItem} />
            </div>
        </div>
        </div>

    )
}

export default DnDGame;