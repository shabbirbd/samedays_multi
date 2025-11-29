"use client";

import React, { useState } from 'react';
import {
    Chart
} from '@highcharts/react';
import { usePlatformState } from '@/lib/PlatformStateProvider';
import LeftbarSkeleton from '@/components/misc/LeftbarSkeleton';
import InCircleButtonSkeleton from '@/components/misc/InCircleButtonSkeleton';
import InTitleSkeleton from '@/components/misc/InTitleSkeleton';
import InBigCircleButtonSkeleton from '@/components/misc/InBigCircleButtonSkeleton';
import MainLoaderAnimationIn from '@/components/misc/MainLoaderAnimationIn';

const page = () => {

    return (
        <div className='flex-1 h-full py-[8px] px-[8px] flex items-stretch duration-150 transition-all ease-out will-change-auto'>
            {/* right body */}
            <RightBody />
            {/* right body */}
        </div>
    )
};

export default page;


// helper components
const Leftbar = ({ leftOpen }) => {
    const [current, setCurrent] = useState(0);
    const { user } = usePlatformState();

    if (!user) {
        return <LeftbarSkeleton />
    }

    return (
        <div className={`h-full duration-150 transition-all ease-out will-change-auto relative ${leftOpen ? 'w-[230px] mr-[8px]' : 'w-[0px]'}`}>
            <div className={`w-full h-full absolute top-0 left-0 bottom-0 rounded-[16px] bg-in12 main_card_shadow overflow-hidden duration-150 transition-all ease-out will-change-auto flex flex-col justify-between ${leftOpen ? '' : '-translate-x-[100%]'}`}>
                {/* title */}
                <div className='w-full h-[64px] pl-[24px] pr-[16px] flex items-center justify-between gap-[8px] shrink-0'>
                    <h2 className='text-[20px] leading-[24px] tracking-[-0.02em] font-600 text-infa'>Reports</h2>
                    <button className='w-[32px] h-[32px] rounded-full bg-in2b hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] text-infa flex items-center justify-center duration-150 transition-all ease-out will-change-auto'>
                        {plusIcon}
                    </button>
                </div>
                {/* title */}

                {/* middle */}
                <div className='flex-1 w-full relative'>
                    <div className='absolute inset-0 w-full h-full overflow-y-auto no-scrollbar'>
                        <div className='w-full h-fit flex flex-col pt-[4px] pb-[32px] mb-[105px] px-[12px]'>
                            {leftButtonGroup.map((item, i) => (
                                <button key={i} className={`w-full h-[32px] px-[12px] rounded-[8px] flex items-center justify-between gap-[10px] text-infa duration-150 transition-all ease-out will-change-auto relative ${current === i ? 'bg-in1c left_bar_top_active_button_shadow z-[10]' : 'hover:bg-in39 z-[9]'}`} onClick={() => setCurrent(i)}>
                                    <p className='w-fit h-fit flex items-center gap-[10px]'>
                                        {item?.icon}
                                        <span className='text-[13px] leading-[18px] font-600'>{item?.title}</span>
                                    </p>
                                    <span className='text-[13px] leading-[18px] font-500 text-inc9'>{item?.value}</span>
                                </button>
                            ))}
                            <FavouriteBox />
                            <button className={`w-full h-[32px] px-[12px] rounded-[8px] flex items-center gap-[10px] text-infa duration-150 transition-all ease-out will-change-auto relative ${current === 3 ? 'bg-in1c left_bar_top_active_button_shadow z-[10]' : 'hover:bg-in39 z-[9]'}`} onClick={() => setCurrent(3)}>
                                {exportIcon}
                                <p className='text-[13px] leading-[18px] font-600'>Dataset export</p>
                            </button>
                        </div>
                    </div>
                </div>
                {/* middle */}

                {/* bottom */}
                {/* <div className='w-full h-[40px] pl-[4px] flex items-center border-t border-in37 shrink-0'>
                    <button className='h-[32px] w-fit px-[12px] rounded-full flex items-center hover:bg-in39 active:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] text-infa duration-150 transition-all ease-out will-change-auto gap-[5px]'>
                        {listIcon}
                        <p className='text-[14px] leading-[16px] font-600'>Manage</p>
                    </button>
                </div> */}
                {/* bottom */}
            </div>
        </div>
    )
};

const FavouriteBox = () => {
    const [open, setOpen] = useState(true);

    return (
        <div className='w-full h-fit flex flex-col'>
            <button className={`w-full h-[32px] px-[12px] rounded-[8px] flex items-center justify-between gap-[10px] text-infa duration-150 transition-all ease-out will-change-auto relative hover:bg-in39`} onClick={() => setOpen(!open)}>
                <p className='w-fit h-fit flex items-center gap-[10px]'>
                    {favouriteIcon}
                    <span className='text-[13px] leading-[18px] font-600'>Your favourites</span>
                </p>
                <span className={`w-[16px] h-[16px] flex items-center justify-center duration-150 transition-all ease-out will-change-auto ${open ? 'rotate-90' : ''}`}>
                    {chevronRightIcon}
                </span>
            </button>
            <div className={`w-full pl-[16px] overflow-hidden duration-150 transition-all flex items-center ease-out will-change-auto ${open ? 'h-[28px]' : 'h-[0px]'}`}>
                <p className='text-inc9 text-[13px] leading-[20px]'>No reports added</p>
            </div>
        </div>
    )
};

const RightBody = () => {
    const { user, setLeftOpen } = usePlatformState();

    return (
        <div className='w-full flex flex-col rounded-[16px] bg-in1c h-full main_card_shadow relative overflow-y-auto no-scrollbar transition-all ease-out will-change-auto duration-150' >
            {/* sticky top */}
            <div className='w-full h-fit sticky flex flex-col top-0 shrink-0 bg-in1c z-[99]'>
                {/* title bar */}
                <div className='w-full h-fit pt-[16px] px-[24px] ml-[-8px] flex items-center justify-between'>
                    {user ? (
                        <div className='w-fit h-fit flex items-center gap-[8px]'>
                            <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center text-infa duration-150 transition-all hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]' onClick={() => setLeftOpen((prev) => !prev)}>
                                {leftMenuIcon}
                            </button>
                            <h2 className='text-[20px] leading-[32px] font-600 text-infa tracking-[-0.02em]'>Overview</h2>
                        </div>
                    ) : (
                        <div className='w-fit h-fit flex items-center gap-[8px]'>
                            <InCircleButtonSkeleton />
                            <InTitleSkeleton />
                        </div>
                    )}
                    {user ? (
                        <div className='w-fit h-fit flex items-center gap-[4px]'>
                            <button className='w-fit h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] px-[12px]'>
                                {knowledgeIcon}
                                <p className='text-[14px] leading-[20px] tracking-normal font-600 ml-[3px]'>Learn</p>
                                {chevronDownIcon}
                            </button>
                            <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]'>
                                {likeIcon}
                            </button>
                        </div>
                    ) : (
                        <div className='w-fit h-fit flex items-center gap-[4px]'>
                            <InBigCircleButtonSkeleton />
                            <InCircleButtonSkeleton />
                        </div>
                    )}
                </div>
                {/* title bar */}
                {!user && (
                    <div className='w-full h-[1px] bg-in37 mt-[14px]' />
                )}
                {/* filter */}
                {user && (
                    <div className='w-full h-[53px] mt-[12px] border-t border-b border-in37 px-[24px] flex items-center justify-between'>
                        <div className='w-fit h-fit flex items-center gap-[4px]'>
                            <button className='w-fit h-[32px] px-[12px] flex items-center gap-[6px] rounded-full text-infa bg-in1c border border-in37 hover:bg-in2b active:border-in50 active:bg-in2b duration-150 transition-all ease-out will-change-auto'>
                                {calanderIcon}
                                <p className='font-500 text-[14px] leading-[20px]'>Aug 9, 2025 - Oct 31, 2025</p>
                            </button>
                            <button className='w-fit h-[30px] flex items-center gap-[5px] text-infa hover:text-inred duratino-150 transition-all ease-out will-change-auto'>
                                {plusIcon}
                                <p className='text-[14px] leading-[18px] font-500'>Add filter</p>
                            </button>
                        </div>
                        <button className='w-fit h-[30px] flex items-center gap-[3px] text-infa hover:text-inred duration-150 transition-all ease-out will-change-auto'>
                            {worldIconSmall}
                            <p className='text-[14px] leading-[18px] font-500 mr-[2px]'>Denver time (GMT-6)</p>
                            {arrowDownIcon}
                        </button>
                    </div>
                )}
                {/* filter */}
            </div>
            {/* sticky top */}

            {/* charts */}
            {user ? (
                <div className='w-full h-fit p-[16px] flex flex-col'>

                    {/* how you handling */}
                    <div className='w-full h-fit p-[10px]'>
                        <div className='w-full h-fit rounded-[8px] p-[20px] border border-in37 flex flex-col relative hover:border-in50 duration-150 transition-all ease-out will-change-auto group/svgmain'>
                            {/* banner */}
                            <div className='w-full h-[32px] flex items-center gap-[4px] text-infa'>
                                {infoIcon}
                                <p className='text-[14px] leading-[24px] font-600'>How you're handling conversations</p>
                            </div>
                            {/* banner */}
                            {/* svg */}
                            <div className='w-full h-fit relative'>
                                <TopSvgChart />
                                <div className='absolute top-[50%] left-[2.5%] w-fit h-fit flex flex-col'>
                                    <p className='text-[11px] leading-[16px] font-600 text-infa'>4 (100%)</p>
                                    <p className='text-[11px] leading-[16px] font-600 text-infa'>Conversations</p>
                                </div>
                                <div className='absolute top-[50%] left-[90.2%] w-fit h-fit flex flex-col'>
                                    <p className='text-[11px] leading-[16px] font-600 text-infa'>3 (75%)</p>
                                    <p className='text-[11px] leading-[16px] font-600 text-infa'>Teammate replied</p>
                                </div>
                            </div>
                            {/* svg */}
                            {/* pop menu */}
                            <div className='absolute right-[16px] top-[-16px] w-fit h-[32px] z-[9] hidden group-hover/svgmain:block'>
                                <button className='w-fit h-full rounded-[6px] px-[12px] bg-in1c flex items-center duration-150 transition-all ease-out will-change-auto gap-[5px] hover:bg-in39 active:bg-in39 text-infa dark:shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#0000008c] shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#14141426] active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]'>
                                    {stretchIcon}
                                    <p className='text-[14px] leading-[16px] font-600'>Drill-in</p>
                                    {arrowDownIcon}
                                </button>
                            </div>
                            {/* pop menu */}
                        </div>
                    </div>
                    {/* how you handling */}

                    {/* overall volume growth */}
                    <div className='w-full h-fit p-[10px]'>
                        <div className='w-full h-fit rounded-[8px] border border-in37 flex flex-col relative hover:border-in50 duration-150 transition-all will-change-auto ease-out group p-[20px]'>
                            {/* banner */}
                            <div className='w-full h-[32px] flex items-center gap-[4px] text-infa'>
                                {infoIcon}
                                <p className='text-[14px] leading-[24px] font-600'>Overall volume growth</p>
                            </div>
                            {/* banner */}
                            {/* chart */}
                            <VolumeChart />
                            {/* chart */}
                            {/* pop menu */}
                            <div className='absolute right-[16px] top-[-16px] w-fit h-[32px] z-[9] hidden group-hover:flex items-center gap-[4px]'>
                                <button className='w-fit h-full rounded-[6px] px-[12px] bg-in1c flex items-center duration-150 transition-all ease-out will-change-auto gap-[5px] hover:bg-in39 active:bg-in39 text-infa dark:shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#0000008c] shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#14141426] active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]'>
                                    {stretchIcon}
                                    <p className='text-[14px] leading-[16px] font-600'>Drill-in</p>
                                    {arrowDownIcon}
                                </button>
                                <button className='h-full aspect-square rounded-[6px] bg-in1c flex items-center justify-center duration-150 transition-all ease-out will-change-auto gap-[5px] hover:bg-in39 active:bg-in39 text-infa dark:shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#0000008c] shadow-[0_0_#0000,0_0_#0000,0px_4px_8px_0px_#14141426] active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]'>
                                    {ellipsisIcon}
                                </button>
                            </div>
                            {/* pop menu */}
                        </div>
                    </div>
                    {/* overall volume growth */}

                </div>
            ) : (
                <div className='w-full flex-1 flex flex-col items-center justify-center'>
                    <MainLoaderAnimationIn />
                </div>
            )}
            {/* charts */}
        </div>
    )
};

const TopSvgChart = () => {
    return (
        <svg version="1.1" className="highcharts-root" style={{ fontFamily: 'inherit', fontSize: '16px', width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1456 466" preserveAspectRatio="xMidYMid meet" role="img" aria-label="">
            <defs>
                <linearGradient x1="1" x2="0" y1="0" y2="0" id="highcharts-shmdlxm-8">
                    <stop offset="0" stopColor="var(--in-yellow-50)" stopOpacity="1"></stop>
                    <stop offset="1" stopColor="var(--in-slateblue-30)" stopOpacity="1"></stop>
                </linearGradient>
            </defs>
            <g data-z-index="3" filter="none">
                <g className="group" data-z-index="0.1" opacity="1" transform="translate(10,20) scale(1 1)" clipPath="url(#highcharts-shmdlxm-7-)">
                    <path fill="url(#highcharts-shmdlxm-8)" d="M 20 0 C 441.08000000000004 0 854.92 -0.25 1276 -0.25 L 1276 161.375 L 1276 323 C 854.92 323 441.08000000000004 323.25 20 323.25 Z" fillOpacity="1" filter="none" className="opacity-[20%] group-hover:opacity-[40%] duration-300 transition-all wll-change-auto ease-out"></path>
                    <path fill="var(--in-slateblue-30)" d="M 0 0 L 20 0 A 0 0 0 0 1 20 0 L 20 431 A 0 0 0 0 1 20 431 L 0 431 A 0 0 0 0 1 0 431 L 0 0 A 0 0 0 0 1 0 0 Z" display="" stroke="#ffffff" strokeWidth="0" opacity="1" filter="none" className="highcharts-node highcharts-point highcharts-color-0 highcharts-node"></path>
                    <path fill="var(--in-yellow-50)" d="M 1276 0 L 1296 0 A 0 0 0 0 1 1296 0 L 1296 323 A 0 0 0 0 1 1296 323 L 1276 323 A 0 0 0 0 1 1276 323 L 1276 0 A 0 0 0 0 1 1276 0 Z" display="" stroke="#ffffff" strokeWidth="0" opacity="1" filter="none" className="highcharts-node highcharts-point highcharts-color-1 highcharts-node"></path>
                </g>
            </g>
        </svg>
    )
};

const VolumeChart = () => {
    const categories = ['Aug 4', 'Aug 11', 'Aug 18', 'Aug 25', 'Sep 1', 'Sep 8', 'Sep 15', 'Sep 22', 'Sep 29', 'Oct 6', 'Oct 13', 'Oct 20', 'Oct 27'];

    // Comprehensive chart options object
    const chartOptions = {
        // Chart container and styling
        chart: {
            type: 'area' as const,
            backgroundColor: 'transparent',
            spacingTop: 10,
            spacingRight: 10,
            spacingBottom: 10,
            spacingLeft: 4,
            borderRadius: 8,
            height: 400,
            style: {
                fontFamily: 'inherit'
            }
        },

        // Tooltip
        tooltip: {
            backgroundColor: 'var(--inf2)',
            borderColor: '#0000000',
            borderRadius: 8,
            borderWidth: 0,
            shadow: {
                color: 'rgba(0, 0, 0, 0.1)',
                offsetX: 0,
                offsetY: 2,
                opacity: 0.5,
                width: 4
            },
            style: {
                fontSize: '12px',
                color: 'var(--in12)'
            },
            formatter: function () {
                const currentIndex = this.point.index;
                const currentCategory = categories[currentIndex];
                let dateRange = currentCategory;

                if (currentIndex < categories.length - 1) {
                    const nextCategory = categories[currentIndex + 1];
                    const parseDate = (dateStr: string, baseYear = 2024) => {
                        const months: { [key: string]: number } = {
                            'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                            'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                        };
                        const parts = dateStr.split(' ');
                        const month = months[parts[0]];
                        const day = parseInt(parts[1]);
                        return new Date(baseYear, month, day);
                    };

                    const formatDate = (date: Date) => {
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        return `${months[date.getMonth()]} ${date.getDate()}`;
                    };

                    try {
                        const nextDate = parseDate(nextCategory);
                        const endDate = new Date(nextDate);
                        endDate.setDate(endDate.getDate() - 1);
                        dateRange = `${currentCategory} - ${formatDate(endDate)}`;
                    } catch (e) {
                        dateRange = currentCategory;
                    }
                }

                return `<b>${this.y}</b><br/>(${dateRange})`;
            },
            shared: false,
            crosshairs: [
                {
                    width: 1,
                    color: 'var(--in-37)',
                    dashStyle: 'dash'
                },
                {
                    width: 1,
                    color: 'var(--in-37)',
                    dashStyle: 'dash'
                }
            ]
        },
        // tooltip

        // Legend
        legend: {
            enabled: true,
            align: 'center' as const,
            verticalAlign: 'bottom' as const,
            layout: 'horizontal' as const,
            itemStyle: {
                fontSize: '12px',
                color: 'var(--inc9)'
            },
            itemHoverStyle: {
                color: 'var(--infa)'
            },
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: 10,
            symbolRadius: 4,
            symbolPadding: 8
        },

        // X-Axis
        xAxis: {
            categories: categories,
            lineColor: 'var(--inc9)',
            lineWidth: 2,
            tickColor: 'var(--in37)',
            tickWidth: 0,
            tickLength: 0,
            labels: {
                style: {
                    fontSize: '12px',
                    color: 'var(--inc9)',
                    lineHeight: 'normal'
                },
                rotation: 0,
                align: 'center' as const
            },
            gridLineColor: 'transparent',
            gridLineWidth: 0,
            offset: 0,
            min: 0,
            max: categories.length - 1,
            minPadding: 0,
            maxPadding: 0,
        },

        // Y-Axis
        yAxis: {
            min: 0,
            max: 4, // Set max to highest value
            tickPositions: [0, 2, 4], // Show grid lines only at 0, 2, and 4
            lineColor: 'var(--inred)',
            lineWidth: 0,
            tickColor: 'var(--in37)',
            tickWidth: 1,
            tickLength: 8,
            labels: {
                style: {
                    fontSize: '12px',
                    color: 'var(--inc9)'
                },
                format: '{value}',
                align: 'right' as const
            },
            gridLineColor: 'var(--in37)',
            gridLineWidth: 2,
            gridLineDashStyle: 'Solid' as const,
            opposite: false,
            title: {
                text: ''
            }
        },

        // Plot Options - Global settings for all series
        plotOptions: {
            area: {
                lineWidth: 2,
                fillOpacity: 0.3,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    lineWidth: 2,
                    lineColor: null,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 6,
                            lineWidth: 3
                        }
                    }
                },
                states: {
                    hover: {
                        lineWidth: 3,
                        marker: {
                            radius: 6
                        }
                    }
                },
                dataLabels: {
                    enabled: false,
                    style: {
                        fontSize: '11px',
                        color: 'var(--infa)'
                    },
                    format: '{y}',
                    backgroundColor: 'transparent',
                    borderColor: 'none'
                },
                enableMouseTracking: true,
                animation: {
                    duration: 300
                },
                pointStart: 0,
                connectNulls: false,
                // color: 'var(--in-slateblue-30)',
                pointPlacement: 'on' as const
            },
        },

        // Series data
        series: [
            {
                name: 'All conversations',
                type: 'area' as const,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
                color: 'var(--in-chart-1)',
                lineWidth: 1,
                pointPlacement: 'on' as const,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    fillColor: null,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            radius: 6
                        }
                    }
                },
                dashStyle: 'solid' as const
            },
            {
                name: 'Fin AI agent',
                type: 'area' as const,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                color: 'var(--in-chart-2)',
                lineWidth: 1,
                pointPlacement: 'on' as const,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    fillColor: null,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            radius: 6
                        }
                    }
                },
                dashStyle: 'solid' as const
            },
            {
                name: 'Chatbot',
                type: 'area' as const,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                color: 'var(--in-chart-3)',
                lineWidth: 1,
                pointPlacement: 'on' as const,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    fillColor: null,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            radius: 6
                        }
                    }
                },
                dashStyle: 'solid' as const
            },
            {
                name: 'Teammate',
                type: 'area' as const,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
                color: 'var(--in-chart-4)',
                lineWidth: 1,
                pointPlacement: 'on' as const,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    fillColor: null,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            radius: 6
                        }
                    }
                },
                dashStyle: 'solid' as const
            },
            {
                name: 'No reply',
                type: 'area' as const,
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                color: 'var(--inc9)',
                lineWidth: 1,
                pointPlacement: 'on' as const,
                marker: {
                    enabled: true,
                    symbol: 'circle' as const,
                    radius: 4,
                    fillColor: null,
                    lineWidth: 1.5,
                    states: {
                        hover: {
                            radius: 6
                        }
                    }
                },
                dashStyle: 'solid' as const
            },
        ] as any,

        // Credits
        credits: {
            enabled: false
        },

        // Responsive options
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        labels: {
                            enabled: false
                        }
                    }
                }
            }]
        }
    };

    return (
        <div className='w-full h-fit relative'>
            <style>{`
                /* Remove area fill shade in legend, keep line and marker */
                .highcharts-legend-item path[fill]:not([stroke-width]) {
                    fill: transparent !important;
                }
            `}</style>
            <Chart options={chartOptions} />
        </div>
    )
};
// helper components

// constants
const buttonGroups = [
    {
        title: "Reports explained",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2C14.5 2 14.48 2 14.47 2C12.1 2.12 9.9 2.85 8 4.01C6.1 2.85 3.89 2.13 1.53 2.01C1.53 2.01 1.51 2.01 1.5 2.01C1.23 2.01 1 2.24 1 2.52V13.25C1 13.52 1.21 13.73 1.48 13.74C3.86 13.86 6.08 14.58 8 15.75C9.92 14.58 12.14 13.85 14.52 13.74C14.79 13.73 15 13.52 15 13.25V2.51C15 2.23 14.77 2 14.5 2ZM13.3 12.14C11.45 12.37 9.65 12.93 8 13.8V6.02L8.89 5.48C10.24 4.65 11.75 4.1 13.3 3.85V12.15V12.14Z"></path></svg>
    },
    {
        title: "Understand reporting datasets",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2C14.5 2 14.48 2 14.47 2C12.1 2.12 9.9 2.85 8 4.01C6.1 2.85 3.89 2.13 1.53 2.01C1.53 2.01 1.51 2.01 1.5 2.01C1.23 2.01 1 2.24 1 2.52V13.25C1 13.52 1.21 13.73 1.48 13.74C3.86 13.86 6.08 14.58 8 15.75C9.92 14.58 12.14 13.85 14.52 13.74C14.79 13.73 15 13.52 15 13.25V2.51C15 2.23 14.77 2 14.5 2ZM13.3 12.14C11.45 12.37 9.65 12.93 8 13.8V6.02L8.89 5.48C10.24 4.65 11.75 4.1 13.3 3.85V12.15V12.14Z"></path></svg>
    },
    {
        title: "Fin AI Agent reporting",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2C14.5 2 14.48 2 14.47 2C12.1 2.12 9.9 2.85 8 4.01C6.1 2.85 3.89 2.13 1.53 2.01C1.53 2.01 1.51 2.01 1.5 2.01C1.23 2.01 1 2.24 1 2.52V13.25C1 13.52 1.21 13.73 1.48 13.74C3.86 13.86 6.08 14.58 8 15.75C9.92 14.58 12.14 13.85 14.52 13.74C14.79 13.73 15 13.52 15 13.25V2.51C15 2.23 14.77 2 14.5 2ZM13.3 12.14C11.45 12.37 9.65 12.93 8 13.8V6.02L8.89 5.48C10.24 4.65 11.75 4.1 13.3 3.85V12.15V12.14Z"></path></svg>
    },
];

const leftButtonGroup = [
    {
        title: "Overview",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.3 2H9.7C9.31 2 9 2.32 9 2.7V6.3C9 6.69 9.31 7 9.7 7H13.3C13.68 7 14 6.68 14 6.3V2.7C14 2.31 13.68 2 13.3 2ZM6.3 2H2.7C2.31 2 2 2.32 2 2.7V6.3C2 6.69 2.31 7 2.7 7H6.3C6.68 7 7 6.68 7 6.3V2.7C7 2.31 6.68 2 6.3 2ZM13.3 9H9.7C9.31 9 9 9.32 9 9.7V13.3C9 13.69 9.31 14 9.7 14H13.3C13.68 14 14 13.68 14 13.3V9.7C14 9.31 13.68 9 13.3 9ZM6.3 9H2.7C2.31 9 2 9.32 2 9.7V13.3C2 13.69 2.31 14 2.7 14H6.3C6.68 14 7 13.68 7 13.3V9.7C7 9.31 6.68 9 6.3 9Z"></path></svg>,
        value: '',
    },
    {
        title: "All reports",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5 6H2V12H5V6ZM9.5 1H6.5V12H9.5V1ZM14 4H11V12H14V4ZM2 13.5V15H14V13.5H2Z"></path></svg>,
        value: '21'
    },
    {
        title: "Your reports",
        icon: <span className='w-[16px] h-[16px] flex items-center justify-center shrink-0 profile_icon rounded-full overflow-hidden' />,
        value: '0'
    }
];
// constants

// icons
const plusIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14 7.15H8.85V2H7.15V7.15H2V8.85H7.15V14H8.85V8.85H14V7.15Z"></path></svg>

const leftMenuIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 2H14C14.55 2 15 2.45 15 3V13C15 13.55 14.55 14 14 14H2C1.45 14 1 13.55 1 13V3C1 2.45 1.45 2 2 2ZM13.3 3.7H6V12.3H13.3V3.7Z"></path></svg>

const knowledgeIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2C14.5 2 14.48 2 14.47 2C12.1 2.12 9.9 2.85 8 4.01C6.1 2.85 3.89 2.13 1.53 2.01C1.53 2.01 1.51 2.01 1.5 2.01C1.23 2.01 1 2.24 1 2.52V13.25C1 13.52 1.21 13.73 1.48 13.74C3.86 13.86 6.08 14.58 8 15.75C9.92 14.58 12.14 13.85 14.52 13.74C14.79 13.73 15 13.52 15 13.25V2.51C15 2.23 14.77 2 14.5 2ZM13.3 12.14C11.45 12.37 9.65 12.93 8 13.8V6.02L8.89 5.48C10.24 4.65 11.75 4.1 13.3 3.85V12.15V12.14Z"></path></svg>

const chevronDownIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M6.79491 10.1807C7.18432 10.6065 7.81568 10.6064 8.20509 10.1807L11.2942 6.80291C11.7339 6.32211 11.4225 5.5 10.8006 5.5L4.1994 5.5C3.57755 5.5 3.26612 6.32211 3.70584 6.80291L6.79491 10.1807Z"></path></svg>

const likeIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.51 4.99981H8V1.9298C8.02 1.4398 7.71 0.999807 7.25 0.859807C6.65 0.669807 6.02 1.0498 5.89 1.6498C5.61 4.6898 3.67 7.2298 1 8.3998V13.9998H10.96C11.65 13.9998 12.29 13.6398 12.66 13.0598C14.23 10.5898 14.63 7.85981 14.73 6.29981C14.77 5.59981 14.22 4.99981 13.51 4.99981Z"></path></svg>

const xIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 3.95L12.05 2.75L8 6.8L3.95 2.75L2.75 3.95L6.8 8L2.75 12.05L3.95 13.25L8 9.2L12.05 13.25L13.25 12.05L9.2 8L13.25 3.95Z"></path></svg>

const listIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14 7.15H6V8.85H14V7.15ZM6 13H14V11.3H6V13ZM6 3V4.7H14V3H6ZM2.75 6.75C2.06 6.75 1.5 7.31 1.5 8C1.5 8.69 2.06 9.25 2.75 9.25C3.44 9.25 4 8.69 4 8C4 7.31 3.44 6.75 2.75 6.75ZM2.75 10.75C2.06 10.75 1.5 11.31 1.5 12C1.5 12.69 2.06 13.25 2.75 13.25C3.44 13.25 4 12.69 4 12C4 11.31 3.44 10.75 2.75 10.75ZM2.75 2.75C2.06 2.75 1.5 3.31 1.5 4C1.5 4.69 2.06 5.25 2.75 5.25C3.44 5.25 4 4.69 4 4C4 3.31 3.44 2.75 2.75 2.75Z"></path></svg>

const favouriteIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.97 8.37C14.61 7.7 15 6.8 15 5.8C15 3.73 13.32 2.05 11.25 2.05C9.85 2.05 8.64 2.83 8 3.96C7.36 2.82 6.15 2.05 4.75 2.05C2.68 2.05 1 3.73 1 5.8C1 6.8 1.4 7.7 2.03 8.37L7.48 14.42C7.76 14.73 8.24 14.73 8.52 14.42L13.97 8.37Z"></path></svg>

const chevronRightIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5.64906 3.89886C5.31711 4.23081 5.31711 4.769 5.64906 5.10094L8.54802 7.9999L5.64906 10.8989C5.31711 11.2308 5.31711 11.769 5.64906 12.1009C5.981 12.4329 6.51919 12.4329 6.85114 12.1009L10.3511 8.60094C10.6831 8.269 10.6831 7.73081 10.3511 7.39886L6.85114 3.89886C6.51919 3.56692 5.981 3.56692 5.64906 3.89886Z"></path></svg>

const exportIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M12.39 6.03999C12.11 3.85999 10.26 2.17 8 2.17C5.74 2.17 3.9 3.85999 3.61 6.03999C1.58 6.23999 0 7.92 0 10C0 12.08 1.61 13.79 3.65 13.97H12.34C14.38 13.79 15.99 12.1 15.99 10C15.99 7.9 14.4 6.23999 12.38 6.03999H12.39ZM11.1 8.49001L8 11.59L4.9 8.49001C4.57 8.16001 4.57 7.61999 4.9 7.28999C5.23 6.95999 5.77 6.95999 6.1 7.28999L8 9.19L9.9 7.28999C10.23 6.95999 10.77 6.95999 11.1 7.28999C11.43 7.61999 11.43 8.16001 11.1 8.49001Z"></path></svg>

const calanderIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15 5V3C15 2.45 14.55 2 14 2H13V0.75C13 0.34 12.66 0 12.25 0C11.84 0 11.5 0.34 11.5 0.75V2H4.5V0.75C4.5 0.34 4.16 0 3.75 0C3.34 0 3 0.34 3 0.75V2H2C1.45 2 1 2.45 1 3V5H15Z"></path><path d="M1 6.5V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V6.5H1Z"></path></svg>

const worldIconSmall = <svg fill='currentColor' width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6 11.3196C8.8995 11.3196 11.25 8.96908 11.25 6.06958C11.25 3.17009 8.8995 0.81958 6 0.81958C3.10051 0.81958 0.75 3.17009 0.75 6.06958C0.75 8.96908 3.10051 11.3196 6 11.3196ZM1.9917 5.5729C2.14918 4.28849 2.9097 3.19053 3.98141 2.57087L4.47782 2.84992C4.52422 2.87601 4.57328 2.89708 4.62415 2.91278L5.59126 3.21127C5.82553 3.28357 6.00967 3.46582 6.0844 3.69933L6.16563 3.95318C6.26867 4.27519 6.14353 4.62634 5.86005 4.81059L5.63101 4.95947C5.48348 5.05537 5.37436 5.20008 5.32274 5.36829L5.19192 5.79464C5.12983 5.99698 4.98514 6.16367 4.79354 6.25358L4.38547 6.44509C4.12221 6.56864 3.9541 6.83323 3.9541 7.12404V7.42672C3.9541 7.70202 4.10493 7.95519 4.34703 8.08626L4.42063 8.12611C4.79041 8.3263 4.92337 8.79132 4.71533 9.15673L4.36899 9.76506C3.30374 9.29425 2.4803 8.37637 2.13654 7.24929L2.29524 7.08743C2.54593 6.83176 2.58093 6.43455 2.37881 6.13898L1.9917 5.5729ZM10.0384 6.06947C10.0384 5.15599 9.7351 4.31335 9.22373 3.63675C8.90932 3.66935 8.61472 3.89105 8.5581 4.27286L8.42709 5.15631C8.40461 5.3079 8.33623 5.44896 8.23116 5.56052L7.60927 6.22078C7.3731 6.47153 7.33809 6.8509 7.52438 7.14063L8.34899 8.42314C8.37795 8.46818 8.41165 8.50999 8.44952 8.54785L8.63745 8.73578C8.71004 8.80837 8.79311 8.86262 8.88136 8.89905C9.597 8.17039 10.0384 7.17147 10.0384 6.06947Z"></path></svg>

const arrowDownIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.1011 5.64906C11.7692 5.31711 11.231 5.31711 10.8991 5.64906L8.0001 8.54802L5.10114 5.64906C4.76919 5.31711 4.231 5.31711 3.89906 5.64906C3.56711 5.981 3.56711 6.51919 3.89906 6.85114L7.39906 10.3511C7.731 10.6831 8.26919 10.6831 8.60114 10.3511L12.1011 6.85114C12.4331 6.51919 12.4331 5.981 12.1011 5.64906Z"></path></svg>

const infoIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM7.25 7.00488V12.0049H8.75V7.00488H7.25ZM9.10002 4.90488C9.10002 4.29737 8.60754 3.80488 8.00002 3.80488C7.39251 3.80488 6.90002 4.29737 6.90002 4.90488C6.90002 5.5124 7.39251 6.00488 8.00002 6.00488C8.60754 6.00488 9.10002 5.5124 9.10002 4.90488Z"></path></svg>

const stretchIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11.4 3.4C11.07 3.07 10.53 3.07 10.2 3.4C9.87 3.73 9.87 4.27001 10.2 4.60001L13.6 8L10.2 11.4C9.87 11.73 9.87 12.27 10.2 12.6C10.37 12.77 10.58 12.85 10.8 12.85C11.02 12.85 11.24 12.77 11.4 12.6L16 8L11.4 3.4ZM2.4 8L5.8 4.60001C6.13 4.27001 6.13 3.73 5.8 3.4C5.47 3.07 4.93 3.07 4.6 3.4L0 8L4.6 12.6C4.77 12.77 4.98 12.85 5.2 12.85C5.42 12.85 5.64 12.77 5.8 12.6C6.13 12.27 6.13 11.73 5.8 11.4L2.4 8ZM6.25 6.75C5.56 6.75 5 7.31 5 8C5 8.69 5.56 9.25 6.25 9.25C6.94 9.25 7.5 8.69 7.5 8C7.5 7.31 6.94 6.75 6.25 6.75ZM11 8C11 7.31 10.44 6.75 9.75 6.75C9.06 6.75 8.5 7.31 8.5 8C8.5 8.69 9.06 9.25 9.75 9.25C10.44 9.25 11 8.69 11 8Z"></path></svg>

const ellipsisIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3 6.5C2.17 6.5 1.5 7.17 1.5 8C1.5 8.83 2.17 9.5 3 9.5C3.83 9.5 4.5 8.83 4.5 8C4.5 7.17 3.83 6.5 3 6.5ZM8 6.5C7.17 6.5 6.5 7.17 6.5 8C6.5 8.83 7.17 9.5 8 9.5C8.83 9.5 9.5 8.83 9.5 8C9.5 7.17 8.83 6.5 8 6.5ZM13 6.5C12.17 6.5 11.5 7.17 11.5 8C11.5 8.83 12.17 9.5 13 9.5C13.83 9.5 14.5 8.83 14.5 8C14.5 7.17 13.83 6.5 13 6.5Z"></path></svg>
// icons



// {/* create report card */}
// {user && (
//     <div className='w-full h-fit px-[16px] pt-[16px]'>
//         <div className='w-full h-fit min-h-[228px] rounded-[12px] bg-in2b relative flex items-center justify-between'>
//             {/* x */}
//             <div className='absolute top-[24px] right-[24px] w-fit h-fit'>
//                 <button className='w-[16px] h-[17px] flex items-center jusitfy-center text-inc9 hover:text-infa duration-150'>
//                     {xIcon}
//                 </button>
//             </div>
//             {/* x */}
//             {/* text */}
//             <div className='flex-1 min-w-[580px] p-[48px] h-fit flex flex-col'>
//                 <h2 className='mb-[8px] font-600 text-[20px] leading-[32px] text-infa'>Create reports to improve your customer experience</h2>
//                 <p className='mb-[24px] text-infa text-[14px] leading-[20px] font-400'>Use customizable reports to track team performance, spot customer trends, and see how Fin, your AI Agent teammate, can resolve support volume automatically.</p>
//                 <div className='flex flex-wrap ml-[-12px]'>
//                     {buttonGroups?.map((item, i) => (
//                         <button key={i} className='w-fit h-[32px] px-[12px] mr-[16px] flex items-center gap-[4px] group text-infa hover:text-inblue duration-150'>
//                             {item?.icon}
//                             <p className='text-[14px] leading-[16px] font-600 group-hover:underline duration-150'>{item?.title}</p>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//             {/* text */}
//             {/* image */}
//             <div className='pl-[24px] pr-[56px] py-[24px]'>
//                 <img src="https://static.intercomassets.com/ember/assets/images/hero-banners/images/reports-overview-55aab1f9d87e98b38ae3d380a9b75c53.png" alt="contact_banner" className='w-[388px] h-[240px] align-middle' />
//             </div>
//             {/* image */}
//         </div>
//     </div>
// )}
// {/* create report card */}