import logo from "./logo.svg";
import "./App.css";
// import "antd/dist/antd";
import { useState, useEffect } from "react";
import SettingModal from "./components/SettingModal";

const transpose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

const initData = Array.from({ length: 4 }, () =>
  Array.from({ length: 10 }, (_, index) => index)
);

function generateUniqueRow() {
  const row = [];
  while (row.length < 10) {
    const randomNum = Math.floor(Math.random() * 10);
    if (!row.includes(randomNum)) {
      row.push(randomNum);
    }
  }
  return row;
}

function generateArray() {
  const array = [];
  for (let i = 0; i < 4; i++) {
    array.push(generateUniqueRow());
  }
  return array;
}

function generateNewArray(originalArray) {
  const newArray = [];

  for (let row = 0; row < originalArray.length; row++) {
    const newRow = [];
    for (let col = 0; col < originalArray[row].length; col++) {
      if (originalArray[row][col] !== -1) {
        // If the item is not -1, keep the same value
        newRow.push(originalArray[row][col]);
      } else {
        // Generate a random unique number from 0-9 that is not in the current row
        let randomNum;
        do {
          randomNum = Math.floor(Math.random() * 10);
        } while (
          newRow.includes(randomNum) ||
          originalArray[row].includes(randomNum)
        );

        newRow.push(randomNum);
      }
    }
    newArray.push(newRow);
  }

  return newArray;
}

let restBalls = 10;
let frameIndex = [0, 0, 0, 0];
let earthIndex = 0;
let isGlobePause = true;
let isBallPause = true;
let isGlobeState = true;

let expectedData = generateArray();

let timeoutId = 0;
function App() {
  const [isBgBlack, setIsBgBlack] = useState(true);
  const [dummy, setDummy] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [customData, setCustomData] = useState(
    Array.from({ length: 4 }, () => Array(10).fill(-1))
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [show, setShow] = useState([false, false, false, false]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Add logic for when the "OK" button is clicked
    console.log("Clicked OK");
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleRestart = () => {
    clearTimeout(timeoutId);
    isGlobePause = true;
    isBallPause = true;
    setShow([false, false, false, false]);
    restBalls = 10;
    frameIndex = [0, 0, 0, 0];
    earthIndex = 0;
    isGlobePause = false;
    expectedData = generateNewArray(customData);
    setDummy(!dummy);
  };

  const playVideo = () => {
    if (frameIndex[earthIndex] < 80 - 1 && restBalls > 1) {
      let bufFrameIndex = JSON.parse(JSON.stringify(frameIndex));
      bufFrameIndex[earthIndex] += 1;
      frameIndex = bufFrameIndex;
      setDummy(!dummy);
    } else {
      isBallPause = false;
      isGlobePause = true;
      let bufShow = [false, false, false, false];
      bufShow[earthIndex] = true;

      setShow(bufShow);
    }
  };

  const onVideoEnd = () => {
    if (earthIndex < 4 - 1) {
      earthIndex = earthIndex + 1;
      isBallPause = true;
      isGlobePause = false;
      // setDummy(!dummy);
    } else if (restBalls > 1) {
      earthIndex = 0;
      frameIndex = [0, 0, 0, 0];
      restBalls = restBalls - 1;
      isBallPause = true;
      isGlobePause = false;
      // setDummy(!dummy);
    } else {
      restBalls -= 1;
      isGlobePause = true;
      isBallPause = true;
    }

    setShow([false, false, false, false]);
  };

  useEffect(() => {
    setTimeout(() => {
      if (!isGlobePause) {
        playVideo();
      }
      setDummy(!dummy);
    }, 50);
  }, [dummy]);

  return (
    <div
      className={
        isBgBlack
          ? "App bg-black text-white overflow-y-auto"
          : "App bg-red-950 text-white  overflow-y-auto"
      }
    >
      <header className="shadow-lg py-4 px-4 font-[sans-serif]">
        <button
          className="px-8"
          onClick={() => {
            if (isBallPause == true && isGlobePause == true) {
              if (restBalls <= 1) {
                handleRestart();
                return;
              }
              if (isGlobeState) isGlobePause = false;
              else isBallPause = false;
            } else {
              isGlobeState = !isGlobePause;
              isBallPause = true;
              isGlobePause = true;
            }

            if (isGlobePause == false) playVideo();
          }}
        >
          {isGlobePause && isBallPause ? "PAUSAR" : "RESUMIR"}
        </button>
        <button className="px-8" onClick={() => handleRestart()}>
          REINICIAR
        </button>
        <button className="px-8" onClick={showModal}>
          CUSTOMIZAR
        </button>
        <button
          className="px-8"
          onClick={() => {
            setIsBgBlack(!isBgBlack);
          }}
        >
          ALTERAR TEMA
        </button>
      </header>
      <div className="flex justify-center items-center grow">
        <div className="flex flex-wrap justify-center items-center">
          <div className="relative inline-block w-28 h-36">
            <img
              className="w-full h-auto"
              src={
                restBalls <= 1
                  ? earthIndex >= 0
                    ? `./assets/empty.png`
                    : `./assets/2_79.png`
                  : `./assets/${restBalls}_${frameIndex[0]}.png`
              }
              alt="Slideshow Image"
            />
            <div
              style={{
                position: "absolute",
                top: "80%",
                left: "44%",
                transform:
                  "translate(-50%, -50%)" /* Center the overlay image */,
                width: "16px" /* Set desired width for overlay image */,
                height: "16px" /* Set desired height for overlay image */,
                opacity: "0",
                animationPlayState: isBallPause ? "paused" : "running",
              }}
              className={`bg-gray-400 rounded-full flex justify-center items-center ${
                show[0] ? "zoom-div" : ""
              }`}
              onAnimationEnd={onVideoEnd}
            >
              {expectedData[0][10 - restBalls]}
            </div>
          </div>

          <div className="relative inline-block w-28 h-36">
            <img
              className="w-full h-auto"
              src={
                restBalls <= 1
                  ? earthIndex >= 1
                    ? `./assets/empty.png`
                    : `./assets/2_79.png`
                  : `./assets/${restBalls}_${frameIndex[1]}.png`
              }
              alt="Slideshow Image"
            />
            <div
              style={{
                position: "absolute",
                top: "80%",
                left: "44%",
                transform:
                  "translate(-50%, -50%)" /* Center the overlay image */,
                width: "16px" /* Set desired width for overlay image */,
                height: "16px" /* Set desired height for overlay image */,
                opacity: "0",
                animationPlayState: isBallPause ? "paused" : "running",
              }}
              className={`bg-gray-400 rounded-full flex justify-center items-center ${
                show[1] ? "zoom-div" : ""
              }`}
              onAnimationEnd={onVideoEnd}
            >
              {expectedData[1][10 - restBalls]}
            </div>
          </div>
          <div className="relative inline-block w-28 h-36">
            <img
              className="w-full h-auto"
              src={
                restBalls <= 1
                  ? earthIndex >= 2
                    ? `./assets/empty.png`
                    : `./assets/2_79.png`
                  : `./assets/${restBalls}_${frameIndex[2]}.png`
              }
              alt="Slideshow Image"
            />
            <div
              style={{
                position: "absolute",
                top: "80%",
                left: "44%",
                transform:
                  "translate(-50%, -50%)" /* Center the overlay image */,
                width: "16px" /* Set desired width for overlay image */,
                height: "16px" /* Set desired height for overlay image */,
                opacity: "0",
                animationPlayState: isBallPause ? "paused" : "running",
              }}
              className={`bg-gray-400 rounded-full flex justify-center items-center ${
                show[2] ? "zoom-div" : ""
              }`}
              onAnimationEnd={onVideoEnd}
            >
              {expectedData[2][10 - restBalls]}
            </div>
          </div>
          <div className="relative inline-block w-28 h-36">
            <img
              className="w-full h-auto"
              src={
                restBalls <= 1
                  ? earthIndex >= 3
                    ? `./assets/empty.png`
                    : `./assets/2_79.png`
                  : `./assets/${restBalls}_${frameIndex[3]}.png`
              }
              alt="Slideshow Image"
            />
            <div
              style={{
                position: "absolute",
                top: "80%",
                left: "44%",
                transform:
                  "translate(-50%, -50%)" /* Center the overlay image */,
                width: "16px" /* Set desired width for overlay image */,
                height: "16px" /* Set desired height for overlay image */,
                opacity: "0",
                animationPlayState: isBallPause ? "paused" : "running",
              }}
              className={`bg-gray-400 rounded-full flex justify-center items-center ${
                show[3] ? "zoom-div" : ""
              }`}
              onAnimationEnd={onVideoEnd}
            >
              {expectedData[3][10 - restBalls]}
            </div>
          </div>
        </div>
      </div>
      <SettingModal
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        customData={customData}
        setCustomData={setCustomData}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        initData={initData}
      />
      <div className="w-full flex flex-wrap justify-center items-center">
        {transpose(initData).map((row, x) => (
          <div className="flex flex-wrap m-4" key={x}>
            {row.map((col, y) => (
              <div
                className={`${
                  (10 - restBalls) * 4 + earthIndex > x * 4 + y
                    ? ""
                    : "bg-transparent text-transparent"
                } bg-gray-400 rounded-full w-4 h-4 m-1 flex justify-center items-center `}
                key={y}
              >
                {expectedData[y][x]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
