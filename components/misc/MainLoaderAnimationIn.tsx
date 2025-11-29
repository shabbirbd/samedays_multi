"use client";

import React from 'react';

const MainLoaderAnimationIn = () => {
  return (
    <div className='w-fit h-fit flex flex-col text-center items-center justify-center gap-[20px]'>
        <div className='w-[52px] h-[52px] bg-inf2 rounded-[8px] flex items-center justify-center text-in1c p-[8px]'>
            <span className='w-full h-full shrink-0 animate-spin flex items-center justify-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </span>
        </div>
        <h2 className="text-[16px] font-600 text-infa whitespace-nowrap">Loading your data...</h2>
    </div>
  )
};

export default MainLoaderAnimationIn;