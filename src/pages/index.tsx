import { useState, useEffect } from 'react';
import styles from './index.module.css';

type BumpMapType = number[][];
type ClickedMapType = boolean[][];
type FlaggedMapType = boolean[][];

const Home = () => {
  const [userInputs] = useState([0, 1, 2]);

  const [bumpMap, setBumpMap] = useState<BumpMapType>(
    Array.from({ length: 9 }, () => Array(9).fill(0)),
  );

  const [isBombsPlaced, setIsBombsPlaced] = useState(false);

  const [clickedMap, setClickedMap] = useState<ClickedMapType>(
    Array.from({ length: 9 }, () => Array(9).fill(false)),
  );

  const [flaggedMap, setFlaggedMap] = useState<FlaggedMapType>(
    Array.from({ length: 9 }, () => Array(9).fill(false)),
  );

  const directions = [
    [0, 1],
    [-1, 1],
    [1, 0],
    [1, -1],
    [1, 1],
    [-1, -1],
    [-1, 0],
    [0, -1],
  ];

  const [gameOver, setGameOver] = useState(false);

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

        directions.forEach(([dx, dy]) => {
          const newRow = row + dx;
          const newCol = col + dy;
          if (
            newRow >= 0 &&
            newRow < 9 &&
            newCol >= 0 &&
            newCol < 9 &&
            newBumpMap[newRow][newCol] !== 1
          ) {
            newBumpMap[newRow][newCol]++;
          }
        });
      }
    }

    setBumpMap(newBumpMap);
    setIsBombsPlaced(true);
    console.log('Bombs placed:', newBumpMap);
  };

  const clickHandler = (row: number, col: number, inputType: number) => {
    console.log('clickHandler called with', { row, col, inputType });
    if (!isBombsPlaced) {
      placeBombs(row, col);
    } else {
      console.log('Bombs already placed');
    }

    const newClickedMap = structuredClone(clickedMap) as ClickedMapType;
    const newFlaggedMap = structuredClone(flaggedMap) as FlaggedMapType;

    switch (inputType) {
      case userInputs[0]:
        console.log('No action for blank input type');
        break;
      case userInputs[1]:
        if (!newFlaggedMap[row][col]) {
          newClickedMap[row][col] = true;
          if (bumpMap[row][col] === 1) {
            alert('Game Over');
            setGameOver(true);
            for (let i = 0; i < 9; i++) {
              for (let j = 0; j < 9; j++) {
                if (bumpMap[i][j] === 1) {
                  newClickedMap[i][j] = true;
                }
              }
            }
          }
        }
        break;
      case userInputs[2]:
        if (!newClickedMap[row][col]) {
          newFlaggedMap[row][col] = !newFlaggedMap[row][col];
        }
        break;
      default:
        console.log('Unknown input type');
        break;
    }
    setClickedMap(newClickedMap);
    setFlaggedMap(newFlaggedMap);
  };

  const getCellStyle = (row: number, col: number) => {
    if (flaggedMap[row][col] || (gameOver && bumpMap[row][col] === 1)) {
      return { backgroundPosition: `-330px 0` }; // 旗の位置
    }
    if (clickedMap[row][col]) {
      if (bumpMap[row][col] === 1) {
        return { backgroundPosition: `-360px 0` }; // 爆弾の位置
      }
      return { backgroundPosition: `-${bumpMap[row][col] - 1 * 30}px 0` }; // 数字の位置
    }
    return { backgroundPosition: `-270px 0` }; // 未クリックの位置
  };

  return (
    <div className={styles.container}>
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
