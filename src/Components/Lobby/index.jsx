import React, {useState} from "react";
import Button from "../Button";
import Avatar from '../../assets/character/silhouette.png'
import { Copy } from "lucide-react";
import { Toaster, toast } from "sonner";



const LobbyRoom = ({
  roomName = "Lobby Room",
  roomCode = "NP0198",
  players = [],
  maxPlayers = 8,
  onStart,
  onCancel,
}) => {

  const isFull = players.length === maxPlayers;
  const gridColsClass = {
        2: "md:grid-cols-1",
        4: "md:grid-cols-2",
        6: "md:grid-cols-3",
        8: "md:grid-cols-4",
    }[maxPlayers] || "md:grid-cols-4";

  const slots = Array.from({ length: maxPlayers }, (_, index) => {
    return players[index] || null;
  });

  const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast("Room code saved to clipboard", {
                className: "font-sans",
                style: {
                    background: "#18181b",
                    color: "white",
                    border: "1px solid #3f3f46",
                },
                position: 'bottom-right'
            });
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

  return (
    
    <div
    className="
        absolute inset-0
        flex items-center justify-center
        bg-black/40
        backdrop-blur-sm
        z-50
    "
    >
        <Toaster
            toastOptions={
                {
                    className: {
                        toast: "bg-[#404040]"
                    }
                }
            }/>
        <div
            className="
            w-[95%]
            h-[95vh]
            max-w-5xl
            overflow-y-auto
            flex
            flex-col
            justify-between
            rounded-3xl
            border-4 border-yellow-200/20
            bg-[#0f172acc]
            shadow-2xl
            p-6 md:p-8
            "
        >
            
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                {roomName}
                </h2>

                <p className="mt-2 text-xl text-white/80">
                {players.length} / {maxPlayers}
                {isFull && (
                    <span className="ml-2 text-lime-400 font-bold">
                    FULL
                    </span>
                )}
                </p>
                <div
                    className="py-2 px-4 w-[120px] flex items-center cursor-pointer gap-2 rounded-full text-white bg-[#171717] text-[11px]"
                    onClick={() => handleCopy(roomCode)}>
                    <span className="">
                        {roomCode} 
                    </span>
                    <Copy/>
                </div>

            </div>

            {/* Player Grid */}
            <div
                className={`
                grid
                gap-6
                mb-16
                grid-cols-2
                flex-1
                place-items-center
                ${gridColsClass}

                `}
            >
                {slots.map((player, index) => (
                <div
                    key={index}
                    className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-2
                    "
                >
                    {/* Avatar */}
                    <div
                        className="
                        w-20
                        h-20
                        md:w-32
                        md:h-32
                        flex items-center justify-center
                        float-animation
                        "
                    >
                        <img
                        src={Avatar}
                        alt="Player Avatar"
                        className="w-full h-full object-contain"
                        />
                    </div>

                    <span
                    className={`
                        font-semibold
                        ${
                        player
                            ? "text-white"
                            : "text-gray-400"
                        }
                    `}
                    >
                    {player?.name || "Unknown"}
                    </span>
                </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                disabled={!isFull}
                onClick={onStart}
                className={`
                    flex-1
                    ${
                    isFull
                        ? "bg-[#a3e635] hover:bg-[#1a2e05] hover:text-white border-[#ecfccb]"
                        : "bg-gray-500 border-gray-400 cursor-not-allowed"
                    }
                `}
                >
                Start Game
                </Button>

                <Button
                onClick={onCancel}
                className="
                    flex-1
                    bg-[#ef4444]
                    hover:bg-[#991b1b]
                    hover:text-white
                    border-[#fecaca]
                "
                >
                Cancel
                </Button>
            </div>
        </div>
    </div>
  );
};

export default LobbyRoom;