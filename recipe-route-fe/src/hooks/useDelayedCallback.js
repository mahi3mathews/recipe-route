import { useEffect, useState } from "react";

const useDelayedCallback = (prevState, callback) => {
    useEffect(() => {
        if (prevState?.length > 0) {
            const timerId = setTimeout(callback, 500);
            return () => clearTimeout(timerId);
        }
    }, [prevState]);
};

export default useDelayedCallback;
