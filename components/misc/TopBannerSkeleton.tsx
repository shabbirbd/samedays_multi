"use client";

import React from 'react';
import InBigCircleButtonSkeleton from './InBigCircleButtonSkeleton';

const TopBannerSkeleton = () => {
  return (
    <div className='w-full h-[200px] rounded-[16px] bg-in1c main_card_shadow relative py-[20px] px-[24px] flex items-start justify-between'>
        {/* left */}
        <div className='flex-1 min-w-[420px] max-w-[640px] shrink-0 h-full flex flex-col justify-between'>
            <div className='w-full h-fit flex flex-col'>
                <div className='w-[80%] h-[20px] rounded-full bg-in2b animate-pulse mt-[2px] mb-[18px]' />
                <div className='w-full h-[14px] rounded-full bg-in2b animate-pulse mt-[3px] mb-[3px]' />
                <div className='w-[50%] h-[14px] rounded-full bg-in2b animate-pulse mt-[3px] mb-[3px]' />
            </div>
            <div className='w-fit flex gap-x-[4px] gap-y-[8px] mt-[16px]'>
                <InBigCircleButtonSkeleton/>
                <InBigCircleButtonSkeleton/>
                <InBigCircleButtonSkeleton/>
                <InBigCircleButtonSkeleton/>
            </div>
        </div>
        {/* left */}
        {/* right */}
        <div className='ml-[24px] shrink-0 h-full w-[388px] rounded-[12px] overflow-hidden bg-in2b animate-pulse '/>
        {/* right */}
    </div>
  )
};

export default TopBannerSkeleton;