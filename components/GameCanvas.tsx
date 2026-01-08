
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfig, GameStatus, Position, Direction } from '../types';
import { GRID_SIZE, WIN_SCORE } from '../constants';

interface GameCanvasProps {
  config: GameConfig;
  status: GameStatus;
  onScoreChange: (score: number) => void;
  onStatusChange: (status: GameStatus) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ config, status, onScoreChange, onStatusChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);

  const lastProcessedDirection = useRef<Direction>(Direction.RIGHT);
  const nextDirection = useRef<Direction>(Direction.RIGHT);
  const snakeDirections = useRef<Direction[]>([Direction.RIGHT]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const images = useRef<{ head: HTMLImageElement, body: HTMLImageElement, grain: HTMLImageElement, bg: HTMLImageElement } | null>(null);

  const touchStart = useRef<Position | null>(null);
  const minSwipeDistance = 30;

  const ASSET_WIDTH = 40;
  const ASSET_HEIGHT = 71.5;

  useEffect(() => {
    const head = new Image(); head.src = config.headImageUrl;
    const body = new Image(); body.src = config.bodyImageUrl;
    const grain = new Image(); grain.src = config.grainImageUrl;
    const bg = new Image(); bg.src = config.backgroundImageUrl;
    images.current = { head, body, grain, bg };
  }, [config.headImageUrl, config.bodyImageUrl, config.grainImageUrl, config.backgroundImageUrl]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config.musicUrl);
      audioRef.current.loop = true;
    } else if (audioRef.current.src !== config.musicUrl) {
      audioRef.current.src = config.musicUrl;
    }

    if (config.isMusicOn && status === GameStatus.PLAYING) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [config.musicUrl, config.isMusicOn, status]);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    lastProcessedDirection.current = Direction.RIGHT;
    nextDirection.current = Direction.RIGHT;
    snakeDirections.current = [Direction.RIGHT];
    setScore(0);
    onScoreChange(0);
  }, [onScoreChange]);

  const prevStatusRef = useRef<GameStatus>(status);
  useEffect(() => {
    if (status === GameStatus.START || (prevStatusRef.current !== GameStatus.PLAYING && status === GameStatus.PLAYING)) {
      resetGame();
    }
    prevStatusRef.current = status;
  }, [status, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== GameStatus.PLAYING) return;
      
      const current = lastProcessedDirection.current;
      switch (e.key) {
        case 'ArrowUp': if (current !== Direction.DOWN) nextDirection.current = Direction.UP; break;
        case 'ArrowDown': if (current !== Direction.UP) nextDirection.current = Direction.DOWN; break;
        case 'ArrowLeft': if (current !== Direction.RIGHT) nextDirection.current = Direction.LEFT; break;
        case 'ArrowRight': if (current !== Direction.LEFT) nextDirection.current = Direction.RIGHT; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (status !== GameStatus.PLAYING) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (status !== GameStatus.PLAYING || !touchStart.current) return;
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const dx = touchEnd.x - touchStart.current.x;
    const dy = touchEnd.y - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    const current = lastProcessedDirection.current;

    if (absDx > minSwipeDistance || absDy > minSwipeDistance) {
      if (absDx > absDy) {
        if (dx > 0 && current !== Direction.LEFT) nextDirection.current = Direction.RIGHT;
        else if (dx < 0 && current !== Direction.RIGHT) nextDirection.current = Direction.LEFT;
      } else {
        if (dy > 0 && current !== Direction.UP) nextDirection.current = Direction.DOWN;
        else if (dy < 0 && current !== Direction.DOWN) nextDirection.current = Direction.UP;
      }
    }
    touchStart.current = null;
  };

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const gameTick = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        
        const currentDir = nextDirection.current;
        lastProcessedDirection.current = currentDir;

        if (currentDir === Direction.UP) newHead.y -= 1;
        if (currentDir === Direction.DOWN) newHead.y += 1;
        if (currentDir === Direction.LEFT) newHead.x -= 1;
        if (currentDir === Direction.RIGHT) newHead.x += 1;

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          onStatusChange(GameStatus.GAMEOVER);
          return prevSnake;
        }

        if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          onStatusChange(GameStatus.GAMEOVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        const newDirections = [currentDir, ...snakeDirections.current];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 1;
          setScore(newScore);
          onScoreChange(newScore);
          
          if (newScore >= WIN_SCORE) {
            onStatusChange(GameStatus.WIN);
          } else {
            let newFood;
            do {
              newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
              };
            } while (newSnake.some(s => s.x === newFood.x && s.y === newFood.y));
            setFood(newFood);
          }
        } else {
          newSnake.pop();
          newDirections.pop();
        }

        snakeDirections.current = newDirections;
        return newSnake;
      });
    };

    const intervalId = setInterval(gameTick, config.speed);
    return () => clearInterval(intervalId);
  }, [status, food, score, config.speed, onScoreChange, onStatusChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cell = w / GRID_SIZE;

      ctx.clearRect(0, 0, w, h);

      if (images.current?.bg.complete) {
        ctx.drawImage(images.current.bg, 0, 0, w, h);
      } else {
        ctx.fillStyle = '#469C15';
        ctx.fillRect(0, 0, w, h);
      }

      if (images.current?.grain.complete) {
        ctx.drawImage(images.current.grain, food.x * cell, food.y * cell, cell, cell);
      } else {
        ctx.fillStyle = '#FFFAEB';
        ctx.beginPath();
        ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell / 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      snake.forEach((seg, i) => {
        const dir = snakeDirections.current[i] || Direction.RIGHT;
        const centerX = seg.x * cell + cell / 2;
        const centerY = seg.y * cell + cell / 2;

        ctx.save();
        ctx.translate(centerX, centerY);

        let rotation = 0;
        switch (dir) {
          case Direction.UP: rotation = 0; break;
          case Direction.DOWN: rotation = Math.PI; break;
          case Direction.LEFT: rotation = -Math.PI / 2; break;
          case Direction.RIGHT: rotation = Math.PI / 2; break;
        }
        ctx.rotate(rotation);

        if (i === 0) {
          if (images.current?.head.complete) {
            ctx.drawImage(images.current.head, -ASSET_WIDTH / 2, -ASSET_HEIGHT / 2, ASSET_WIDTH, ASSET_HEIGHT);
          } else {
            ctx.fillStyle = '#7AC346';
            ctx.fillRect(-ASSET_WIDTH / 2, -ASSET_HEIGHT / 2, ASSET_WIDTH, ASSET_HEIGHT);
          }
        } else {
          if (images.current?.body.complete) {
            ctx.drawImage(images.current.body, -ASSET_WIDTH / 2, -ASSET_HEIGHT / 2, ASSET_WIDTH, ASSET_HEIGHT);
          } else {
            ctx.fillStyle = '#90CD65';
            ctx.fillRect(-ASSET_WIDTH / 2, -ASSET_HEIGHT / 2, ASSET_WIDTH, ASSET_HEIGHT);
          }
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [snake, food]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-transparent touch-none z-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full max-w-[440px] max-h-[440px] aspect-square shadow-2xl border-2 border-white/5 overflow-hidden pointer-events-none relative z-0"
      />
      
      {status === GameStatus.PLAYING && (
        <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center z-10">
          <div className="w-1/2 h-1/2 border-2 border-white border-dashed" />
        </div>
      )}
    </div>
  );
};

export default GameCanvas;