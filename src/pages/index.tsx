import { useState, useEffect } from 'react';
import styles from './index.module.css';

type BumpMapType = number[][];
type ClickedMapType = boolean[][];
type FlaggedMapType = boolean[][];

const Home = () => {
  const [userInputs] = useState([0, 1, 2]);
  const [bumpMap, setBumpMap] = useState<BumpMapType>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [isBombsPlaced, setIsBombsPlaced] = useState(false);
  const [clickedMap, setClickedMap] = useState<ClickedMapType>(
    Array.from({ length: 9 }, () => Array(9).fill(false)),
  );
  const [flaggedMap, setFlaggedMap] = useState<FlaggedMapType>(
    Array.from({ length: 9 }, () => Array(9).fill(false)),
  );

  useEffect(() => {
    console.log('bumpMap:', bumpMap);
  }, [bumpMap]);

  useEffect(() => {
    console.log('clickedMap:', clickedMap);
  }, [clickedMap]);

  useEffect(() => {
    console.log('flaggedMap:', flaggedMap);
  }, [flaggedMap]);

  const placeBombs = (initialRow: number, initialCol: number) => {
    const newBumpMap = structuredClone(bumpMap) as BumpMapType;
    let bombCounts = 0;
    while (bombCounts < 10) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (newBumpMap[row][col] === 0 && (row !== initialRow || col !== initialCol)) {
        newBumpMap[row][col] = 1;
        bombCounts++;
      }
    }

    setBumpMap(newBumpMap);
    setIsBombsPlaced(true);
  };

  const clickHandler = (row: number, col: number, inputType: number) => {
    console.log('clickHandler called with', { row, col, inputType });
    if (isBombsPlaced) {
      placeBombs(row, col);
    }

    const newClickedMap = structuredClone(clickedMap) as ClickedMapType;
    const newFlaggedMap = structuredClone(flaggedMap) as FlaggedMapType;
    const newBumpMap = structuredClone(bumpMap) as BumpMapType;

    switch (inputType) {
      case userInputs[0]: // Continue
        console.log('Continue');
        break;
      case userInputs[1]: // Left Click
        if (newBumpMap[row][col] === 1) {
          alert('Game Over');
        } else {
          newClickedMap[row][col] = true; // Mark as clicked
        }
        break;
      case userInputs[2]: // Right Click
        newFlaggedMap[row][col] = !newFlaggedMap[row][col]; // Toggle flag
        break;
      default:
        console.log('Unknown input type');
        break;
    }
    setClickedMap(newClickedMap);
    setFlaggedMap(newFlaggedMap);
    setBumpMap(newBumpMap);
  };

  const getCellStyle = (row: number, col: number) => {
    if (flaggedMap[row][col]) {
      return { backgroundPosition: `-330px 0` }; // 旗の位置
    }
    if (clickedMap[row][col]) {
      if (bumpMap[row][col] === 1) {
        return { backgroundPosition: `-360px 0` }; // 爆弾の位置
      }
      return { backgroundPosition: `-${bumpMap[row][col] * 30}px 0` }; // 数字の位置
    }
    return { backgroundPosition: `-270px 0` }; // 未クリックの位置
  };

  const [sampleVal, setSampleVal] = useState(0);
  console.log(sampleVal);

  return (
    <div className={styles.container}>
      <div
        className={styles.sampleStyle}
        style={{ backgroundPosition: `-${sampleVal * 30}px 0` }}
      />
      <button onClick={() => setSampleVal((val) => (val + 1) % 14)}>Sample</button>
      <div className={styles.boardStyle}>
        {bumpMap.map((row, y) =>
          row.map((col, x) => (
            <div
              key={`${y}-${x}`}
              className={styles.cellStyle}
              style={getCellStyle(y, x)}
              onClick={() => clickHandler(y, x, userInputs[1])} // 左クリック
              onContextMenu={(e) => {
                e.preventDefault();
                clickHandler(y, x, userInputs[2]); // 右クリック
              }}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
