import React from 'react'

const KanaBox = (props) => {
    if (props.blind) {
        // Ô mù: chỉ là box xám, không có chữ
        return (
                <li className="box-border rounded-md bg-gray-300 p-4 min-h-[64px] min-w-[64px]"></li>
        );
    }
    return (
            <li className={
                "box-border transition-all delay-75 col-span-" + props.span +
                (props.data.start ? " col-start-" + props.data.start : "") +
                " rounded-md bg-gray-50 dark:bg-gray-800 p-4 shadow-md dark:hover:shadow-none hover:shadow-none"
            }>
                <p className="text-xl lg:text-3xl font-black mb-1 lg:mb-2">{props.data.kana}</p>
                <p className="font-semibold text-sm lg:text-base text-primary text-red-400">{props.data.romaji}</p>
            </li>
    )
}

export default KanaBox;
