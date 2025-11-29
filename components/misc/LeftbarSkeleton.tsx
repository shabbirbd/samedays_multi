"use client";

import React from 'react';

const LeftbarSkeleton = () => {
    return (
        <div className='h-full relative mr-[8px] w-[230px]'>
            <div className='w-full h-full absolute top-0 left-0 bottom-0 rounded-[16px] bg-in12 main_card_shadow overflow-hidden flex flex-col'>
                <div className='pl-[24px] pr-[16px] h-[64px] flex items-center justify-start'>
                    <div className='h-[20px] w-[130px] rounded-full bg-in2b animate-pulse' />
                </div>
                <div className='w-full flex-1 relative'>
                    <div className='w-full h-full absolute inset-0 overflow-y-auto no-scrollbar'>
                        <div className='w-full h-fit mb-[105px] px-[12px] pt-[4px] pb-[32px] flex flex-col'>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className='w-full h-[32px] px-[12px] rounded-[8px] flex items-center gap-[6px] shrink-0' >
                                    <div className='w-[16px] h-[16px] rounded-full bg-in2b animate-pulse' />
                                    <div className='h-[13px] w-[110px] rounded-full bg-in2b animate-pulse' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LeftbarSkeleton;