
import React from "react";
import AvatarIcon from '../../assets/avatar/avatar.png'
import FuzzyPanel from "../Stats/fuzzystats";

const Avatar = ({
    data,
    relation,
    clasName,
    top,
    left,
    showFuzzyPanel = false,
    onClick =() =>{}
}) => {



    return (
        <>
            <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => onClick(data)}
                style={{
                    top,
                    left
                }}>
                <img className="w-[6%] min-w-[40px]" src={AvatarIcon} alt="Player" />
                <span className="text-[10px] text-white max-w-[50px]">{data.name}</span>
                {
                    showFuzzyPanel && relation && 
                    (
                        <FuzzyPanel
                            suspicion={relation.suspicion}
                            voteErraticness={relation.voteErraticness}
                            previousLies={relation.previousLies}
                            aggression={relation.aggression}
                        />
                    )
                }
            </div>
        </>
    )
}

export default Avatar;