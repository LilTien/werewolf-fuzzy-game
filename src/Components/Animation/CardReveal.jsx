import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "../Button";
import FlipCardSd from "../../assets/sounds/flipcard.wav";
import FairySd from "../../assets/sounds/fairy-sparkle.wav";
import { Howl } from "howler";

const HALF_FLIP = 65;

function SparkleField({ trigger }) {
  const particles = useMemo(() => {
    if (!trigger) return [];

    const palette = [
      "#fbbf24",
      "#f59e0b",
      "#fef08a",
      "#ffffff",
      "#e0f8cf",
      "#7dd3fc",
      "#c4b5fd",
    ];

    return Array.from(
      { length: 24 },
      (_, index) => {
        const angle =
          (index / 24) * 2 * Math.PI +
          (Math.random() - 0.5) * 0.5;

        const distance =
          70 + Math.random() * 150;

        return {
          id: index,
          dx:
            Math.cos(angle) *
            distance,
          dy:
            Math.sin(angle) *
            distance,
          color:
            palette[
              Math.floor(
                Math.random() *
                  palette.length
              )
            ],
          size:
            3 + Math.random() * 8,
          delay:
            Math.floor(
              Math.random() * 200
            ),
          duration:
            500 +
            Math.floor(
              Math.random() * 500
            ),
        };
      }
    );
  }, [trigger]);

  if (!trigger) return null;

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            rounded-full
          "
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,

            boxShadow:
              `0 0 ${
                particle.size * 3
              }px ${particle.color}`,

            "--dx":
              `${particle.dx}px`,
            "--dy":
              `${particle.dy}px`,

            animation:
              `sparkleOut ` +
              `${particle.duration}ms ` +
              `${particle.delay}ms ` +
              "ease-out forwards",
          }}
        />
      ))}
    </>
  );
}

export default function CardRevealAnimation({
  cards = [],
  assignedCardId,
  isOpen,
  onClose,
  autoCloseDuration = 10,
}) {
  const [
    currentIndex,
    setCurrentIndex,
  ] = useState(0);

  const [
    flipPhase,
    setFlipPhase,
  ] = useState("show");

  const [phase, setPhase] =
    useState("idle");

  const [
    sparkleTrigger,
    setSparkleTrigger,
  ] = useState(0);

  const [
    screenFlash,
    setScreenFlash,
  ] = useState(false);

  const [timeLeft, setTimeLeft] =
    useState(autoCloseDuration);

  const [showText, setShowText] =
    useState(false);

  const [
    showControls,
    setShowControls,
  ] = useState(false);

  const timeoutIdsRef = useRef([]);
  const timerRef = useRef(null);

  const flipSound = useMemo(
    () =>
      new Howl({
        src: [FlipCardSd],
        volume: 0.4,
      }),
    []
  );

  const sparkleSound = useMemo(
    () =>
      new Howl({
        src: [FairySd],
        volume: 0.4,
      }),
    []
  );

  const clearAll = () => {
    timeoutIdsRef.current.forEach(
      clearTimeout
    );

    timeoutIdsRef.current = [];

    clearInterval(timerRef.current);
  };

  const assignedIndex = useMemo(
    () =>
      Math.max(
        0,
        cards.findIndex(
          (card) =>
            card.id === assignedCardId
        )
      ),
    [cards, assignedCardId]
  );

  useEffect(() => {
    if (!isOpen) {
      clearAll();
      return;
    }

    if (cards.length === 0) {
      return;
    }

    const addTimeout = (
      callback,
      delay
    ) => {
      const timeoutId = setTimeout(
        callback,
        delay
      );

      timeoutIdsRef.current.push(
        timeoutId
      );
    };

    setPhase("shuffling");
    setShowText(false);
    setShowControls(false);
    setScreenFlash(false);
    setTimeLeft(autoCloseDuration);
    setFlipPhase("show");

    const intervals = [
      ...Array(14).fill(80),
      105,
      135,
      178,
      235,
      308,
      405,
      540,
      710,
      930,
    ];

    let cursor = 350;

    intervals.forEach((interval) => {
      cursor += interval;

      addTimeout(() => {
        setFlipPhase("hide");

        addTimeout(() => {
          flipSound.play();

          setCurrentIndex(
            Math.floor(
              Math.random() *
                cards.length
            )
          );

          setFlipPhase("show");
        }, HALF_FLIP);
      }, cursor);
    });

    cursor += 1150;

    addTimeout(() => {
      setFlipPhase("hide");

      addTimeout(() => {
        sparkleSound.play();

        setCurrentIndex(
          assignedIndex
        );

        setFlipPhase("show");

        addTimeout(() => {
          setPhase("revealed");
          setScreenFlash(true);

          addTimeout(
            () =>
              setScreenFlash(false),
            700
          );

          setSparkleTrigger(
            (previous) =>
              previous + 1
          );

          addTimeout(
            () => setShowText(true),
            380
          );

          addTimeout(
            () =>
              setShowControls(true),
            680
          );
        }, HALF_FLIP + 60);
      }, HALF_FLIP);
    }, cursor);

    return clearAll;
  }, [
    isOpen,
    cards.length,
    assignedIndex,
    autoCloseDuration,
    flipSound,
    sparkleSound,
  ]);

  useEffect(() => {
    if (phase !== "revealed") {
      return;
    }

    let remaining =
      autoCloseDuration;

    setTimeLeft(remaining);

    timerRef.current =
      setInterval(() => {
        remaining -= 1;

        setTimeLeft(remaining);

        if (remaining <= 0) {
          clearInterval(
            timerRef.current
          );

          onClose?.();
        }
      }, 1000);

    return () =>
      clearInterval(timerRef.current);
  }, [
    phase,
    autoCloseDuration,
    onClose,
  ]);

  if (!isOpen) return null;

  const card =
    cards[currentIndex] ?? {};

  const isRevealed =
    phase === "revealed";

  const timerPercentage =
    Math.max(
      0,
      (timeLeft /
        autoCloseDuration) *
        100
    );

  return (
    <>
      <style>{`
        @keyframes sparkleOut {
          0% {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1.5);
          }

          100% {
            opacity: 0;
            transform:
              translate(
                calc(-50% + var(--dx)),
                calc(-50% + var(--dy))
              )
              scale(0.1);
          }
        }

        @keyframes flashIn {
          0% {
            opacity: 0;
          }

          15% {
            opacity: 0.75;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes backdropIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform:
              translateY(14px);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform:
              translateY(14px)
              scale(0.88);
          }

          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes glow {
          0% {
            box-shadow:
              0 0 0
              rgba(163, 163, 163, 0);
          }

          45% {
            box-shadow:
              0 0 55px 14px
                rgba(163, 163, 163, 0.75),
              0 0 120px 30px
                rgba(163, 163, 163, 0.25);
          }

          100% {
            box-shadow:
              0 0 28px 5px
              rgba(163, 163, 163, 0.38);
          }
        }

        @keyframes bounce {
          0% {
            transform: scale(1);
          }

          35% {
            transform: scale(1.08);
          }

          65% {
            transform: scale(0.97);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes ringPulse {
          0% {
            opacity: 0.85;
            transform:
              translate(-50%, -50%)
              scale(1);
          }

          100% {
            opacity: 0;
            transform:
              translate(-50%, -50%)
              scale(2.5);
          }
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }

          50%, 100% {
            opacity: 0.3;
          }
        }

        .role-reveal-layout {
          --card-width: 260px;
          --card-height: 364px;

          display: flex;
          width: 100%;
          max-width: 320px;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .role-reveal-card-stage {
          position: relative;
          display: flex;
          width: var(--card-width);
          height: var(--card-height);
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .role-reveal-card {
          position: relative;
          width: var(--card-width);
          height: var(--card-height);
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 16px;
        }

        .role-reveal-ring {
          width:
            calc(
              var(--card-width) + 10px
            );

          height:
            calc(
              var(--card-height) + 10px
            );
        }

        .role-reveal-details {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        @media
          (orientation: landscape)
          and (max-height: 600px) {

          .role-reveal-layout {
            --card-width:
              min(31vw, 185px);

            --card-height:
              calc(
                var(--card-width) * 1.4
              );

            max-width: 720px;
            display: grid;
            grid-template-columns:
              auto minmax(220px, 1fr);
            align-items: center;
            justify-content: center;
            gap: clamp(
              18px,
              5vw,
              54px
            );
          }

          .role-reveal-details {
            min-width: 0;
            align-items: flex-start;
            gap: 10px;
            text-align: left;
          }

          .role-reveal-description {
            max-width: 320px !important;
            text-align: left !important;
            line-height: 1.7 !important;
          }

          .role-reveal-label {
            position: absolute;
            left: 50%;
            top: 12px;
            z-index: 20;
            transform:
              translateX(-50%);
            white-space: nowrap;
          }

          .role-reveal-controls {
            width: min(
              100%,
              320px
            ) !important;
          }
        }

        @media
          (orientation: landscape)
          and (max-height: 430px) {

          .role-reveal-layout {
            --card-width:
              min(28vw, 155px);

            gap: clamp(
              14px,
              4vw,
              36px
            );
          }

          .role-reveal-details {
            gap: 7px;
          }

          .role-reveal-description {
            font-size: 6px !important;
            line-height: 1.6 !important;
          }

          .role-reveal-controls {
            gap: 8px !important;
          }
        }
      `}</style>

      <div
        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          overflow-hidden
          px-4
          py-3
        "
        style={{
          animation:
            "backdropIn 0.3s ease-out",
        }}
      >
        <div
          className="
            absolute
            inset-0
            bg-black/82
            backdrop-blur-xl
          "
        />

        {screenFlash && (
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              z-40
              bg-white
            "
            style={{
              animation:
                "flashIn 0.65s ease-out forwards",
            }}
          />
        )}

        <div className="role-reveal-layout relative z-10">
          <div className="role-reveal-label">
            {!isRevealed ? (
              <p
                className="
                  text-[8px]
                  tracking-[0.35em]
                  text-white
                  sm:text-[9px]
                "
                style={{
                  animation:
                    "blink 0.85s infinite",
                }}
              >
                ▸ REVEALING YOUR ROLE ◂
              </p>
            ) : (
              showText && (
                <p
                  className="
                    text-[8px]
                    tracking-[0.35em]
                    text-white
                    sm:text-[9px]
                  "
                  style={{
                    animation:
                      "fadeUp 0.5s ease-out both",
                  }}
                >
                  ★ ROLE ASSIGNED ★
                </p>
              )
            )}
          </div>

          <div className="role-reveal-card-stage">
            {isRevealed && (
              <>
                <div
                  className="
                    role-reveal-ring
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    rounded-2xl
                    border
                    border-[#d4d4d4]/60
                  "
                  style={{
                    animation:
                      "ringPulse 0.85s 0.05s ease-out forwards",
                  }}
                />

                <div
                  className="
                    role-reveal-ring
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    rounded-2xl
                    border
                    border-[#fbbf24]/30
                  "
                  style={{
                    animation:
                      "ringPulse 0.85s 0.28s ease-out forwards",
                  }}
                />
              </>
            )}

            <SparkleField
              trigger={sparkleTrigger}
            />

            <div
              className="role-reveal-card"
              style={{
                transition:
                  `transform ` +
                  `${HALF_FLIP}ms ` +
                  "ease-in-out",

                transform:
                  flipPhase === "hide"
                    ? "scaleX(0)"
                    : "scaleX(1)",

                animation:
                  isRevealed
                    ? "bounce 0.55s ease-out, glow 1.8s ease-out forwards"
                    : undefined,
              }}
            >
              {card.img ? (
                <img
                  src={card.img}
                  alt={
                    card.name ??
                    "Role Card"
                  }
                  className="
                    h-full
                    w-full
                    select-none
                    object-cover
                  "
                  draggable={false}
                />
              ) : (
                <div
                  className="
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    border-2
                    border-[#9bbc0f]
                    bg-[#0a0e1a]
                  "
                >
                  <span className="text-5xl text-[#9bbc0f]">
                    ?
                  </span>

                  <span className="text-[7px] text-[#9bbc0f]/50">
                    NO IMAGE
                  </span>
                </div>
              )}

              {isRevealed && (
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-2xl
                    border-4
                    border-[#d4d4d4]/65
                  "
                  style={{
                    boxShadow:
                      "inset 0 0 28px rgba(239, 68, 68, 0.14)",
                  }}
                />
              )}
            </div>
          </div>

          <div className="role-reveal-details">
            {showText && (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-2
                  text-center

                  landscape:items-start
                  landscape:text-left
                "
                style={{
                  animation:
                    "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
                }}
              >
                <p
                  className="
                    text-[7px]
                    tracking-[0.3em]
                    text-[#7dd3fc]/65
                    sm:text-[8px]
                  "
                >
                  YOU ARE THE
                </p>

                <p
                  className={`
                    text-[13px]
                    tracking-wider
                    sm:text-[14px]

                    ${
                      card.evil
                        ? "text-[#dc2626]"
                        : "text-[#a3e635]"
                    }
                  `}
                  style={{
                    textShadow:
                      "0 0 24px rgba(251,191,36,0.7)",
                  }}
                >
                  {card.name ?? "UNKNOWN"}
                </p>

                {card.description && (
                  <p
                    className="
                      role-reveal-description
                      mt-1
                      max-w-[230px]
                      text-center
                      text-[7px]
                      leading-loose
                      text-gray-400/80
                    "
                  >
                    {card.description}
                  </p>
                )}
              </div>
            )}

            {showControls && (
              <div
                className="
                  role-reveal-controls
                  flex
                  w-full
                  flex-col
                  items-center
                  gap-3
                "
                style={{
                  animation:
                    "fadeUp 0.4s 0.1s ease-out both",
                }}
              >
                <div
                  className="
                    flex
                    w-full
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      h-1.5
                      flex-1
                      overflow-hidden
                      bg-[#0f2544]
                    "
                  >
                    <div
                      className="
                        h-full
                        bg-[#bef264]
                      "
                      style={{
                        width:
                          `${timerPercentage}%`,

                        transition:
                          "width 1s linear",
                      }}
                    />
                  </div>

                  <span
                    className="
                      min-w-[24px]
                      text-right
                      text-[8px]
                      text-gray-500
                    "
                  >
                    {timeLeft}s
                  </span>
                </div>

                <Button
                  className="
                    w-full
                    border-none
                    bg-[#34d399]
                    py-2
                    text-xs
                  "
                  onClick={onClose}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}