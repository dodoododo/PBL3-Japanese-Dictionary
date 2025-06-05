import React from 'react';
import KanaBox from './KanaBox';
import './kana-styles.css';

const KanaContainer = (props) => {
  return (
    <>
      {/* First 5-column section */}
      <div className="kana-container">
        {props.kana.map((hira, index) => {
          if (index >= 46) {
            return null; // Return null to skip rendering
          }
          return (
            <KanaBox key={index} data={hira} blind={props.blind} />
          );
        })}
      </div>

      {/* Wrap the next two sections in a flex-col div */}
      <div className="kana-flex-col">
        {/* Second 5-column section */}
        <div className="kana-container">
          {props.kana.map((hira, index) => {
            if (index < 46 || index >= 71) {
              return null;
            }
            return (
              <KanaBox key={index} data={hira} blind={props.blind} />
            );
          })}
        </div>

        {/* Final 3-column section */}
        <div className="kana-container" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {props.kana.map((hira, index) => {
            if (index < 71) {
              return null;
            }
            return (
              <KanaBox key={index} data={hira} blind={props.blind} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default KanaContainer;