"use client";


import SettingsDialog from '@/components/dialogs/SettingsDialog';
import { usePlatformState } from '@/lib/PlatformStateProvider';
import { useThemeProvider } from '@/lib/ThemeProvider';
import { useToast } from '@/lib/toastContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

const layout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {

    return (
        <div className={`w-full h-dvh min-h-dvh max-h-dvh oveflow-hidden bg-in08 text-infa`}>
            <div className='w-full h-full flex overflow-hidden relative'>
                <LeftBarDynamic />
                {/* page */}
                {children}
                {/* page */}
            </div>
        </div>
    )
}

export default layout;


// helper components
const LeftBarDynamic = () => {
    const { theme } = useThemeProvider();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { user, leftOpen, chatHistory, currentChatId } = usePlatformState();
    const dragBarRef = useRef<HTMLDivElement>(null);
    const [sideWidth, setSideWidth] = useState(188);
    const [isDragging, setIsDragging] = useState(false);
    const [isDragHovered, setIsDragHovered] = useState(false);
    const startXRef = useRef(0);
    const startWidthRef = useRef(188);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const getInitialWidth = () => {
        if (typeof window === 'undefined') return 188;
        const stored = localStorage.getItem('copilotLeftWidth');
        if (stored) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed >= 188) {
                const maxWidth = Math.min(640, window.innerWidth);
                return Math.min(parsed, maxWidth);
            }
        }
        return 188;
    };

    useEffect(() => {
        setMounted(true);
        const initialWidth = getInitialWidth();
        setSideWidth(initialWidth);
        startWidthRef.current = initialWidth;
    }, []);

    useEffect(() => {
        if (mounted && typeof window !== 'undefined') {
            localStorage.setItem('copilotLeftWidth', sideWidth.toString());
        }
    }, [sideWidth, mounted]);

    const getMaxWidth = () => {
        if (typeof window === 'undefined') return Math.floor(0.45 * 640);
        return Math.floor(window.innerWidth * 0.45);
    };

    useEffect(() => {
        const handleMove = (clientX: number) => {
            if (!isDragging) return;

            const diff = clientX - startXRef.current;
            const maxWidth = getMaxWidth();
            const newWidth = Math.max(188, Math.min(maxWidth, startWidthRef.current + diff));
            setSideWidth(newWidth);
        };

        const handleMouseMove = (e: MouseEvent) => {
            handleMove(e.clientX);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                e.preventDefault();
                handleMove(e.touches[0].clientX);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        const handleTouchCancel = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
            document.addEventListener('touchcancel', handleTouchCancel);
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchCancel);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging]);

    useEffect(() => {
        const handleResize = () => {
            const maxWidth = getMaxWidth();
            setSideWidth(prevWidth => Math.min(prevWidth, maxWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        startXRef.current = e.clientX;
        startWidthRef.current = sideWidth;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length > 0) {
            setIsDragging(true);
            startXRef.current = e.touches[0].clientX;
            startWidthRef.current = sideWidth;
        }
    };

    if (!user) {
        return <LeftBarSkeleton />
    }

    return (
        <div
            className={`relative h-full py-[8px] shrink-0 transition-all duration-300 ease-in-out will-change-auto link ${leftOpen ? 'pl-[8px]' : ''}`}
            style={{
                width: leftOpen ? `${sideWidth + 8}px` : '0px',
                overflow: leftOpen ? 'visible' : 'hidden',
                transition: isDragging ? 'none' : 'width 150ms ease-in-out, padding 150ms ease-in-out'
            }}
        >
            {/* drag bar */}
            <div
                ref={dragBarRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onPointerEnter={() => setIsDragHovered(true)}
                onPointerLeave={() => setIsDragHovered(false)}
                className={`w-[8px] h-full group absolute flex justify-center left-[100%] top-0 bottom-0 py-[8px] ${leftOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                role="button"
                style={{
                    cursor: 'col-resize',
                    transition: 'opacity 150ms ease-in-out'
                }}
            >
                <div
                    className={`h-full w-[1px] duration-150 rounded-[4px] transition-all ease-out will-change-auto opacity-[70%] ${isDragging
                        ? 'bg-inred'
                        : isDragHovered
                            ? 'bg-inred'
                            : 'bg-transparent'
                        }`}
                />
            </div>
            {/* drag bar */}

            <div
                className={`z-[5000] overflow-hidden pt-[20px] h-full rounded-[16px]`}
                style={{
                    width: `${sideWidth}px`,
                    transition: isDragging ? 'none' : 'width 150ms ease-in-out'
                }}
            >
                <div className={`flex flex-col justify-between w-full h-full duration-150 transition-all ease-out will-change-auto ${leftOpen ? 'opacity-[100%]' : 'opacity-[0%]'}`}>
                    {/* top content */}
                    <div className='w-full flex-1 flex flex-col'>
                        <div className='mb-[16px] w-full h-fit flex items-center justify-between'>
                            <div className='ml-[2px] pb-[8px] px-[8px] pt-[4px] shrink-0'>
                                <img
                                    src={theme === 'dark' ? "/logos/same_fav.png" : "/logos/same_fav_black.png"}
                                    alt="same"
                                    className='w-[24px] h-[24px] mb-[2px] overflow-hidden object-contain'
                                />
                            </div>
                        </div>
                        <div className='w-full h-fit flex flex-col gap-[4px] mb-[24px]'>
                            {leftBarTopLinks1?.map((item, i) => {
                                const isActive = mounted && pathname === item?.link;
                                return (
                                    <Link href={item?.link} key={i} className='w-full h-[32px] px-[6px] flex items-center justify-center text-infa cursor-pointer' onClick={() => null}>
                                        <div className={`w-full h-full pl-[8px] relative rounded-[8px] flex items-center overflow-hidden transition-all will-change-auto duration-150 ${isActive ? 'left_bar_top_active_button_shadow bg-in1c z-[10]' : 'hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] z-[9]'}`}>
                                            <span className='w-[16px] h-[16px] flex items-center justify-center shrink-0'>
                                                {item?.icon}
                                            </span>
                                            <p className={`ml-[8px] text-[14px] leading-[20px] font-600 transition-all duration-150 whitespace-nowrap opacity-[100%]`}>{item?.title}</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        {/* chat history */}
                        <div className='w-full flex-1 flex flex-col gap-[4px]'>
                            <div className='w-full flex-1 relative'>
                                <div className='w-full h-full absolute inset-0 overflow-y-auto no-scrollbar'>
                                    <div className='w-full h-fit shrink-0 flex flex-col gap-[4px] px-[6px] py-[3px]'>
                                        {chatHistory?.filter((item) => item.responses.length > 0).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())?.map((item, i) => (
                                            <SingleConvBox key={i} data={item} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* chat history */}
                    </div>
                    {/* top content */}

                    {/* bottom content */}
                    <div className='w-full h-fit flex flex-col gap-[4px]'>
                        {/* settings */}
                        <div className='w-full h-[32px] px-[6px] flex items-center justify-center text-infa cursor-pointer mb-[8px]' onClick={() => setSettingsOpen(true)}>
                            <div className={`w-full h-full pl-[8px] relative rounded-[8px] flex items-center overflow-hidden transition-all will-change-auto duration-150 ${settingsOpen ? 'left_bar_top_active_button_shadow bg-in1c z-[10]' : 'hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] z-[9]'}`}>
                                <span className='w-[16px] h-[16px] flex items-center justify-center shrink-0'>
                                    {settingsIcon}
                                </span>
                                <p className={`ml-[8px] text-[14px] leading-[20px] font-600 transition-all duration-150 whitespace-nowrap opacity-[100%]`}>Settings</p>
                            </div>
                        </div>
                        {/* settingds */}
                    </div>
                    {/* bottom content */}
                </div>
            </div>

            {/* dialogs */}
            {settingsOpen && (
                <SettingsDialog open={settingsOpen} setOpen={setSettingsOpen} />
            )}
            {/* dialogs */}
        </div>
    )
};

const SingleConvBox = ({ data }) => {
    const { currentChatId, getChatHistory } = usePlatformState();
    const [menuOpen, setMenuOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const dropRef = useRef(null);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const inputRef = useRef(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const dialogRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (renameOpen && inputRef?.current) {
            inputRef?.current?.focus();
        }
    }, [inputRef, renameOpen]);

    useEffect(() => {
        if (data?.title?.length > 0) {
            setNewTitle(data?.title);
        }
    }, [data]);

    const handleShare = async () => {
        const shareData = {
            title: 'Conversation | Samedays.com',
            text: `${data?.title}`,
            url: `https://samedays.com/share?conversation=${data?._id}`,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                return
            }
        }
    };

    const handleBlur = async () => {
        if (loading) return;
        if (newTitle?.length < 1) {
            addToast("Title can't be empty", { type: 'error' });
            return
        }
        setLoading(true);
        const response = await fetch('/api/chatHistory', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ historyId: data?._id, newHistory: { ...data, title: newTitle } })
        });
        if (response.ok) {
            addToast('Title updated successfully', { type: "success" });
            getChatHistory();
            setLoading(false);
            setRenameOpen(false);
        } else {
            addToast('Failed to rename. Please try again later', { type: 'error' });
            setLoading(false);
            setRenameOpen(false);
        }
    };

    const handleDelete = async () => {
        if (loading) return;
        setLoading(true);
        const response = await fetch('/api/chatHistory', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ historyId: data?._id })
        });
        if (response.ok) {
            addToast('Chat deleted successfully', { type: 'success' });
            getChatHistory();
            if (currentChatId === data?._id) {
                history.replaceState(null, '', '/copilot')
            }
            setLoading(false);
            setDeleteOpen(false);
        } else {
            addToast('Failed to delete', { type: 'error' });
            setLoading(false);
        }
    };

    // outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropRef.current && !dropRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
            if (dialogRef.current && !dialogRef.current.contains(event.target) && !loading) {
                setDeleteOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loading]);
    // outside click

    return (
        <div
            className={`w-full h-[32px] rounded-[8px] px-[8px] flex items-center justify-between cursor-pointer group text-infa relative ${(menuOpen || renameOpen) ? 'left_bar_top_active_button_shadow bg-in1c z-[10]' : currentChatId === data?._id ? 'left_bar_top_active_button_shadow bg-in1c z-[10]' : 'hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] z-[9]'}`}
            onClick={() => {
                history.replaceState(null, '', `/copilot?conversation=${data._id}`);
            }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            {!renameOpen && (
                <p className='text-[14px] leading-[20px] whitespace-nowrap truncate'>{data?.title}</p>
            )}
            {renameOpen && (
                <input ref={inputRef} disabled={loading} type="text" className='w-full h-full bg-transparent text-[16px] md:text-[14px] font-normal text-infa' value={newTitle || ""} onBlur={() => handleBlur()} onChange={(e) => setNewTitle(e.target.value)} />
            )}
            {!renameOpen && (
                <div className='w-fit h-fit relative' onClick={(e) => e.stopPropagation()} >
                    <button className={`w-[32px] h-[32px] shrink-0 flex items-center justify-center duration-150 transition-all ease-out wil-change-auto text-inc9 ${menuOpen ? 'opacity-[100%]' : isHovered ? 'opacity-[100%]' : 'opacity-[0%] group-hover:opacity-[100%]'}`} onClick={() => setMenuOpen(true)} >
                        {ellipsisIcon}
                    </button>
                    {/* drop */}
                    {menuOpen && (
                        <div ref={dropRef} className='w-fit h-fit flex flex-col z-[999999] bg-in1c p-[8px] flex flex-col gap-[4px] rounded-[8px] in_dropdown_shadow absolute top-[calc(100%+4px)] right-0'>
                            <button className='w-full h-[32px] shrink-0 rounded-[7px] hover:bg-in2b active:bg-in39 px-[8px] flex items-center gap-[8px] text-inc9' onClick={() => handleShare()}>
                                {shareIcon}
                                <p className='text-[14px] leading-[20px] font-500 whitespace-nowrap'>Share chat</p>
                            </button>
                            <button className='w-full h-[32px] shrink-0 rounded-[7px] hover:bg-in2b active:bg-in39 px-[8px] flex items-center gap-[8px] text-inc9' onClick={() => { setRenameOpen(true); setMenuOpen(false) }}>
                                {renameIcon}
                                <p className='text-[14px] leading-[20px] font-500'>Rename</p>
                            </button>
                            <button className='w-full h-[32px] shrink-0 rounded-[7px] hover:bg-in2b active:bg-in39 px-[8px] flex items-center gap-[8px] text-inred' onClick={() => { setDeleteOpen(true); setMenuOpen(false) }}>
                                {deleteIcon}
                                <p className='text-[14px] leading-[20px] font-500'>Delete</p>
                            </button>
                        </div>
                    )}
                    {/* drop */}
                </div>
            )}
            {/* delete dialog */}
            {deleteOpen && (
                <div className='fixed w-screen h-screen inset-0 z-[99999999999999999] p-[32px] bg-[#0000004d] dark:bg-[#00000080] flex items-center justify-center' onClick={(e) => e.stopPropagation()}>
                    <div ref={dialogRef} className='w-full max-w-[400px] m-auto h-fit rounded-[16px] bg-in1c in_dialog_shadow relative overflow-hidden flex flex-col'>
                        {/* top */}
                        <div className='w-full h-[64px] shrink-0 flex items-center justify-between pl-[30px] pr-[20px]'>
                            <h3 className='text-[18px] leading-[24px] font-600 text-infa'>Delete chat</h3>
                            <button disabled={loading} className='w-[16px] h-[24px] flex items-center justify-center text-infa hover:text-inred duration-150 transition-all ease-out will-change-auto' onClick={() => setDeleteOpen(false)}>
                                {xIcon}
                            </button>
                        </div>
                        {/* top */}
                        {/* middle */}
                        <div className='w-full h-fit px-[30px] pb-[30px] pt-[10px] border-b border-in37'>
                            <p className='text-[14px] leading-[20px] font-400 text-infa whitespace-prewrap text-balance'>Are you sure you want to delete the conversation titled <span className='font-600'>"{data?.title}"</span>?</p>
                        </div>
                        {/* middle */}
                        {/* bottom */}
                        <div className='w-full h-fit p-[20px] flex items-center justify-end gap-[4px]'>
                            <button disabled={loading} className='w-fit h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] opacity-[0%] group-hover:opacity-[100%]' onClick={() => setDeleteOpen(false)}>
                                <p className='text-[14px] leading-[20px] tracking-normal font-600 ml-[3px] mr-[3px'>Cancel</p>
                            </button>
                            <button disabled={loading} className='w-[101px] h-[32px] px-[12px] rounded-full bg-inbuttonred text-in12 text-[14px] leading-[16px] hover:bg-inbuttonrdhover font-600 flex items-center justify-center duration-150 transiton-all will-change-auto' onClick={() => handleDelete()}>
                                {loading ? (
                                    <span className='w-fit h-fit flex items-center justify-center animate-spin'>
                                        {loaderIcon}
                                    </span>
                                ) : (
                                    <p className='text-[14px] leading-[16px] font-600'>Delete chat</p>
                                )}
                            </button>
                        </div>
                        {/* bottom */}
                    </div>
                </div>
            )}
            {/* delete dialog */}
        </div>
    )
};


const LeftBarSkeleton = () => {
    const [sideWidth, setSideWidth] = useState(188);

    const getInitialWidth = () => {
        if (typeof window === 'undefined') return 188;
        const stored = localStorage.getItem('copilotLeftWidth');
        if (stored) {
            const parsed = parseInt(stored, 10);
            if (!isNaN(parsed) && parsed >= 188) {
                const maxWidth = Math.min(640, window.innerWidth);
                return Math.min(parsed, maxWidth);
            }
        }
        return 188;
    };

    useEffect(() => {
        const initialWidth = getInitialWidth();
        setSideWidth(initialWidth);
    }, []);

    return (
        <div className={`relative w-fit h-full py-[8px] shrink-0 top-0 left-0 duration-150 transition-all ease-out will-change-auto pl-[8px]`}>
            {/* drag bar */}

            {/* drag bar */}
            <div className='pt-[20px] h-full rounded-[16px] duration-150 transition-all ease-out will-change-auto' style={{ width: `${sideWidth}px` }}>
                <div className='flex flex-col justify-between h-full w-full'>
                    {/* top content */}
                    <div className='w-full h-fit flex flex-col'>
                        <div className='mb-[16px] w-full h-fit flex items-center justify-between'>
                            <div className='ml-[2px] pb-[8px] px-[8px] pt-[4px] shrink-0'>
                                <div className='w-[24px] h-[24px] shrink-0 rounded-[8px] mb-[2px] bg-in2b animate-pulse' />
                            </div>
                        </div>
                        <div className='w-full h-fit flex flex-col gap-[4px] mb-[32px]'>
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className='w-full h-[32px] px-[6px] flex items-center justify-center' >
                                    <div className='w-full h-full pl-[8px] relative rounded-[8px] flex items-center gap-[8px] overflow-hidden'>
                                        <div className='w-[16px] h-[16px] rounded-[4px] shrink-0 bg-in2b animate-pulse' />
                                        <div className='w-[100px] h-[14px] rounded-full shrink-0 bg-in2b animate-pulse' />
                                    </div>
                                </div>
                            ))}
                            <div className='w-full h-[32px] px-[6px] flex items-center justify-center mt-[32px]' >
                                <div className='w-full h-full pl-[8px] relative rounded-[8px] flex items-center gap-[8px] overflow-hidden'>
                                    <div className='w-[16px] h-[16px] rounded-[4px] shrink-0 bg-in2b animate-pulse' />
                                    <div className='w-[100px] h-[14px] rounded-full shrink-0 bg-in2b animate-pulse' />
                                </div>
                            </div>
                        </div>

                        {/* chat history skeleton */}
                        <div className='w-full flex-1 flex flex-col px-[6px] gap-[4px]'>
                            <div className='w-[80px] h-[14px] rounded-full bg-in2b animate-pulse' />
                            <div className='w-full flex-1 flex flex-col gap-[4px]'>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className='w-full h-[32px] rounded-[8px] px-[8px] flex items-center gap-[8px] animate-pulse'>
                                        <div className='w-full h-[14px] rounded-full bg-in2b' />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* top content */}
                    {/* bottom content */}
                    <div className='w-full h-fit flex flex-col gap-[4px]'>
                        <div className='w-full h-[32px] px-[6px] flex items-center justify-center mb-[8px]' >
                            <div className='w-full h-full pl-[8px] relative rounded-[8px] flex items-center overflow-hidden gap-[8px]'>
                                <div className='w-[16px] h-[16px] rounded-[4px] shrink-0 bg-in2b animate-pulse' />
                                <div className='w-[100px] h-[14px] rounded-full shrink-0 bg-in2b animate-pulse' />
                            </div>
                        </div>
                    </div>
                    {/* bottom content */}
                </div>
            </div>
        </div>
    )
};
// helper components

// constants
const leftBarTopLinks1 = [
    {
        title: "Copilot",
        link: '/copilot',
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13 1H3C2.45 1 2 1.45 2 2V11C2 11.55 2.45 12 3 12H10.25L13.14 14.89C13.46 15.2 13.99 14.98 13.99 14.54V11V2C13.99 1.45 13.54 1 12.99 1H13ZM11.55 7.85C10.56 8.68 9.3 9.14 8 9.14C6.7 9.14 5.45 8.68 4.45 7.85C4.09 7.55 4.04 7.01 4.34 6.65C4.64 6.29 5.17999 6.24 5.53999 6.54C6.91999 7.69 9.08 7.69 10.45 6.54C10.81 6.24 11.35 6.28 11.65 6.65C11.95 7.01 11.9 7.55 11.54 7.85H11.55Z"></path></svg>
    },
    // {
    //     title: "Knowledge",
    //     link: '/knowledge',
    //     icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 2C14.5 2 14.48 2 14.47 2C12.1 2.12 9.9 2.85 8 4.01C6.1 2.85 3.89 2.13 1.53 2.01C1.53 2.01 1.51 2.01 1.5 2.01C1.23 2.01 1 2.24 1 2.52V13.25C1 13.52 1.21 13.73 1.48 13.74C3.86 13.86 6.08 14.58 8 15.75C9.92 14.58 12.14 13.85 14.52 13.74C14.79 13.73 15 13.52 15 13.25V2.51C15 2.23 14.77 2 14.5 2ZM13.3 12.14C11.45 12.37 9.65 12.93 8 13.8V6.02L8.89 5.48C10.24 4.65 11.75 4.1 13.3 3.85V12.15V12.14Z"></path></svg>
    // },
    {
        title: "Reports",
        link: '/reports',
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5 6H2V12H5V6ZM9.5 1H6.5V12H9.5V1ZM14 4H11V12H14V4ZM2 13.5V15H14V13.5H2Z"></path></svg>
    }
];
// constants

// icons
const settingsIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M14.9 8.49001L14.11 8.06C13.24 7.58 12.98 6.45001 13.56 5.63L14.08 4.89999C14.21 4.70999 14.21 4.46 14.06 4.28L13.15 3.14C13.01 2.96 12.76 2.9 12.55 2.98L11.72 3.32001C10.8 3.70001 9.74997 3.20001 9.47997 2.24001L9.22997 1.38C9.16997 1.16 8.95997 1.00999 8.72997 1.00999H7.26997C7.03997 1.00999 6.83997 1.16 6.76997 1.38L6.51997 2.24001C6.23997 3.20001 5.19997 3.70001 4.27997 3.32001L3.44997 2.98C3.23997 2.89 2.98997 2.95 2.84997 3.14L1.93997 4.28C1.79997 4.46 1.78997 4.70999 1.91997 4.89999L2.43997 5.63C3.01997 6.44 2.75997 7.58 1.88997 8.06L1.09997 8.49001C0.89997 8.60001 0.78997 8.83 0.84997 9.06L1.17997 10.49C1.22997 10.71 1.42997 10.88 1.65997 10.89L2.55997 10.94C3.54997 11 4.27997 11.9 4.10997 12.89L3.95997 13.78C3.91997 14.01 4.03997 14.23 4.24997 14.33L5.56997 14.96C5.77997 15.06 6.02997 15.01 6.17997 14.84L6.77997 14.17C7.43997 13.43 8.60997 13.43 9.26997 14.17L9.86997 14.84C10.02 15.01 10.27 15.06 10.48 14.96L11.8 14.33C12.01 14.23 12.12 14 12.09 13.78L11.94 12.89C11.77 11.91 12.5 11 13.49 10.94L14.39 10.89C14.62 10.88 14.81 10.71 14.87 10.49L15.2 9.06C15.25 8.84 15.15 8.60001 14.95 8.49001H14.9ZM7.99997 10.85C6.51997 10.85 5.31997 9.65 5.31997 8.17C5.31997 6.69 6.51997 5.49001 7.99997 5.49001C9.47997 5.49001 10.68 6.69 10.68 8.17C10.68 9.65 9.47997 10.85 7.99997 10.85Z"></path></svg>

const trainIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.9315 13.2594L11.0011 8.22519V2H5.00046V8.21518L1.07005 13.2494C0.880032 13.5796 1.12006 14 1.5001 14H14.5014C14.8915 14 15.1315 13.5796 14.9315 13.2494V13.2594ZM6.70064 3.70142H9.30091V6.04337V8.80567L10.281 10.0567H5.72054L6.70064 8.80567V6.04337V3.70142Z"></path></svg>

const ellipsisIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 8C4.5 8.82843 3.82843 9.5 3 9.5C2.17157 9.5 1.5 8.82843 1.5 8C1.5 7.17157 2.17157 6.5 3 6.5C3.82843 6.5 4.5 7.17157 4.5 8Z"></path><path d="M9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8Z"></path><path d="M14.5 8C14.5 8.82843 13.8284 9.5 13 9.5C12.1716 9.5 11.5 8.82843 11.5 8C11.5 7.17157 12.1716 6.5 13 6.5C13.8284 6.5 14.5 7.17157 14.5 8Z"></path></svg>

const shareIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11 6V7.7H12.3V13.3H3.7V7.7H5V6H3.5C2.67 6 2 6.67 2 7.5V13.5C2 14.33 2.67 15 3.5 15H12.5C13.33 15 14 14.33 14 13.5V7.5C14 6.67 13.33 6 12.5 6H11ZM5.6 4.87L7.15 3.32V9H8.85V3.32L10.4 4.87C10.57 5.04 10.78 5.12 11 5.12C11.22 5.12 11.44 5.04 11.6 4.87C11.93 4.54 11.93 4 11.6 3.67L8 0.0699997L4.4 3.67C4.07 4 4.07 4.54 4.4 4.87C4.73 5.2 5.27 5.2 5.6 4.87Z"></path></svg>

const renameIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.13004 14H15V12.5H8.63004L7.13004 14ZM14.87 3.44L11.79 0.360001C11.69 0.260001 11.56 0.210007 11.44 0.210007C11.32 0.210007 11.18 0.260001 11.09 0.360001L2.73004 8.72C2.33004 9.12 2.04004 9.62999 1.89004 10.18L1.01004 13.45C0.900035 13.87 1.22004 14.26 1.63004 14.26C1.68004 14.26 1.74004 14.26 1.80004 14.24L5.07004 13.36C5.62004 13.21 6.12004 12.92 6.53004 12.52L14.89 4.16C15.09 3.96 15.09 3.65 14.89 3.45L14.87 3.44ZM5.45004 11.44C5.23004 11.66 4.96004 11.81 4.67004 11.89L2.84004 12.38L3.33004 10.55C3.41004 10.25 3.57004 9.98 3.78004 9.77L4.63004 8.92L6.30004 10.59L5.45004 11.44Z"></path></svg>

const deleteIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" role="img" focusable="false"><path d="M11.02 3L10.78 1.64999C10.61 0.689994 9.78 0 8.81 0H7.19C6.22 0 5.39 0.699994 5.22 1.64999L4.98 3H1V4.5H2.2L3.73 13.17C3.81 13.65 4.23 14 4.71 14H11.28C11.77 14 12.18 13.65 12.26 13.17L13.79 4.5H14.99V3H11.01H11.02ZM5.13 12.5L3.72 4.5H5.45L6.86 12.5H5.13ZM6.51 3L6.7 1.91C6.74 1.67 6.95 1.5 7.19 1.5H8.81C9.05 1.5 9.26 1.67 9.3 1.91L9.49 3H6.5H6.51Z"></path></svg>

const xIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 3.95L12.05 2.75L8 6.8L3.95 2.75L2.75 3.95L6.8 8L2.75 12.05L3.95 13.25L8 9.2L12.05 13.25L13.25 12.05L9.2 8L13.25 3.95Z"></path></svg>

const loaderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
// icons