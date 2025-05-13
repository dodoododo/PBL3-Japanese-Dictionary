import React from 'react'
import KanaBox from "./KanaBox";

const KanaContainer = (props) => {
  return (
    <>
      {/* Phần 5 cột đầu tiên */}
      <ul className="grid grid-cols-5 auto-rows-min gap-2 lg:gap-4 lg:p-4 mb-6">
        {
          props.kana.map((hira, index) => {
            if (index >= 46) {
              return null; // trả về null thay vì true để không render
            }
            return (
              <KanaBox data={hira} key={index} span={1} />
            )
          })
        }
      </ul>

      {/* Bọc 2 phần dưới trong div flex-col */}
      <div className="flex flex-col col-span-1 space-y-4 lg:space-y-6">
        {/* Phần 5 cột thứ 2 */}
        <ul className="grid grid-cols-5 auto-rows-min gap-2 lg:gap-4 lg:p-4">
          {
            props.kana.map((hira, index) => {
              if (index < 46 || index >= 71) {
                return null;
              }
              return (
                <KanaBox data={hira} key={index} span={1} />
              )
            })
          }
        </ul>

        {/* Phần 3 cột cuối cùng */}
        <ul className="grid grid-cols-3 auto-rows-min gap-2 pb-4 lg:gap-4 lg:px-4">
          {
            props.kana.map((hira, index) => {
              if (index < 71) {
                return null;
              }
              return (
                <KanaBox data={hira} key={index} span={2} />
              )
            })
          }
        </ul>
      </div>
    </>
  )
}

export default KanaContainer;
