import React, { useEffect, useState } from "react";

const SESSION_TEXT = {
  Discussion: "Discussion",
  Vote: "Voting",
  Night: "Night",
};

const CutScene = ({
  type = "discussion",
  day = 1,
  icon = null,
  duration = 3000,
  onFinish,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 50);

    // Fade out slightly before ending
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 500);

    // Notify parent to remove component
    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/70 backdrop-blur-md
        transition-opacity duration-500
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="flex flex-col items-center">

        <p className="mb-6 text-lg tracking-[0.5em] uppercase text-zinc-300">
          Day {day}
        </p>

        <div className="flex items-center gap-6">

          <h1 className="text-7xl font-bold text-white tracking-wider">
            {SESSION_TEXT[type]}
          </h1>

          <div className="w-24 h-24 border-2 border-dashed border-zinc-500 rounded-full flex items-center justify-center text-zinc-500">
            {icon ?? "ICON"}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CutScene;