import React, { useState, useEffect } from 'react'

function Time({ itemClicked, funcTimeFive }) {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(20 * 60);
    const [TimeFive, setTimeFive] = useState(false)
    const [percentLeft, setPercentLeft] = useState(100);


    // Time configuration
    useEffect(() => {
        let intervalId;
        if (isActive && time > 0) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
                setPercentLeft((prevPercent) => prevPercent - (100 / 1200));
            }, 1000);
        } else if (!TimeFive && time === 0) {
            setTime(5 * 60)
            setPercentLeft(100)
            setTimeFive(true)
            funcTimeFive(true)
        } else if (TimeFive && time === 0) {
            setTime(20 * 60)
            setPercentLeft(100)
            setTimeFive(false)
            funcTimeFive(false)
        }
        return () => clearInterval(intervalId);
    }, [isActive, time, TimeFive, funcTimeFive]);

    const startCountdown = () => setIsActive(true);
    const stopCountdown = () => setIsActive(false);
    const resetCountdown = () => {
        setIsActive(false);
        setTimeFive(false)
        setTime(20 * 60);
        setPercentLeft(100)
    };

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;


    return (
        <div className='flex flex-col mt-10 justify-center items-center'>


            <div className='flex flex-row'>
                <i className={`ri-restart-fill text-lg mt-20 ${TimeFive ? 'hover:text-green-500' : 'hover:text-red-500'}`} onClick={resetCountdown} ></i>
                <div className='mt-6 mr-3' >
                    {isActive ? <i onClick={stopCountdown} className={`ri-pause-circle-fill text-8xl ${TimeFive ? 'text-green-500' : 'text-red-500'} `}></i> : <i className={`ri-play-circle-fill text-8xl  ${TimeFive ? 'text-green-500' : 'text-red-500'}`} onClick={startCountdown}></i>}
                </div >
                <div className='flex flex-col' >
                    <div style={{ height: '25px', width: '240px' }} className='rounded-full bg-regal-white ml-9 mb-2 ' >
                        <div style={{ height: '100%', width: `${percentLeft}%` }} className={`${TimeFive ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                    </div>
                    <h2 className={`text-8xl ${TimeFive ? 'text-green-500' : 'text-black'}`} >{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</h2>
                </div>
            </div>
            {itemClicked ? <h2 className={`  ${TimeFive ? 'text-green-500' : 'text-red-500'} text-2xl ml-96 `}>{itemClicked}</h2> : ''}
        </div>
    )
}

export default Time