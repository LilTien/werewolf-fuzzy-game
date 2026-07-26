import {
    useEffect,
    useState,
} from "react";

const LandscapeGuard = () => {
    const [
        shouldBlock,
        setShouldBlock,
    ] = useState(false);

    useEffect(() => {
        const portraitQuery =
            window.matchMedia(
                "(orientation: portrait)"
            );

        const coarsePointerQuery =
            window.matchMedia(
                "(pointer: coarse)"
            );

        const updateOrientation = () => {
            const isPortrait =
                portraitQuery.matches ||
                window.innerHeight >
                    window.innerWidth;

            /*
             * Detect phones and touch devices.
             *
             * The size check prevents the overlay
             * from appearing on normal desktop screens.
             */
            const isTouchDevice =
                coarsePointerQuery.matches ||
                navigator.maxTouchPoints > 0;

            const isMobileSize =
                Math.min(
                    window.innerWidth,
                    window.innerHeight
                ) <= 900;

            setShouldBlock(
                isPortrait &&
                    isTouchDevice &&
                    isMobileSize
            );
        };

        updateOrientation();

        window.addEventListener(
            "resize",
            updateOrientation
        );

        window.addEventListener(
            "orientationchange",
            updateOrientation
        );

        portraitQuery.addEventListener?.(
            "change",
            updateOrientation
        );

        coarsePointerQuery.addEventListener?.(
            "change",
            updateOrientation
        );

        return () => {
            window.removeEventListener(
                "resize",
                updateOrientation
            );

            window.removeEventListener(
                "orientationchange",
                updateOrientation
            );

            portraitQuery.removeEventListener?.(
                "change",
                updateOrientation
            );

            coarsePointerQuery.removeEventListener?.(
                "change",
                updateOrientation
            );
        };
    }, []);

    /*
     * Prevent the page behind the overlay
     * from scrolling while portrait is blocked.
     */
    useEffect(() => {
        if (!shouldBlock) return;

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [shouldBlock]);

    if (!shouldBlock) {
        return null;
    }

    return (
        <>
            <style>{`
                @keyframes rotateDevice {
                    0%, 20% {
                        transform: rotate(0deg);
                    }

                    65%, 90% {
                        transform: rotate(90deg);
                    }

                    100% {
                        transform: rotate(90deg);
                    }
                }

                @keyframes orientationPulse {
                    0%, 100% {
                        opacity: 0.35;
                    }

                    50% {
                        opacity: 1;
                    }
                }
            `}</style>

            <div
                role="dialog"
                aria-modal="true"
                aria-label="Rotate device"
                className="
                    fixed
                    inset-0
                    z-[99999]
                    flex
                    h-screen
                    w-screen
                    items-center
                    justify-center
                    overflow-hidden
                    bg-black/85
                    px-6
                    backdrop-blur-md
                "
            >
                <div
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,rgba(120,53,15,0.18),transparent_55%)]
                    "
                />

                <div
                    className="
                        relative
                        z-10
                        flex
                        max-w-sm
                        flex-col
                        items-center
                        text-center
                    "
                >
                    {/* Animated phone */}
                    <div
                        className="
                            relative
                            flex
                            h-24
                            w-14
                            items-center
                            justify-center
                            rounded-xl
                            border-2
                            border-stone-300
                            bg-stone-900
                            shadow-[0_0_30px_rgba(255,255,255,0.12)]
                        "
                        style={{
                            animation:
                                "rotateDevice 2.4s ease-in-out infinite",
                        }}
                    >
                        <div
                            className="
                                absolute
                                left-1/2
                                top-1.5
                                h-1
                                w-4
                                -translate-x-1/2
                                rounded-full
                                bg-stone-500
                            "
                        />

                        <div
                            className="
                                h-[70%]
                                w-[76%]
                                rounded-md
                                border
                                border-stone-700
                                bg-black
                            "
                        />

                        <div
                            className="
                                absolute
                                bottom-1.5
                                left-1/2
                                h-1.5
                                w-1.5
                                -translate-x-1/2
                                rounded-full
                                bg-stone-500
                            "
                        />
                    </div>

                    <p
                        className="
                            mt-8
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.4em]
                            text-amber-400
                        "
                    >
                        Landscape required
                    </p>

                    <h1
                        className="
                            mt-3
                            text-2xl
                            font-black
                            uppercase
                            tracking-wide
                            text-white
                        "
                    >
                        Rotate Your Device
                    </h1>

                    <p
                        className="
                            mt-3
                            max-w-xs
                            text-xs
                            leading-5
                            text-stone-400
                        "
                    >
                        This game is designed for
                        landscape mode. Turn your
                        phone sideways to continue.
                    </p>

                    <div
                        className="
                            mt-7
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-amber-400
                            "
                            style={{
                                animation:
                                    "orientationPulse 1s ease-in-out infinite",
                            }}
                        />

                        <span
                            className="
                                text-[8px]
                                uppercase
                                tracking-[0.22em]
                                text-stone-500
                            "
                        >
                            Waiting for landscape
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandscapeGuard;