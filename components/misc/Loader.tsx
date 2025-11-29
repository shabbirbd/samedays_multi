"use client"

import React from 'react'

const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-sm bg-op20 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-[28px] h-[28px] z-[50]  rounded-full bg-gradient-to-r from-op20 via-[35%] via-op20 to-transparent animate-spin"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="z-[40] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-opf7"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
        </div>
    </div>
  )
};

export default Loader;