import { nightResultConfig } from "@/constant/result";

const NightResultModal = ({
    isOpen,
    event,
    players = [],
    current = 0,
    total = 1,
    onNext,
}) => {
    if (!isOpen || !event) {
        return null;
    }

    const target = players.find(
        (player) =>
            Number(player.id) ===
            Number(event.targetId)
    );

    const config =
        nightResultConfig[event.type];

    if (!config) {
        return null;
    }

    /*
     * Support both:
     *
     * title: () => "A Vision Appears"
     *
     * and:
     *
     * title: "A Vision Appears"
     */
    const title =
        typeof config.title === "function"
            ? config.title({
                  target,
                  event,
              })
            : config.title;

    const description =
        typeof config.description ===
        "function"
            ? config.description({
                  target,
                  event,
              })
            : config.description;

    const isLastResult =
        current + 1 >= total;

    return (
        <div
            className="
                fixed
                inset-0
                z-[999]
                h-screen
                w-screen
                overflow-hidden
            "
        >
            {/* Keep the current night scene visible */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/50
                    backdrop-blur-sm
                "
            />

            {/* Slightly darker edges for readability */}
            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.55)_100%)]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    grid
                    h-full
                    w-full
                    max-w-5xl
                    grid-cols-1
                    items-center
                    gap-5
                    px-6
                    py-5

                    landscape:grid-cols-[0.85fr_1.15fr]
                    landscape:gap-8

                    [@media(max-height:560px)]:grid-cols-[0.75fr_1.25fr]
                    [@media(max-height:560px)]:gap-5
                    [@media(max-height:560px)]:px-5
                    [@media(max-height:560px)]:py-3

                    [@media(max-height:430px)]:gap-4
                    [@media(max-height:430px)]:px-4
                    [@media(max-height:430px)]:py-2
                "
            >
                {/* Result image */}
                <div
                    className="
                        flex
                        min-h-0
                        items-center
                        justify-center
                    "
                >
                    <div
                        className="
                            relative
                            flex
                            h-[min(38vh,260px)]
                            w-[min(38vh,260px)]
                            items-center
                            justify-center

                            [@media(max-height:560px)]:h-[min(48vh,190px)]
                            [@media(max-height:560px)]:w-[min(48vh,190px)]

                            [@media(max-height:430px)]:h-[min(50vh,145px)]
                            [@media(max-height:430px)]:w-[min(50vh,145px)]
                        "
                    >
                        <div
                            className="
                                pointer-events-none
                                absolute
                                inset-[18%]
                                rounded-full
                                bg-white/10
                                blur-3xl
                            "
                        />

                        <img
                            src={config.image}
                            alt={
                                target
                                    ? `${target.name} night result`
                                    : "Night result"
                            }
                            draggable={false}
                            className="
                                relative
                                z-10
                                h-full
                                w-full
                                select-none
                                object-contain
                                drop-shadow-[0_18px_24px_rgba(0,0,0,0.75)]
                                [image-rendering:pixelated]
                            "
                        />
                    </div>
                </div>

                {/* Result information */}
                <div
                    className="
                        flex
                        min-h-0
                        flex-col
                        items-center
                        text-center

                        landscape:items-start
                        landscape:border-l
                        landscape:border-white/15
                        landscape:pl-8
                        landscape:text-left

                        [@media(max-height:560px)]:pl-5
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.35em]
                            text-stone-400

                            [@media(max-height:430px)]:text-[7px]
                        "
                    >
                        Night Result
                    </p>

                    <h1
                        className="
                            mt-2
                            max-w-xl
                            text-3xl
                            font-black
                            leading-tight
                            text-white

                            [@media(max-height:560px)]:mt-1
                            [@media(max-height:560px)]:text-2xl

                            [@media(max-height:430px)]:text-xl
                        "
                    >
                        {title}
                    </h1>

                    <div
                        className="
                            mt-4
                            h-px
                            w-14
                            bg-white/25

                            [@media(max-height:560px)]:mt-2
                        "
                    />

                    <p
                        className="
                            mt-4
                            max-w-xl
                            text-sm
                            leading-6
                            text-stone-300

                            [@media(max-height:560px)]:mt-3
                            [@media(max-height:560px)]:text-xs
                            [@media(max-height:560px)]:leading-5

                            [@media(max-height:430px)]:mt-2
                            [@media(max-height:430px)]:text-[10px]
                            [@media(max-height:430px)]:leading-4
                        "
                    >
                        {description}
                    </p>

                    {target && (
                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-2
                                border-l-2
                                border-white/20
                                pl-3

                                [@media(max-height:560px)]:mt-3
                            "
                        >
                            <span
                                className="
                                    text-[8px]
                                    uppercase
                                    tracking-wider
                                    text-stone-500
                                "
                            >
                                Target
                            </span>

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    text-white
                                "
                            >
                                {target.name}
                            </span>
                        </div>
                    )}

                    <div
                        className="
                            mt-6
                            flex
                            w-full
                            max-w-xl
                            items-center
                            justify-between
                            gap-5
                            border-t
                            border-white/15
                            pt-4

                            [@media(max-height:560px)]:mt-4
                            [@media(max-height:560px)]:pt-3

                            [@media(max-height:430px)]:mt-3
                            [@media(max-height:430px)]:pt-2
                        "
                    >
                        <span
                            className="
                                text-[9px]
                                font-bold
                                tracking-wider
                                text-stone-500
                            "
                        >
                            {current + 1} / {total}
                        </span>

                        <button
                            type="button"
                            onClick={onNext}
                            className="
                                min-w-[140px]
                                rounded-md
                                border
                                border-red-400/30
                                bg-red-700
                                px-5
                                py-2.5
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-white
                                transition

                                hover:bg-red-600
                                active:scale-95

                                [@media(max-height:500px)]:min-w-[120px]
                                [@media(max-height:500px)]:px-4
                                [@media(max-height:500px)]:py-2
                                [@media(max-height:500px)]:text-[9px]
                            "
                        >
                            {isLastResult
                                ? "Continue"
                                : "Next Result"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NightResultModal;