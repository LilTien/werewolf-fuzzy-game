
import React from "react";
import AvatarIcon from '../../assets/avatar/avatar.png'
import GraveIcon from '../../assets/avatar/grave.png'
import FuzzyPanel from "../Stats/fuzzystats";

const Avatar = ({
    data,
    relation,
    clasName,
    isAlive = true,
    top,
    left,
    showFuzzyPanel = false,
    onClick = () => {}
}) => {
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer w-[6%] min-w-[40px] flex flex-col items-center"
            style={{ top, left }}
        >
            <img
                className="w-full"
                src={data.alive ? AvatarIcon : GraveIcon}
                alt="Player"
                onClick={() => onClick(data)}
            />
            <span className="text-[10px] text-white w-full text-center truncate">
                {data.name}
            </span>

            {showFuzzyPanel && relation && (
                <FuzzyPanel
                    suspicion={relation.suspicion}
                    voteErraticness={relation.voteErraticness}
                    previousLies={relation.previousLies}
                    aggression={relation.aggression}
                />
            )}
        </div>
    );
};

export default Avatar;