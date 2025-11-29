"use client";

import RealtimeHandler from '@/components/inbox/RealtimeHandler';
import InCircleButtonSkeleton from '@/components/misc/InCircleButtonSkeleton';
import InTitleSkeleton from '@/components/misc/InTitleSkeleton';
import MainLoaderAnimationIn from '@/components/misc/MainLoaderAnimationIn';
import { usePlatformState } from '@/lib/PlatformStateProvider';
import { useRealtimeState } from '@/lib/RealtimeStateContext';
import React, { useEffect, useRef, useState } from 'react';

const page = () => {
    const [rightOpen, setRightOpen] = useState(true);


    return (
        <div className={`flex-1 h-full py-[8px] px-[8px] flex gap-[8px] duration-150 transition-all ease-out will-change-auto link`}>
            <BodyRight open={rightOpen} />
        </div>
    )
};

export default page;

// helper components
const BodyRight = ({ open }) => {
    const [prompt, setPrompt] = useState('');
    const searchRef = useRef(null);
    const { responses, setResponses, chatHistory, currentChatId, setCurrentChatId, getChatHistory, currentAgent, messages, loading, setLoading, completed, setCompleted, append, user, setLeftOpen } = usePlatformState();
    const [focus, setFocus] = useState(false);
    const messagesRef = useRef(null);
    const scrollRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const { sendTextMessage, connected } = useRealtimeState();
    const responseContainerRef = useRef(null);
    const contentRef = useRef(null);
    const scrollableContainerRef = useRef(null);
    const [showBorder, setShowBorder] = useState(false);
    const [starting, setStarting] = useState(false);

    // scroll observer for dynamic border
    useEffect(() => {
        const scrollableContainer = scrollableContainerRef.current;
        const content = contentRef.current;
        const container = responseContainerRef.current;
        if (!scrollableContainer || !content || !container) return;
        const checkScrollPosition = () => {
            const containerRect = container.getBoundingClientRect();
            const contentRect = content.getBoundingClientRect();
            const isAbove = contentRect.top < containerRect.top;
            setShowBorder(isAbove);
        };
        checkScrollPosition();
        scrollableContainer.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        return () => {
            scrollableContainer.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [responses, loading]);
    // scroll observer for dynamic border

    // handle response
    useEffect(() => {
        if (messages?.length > 0) {
            setResponses((prev) => {
                const assistantResponses = messages?.filter((item) => item?.role === 'assistant');
                const lastAssistantRespnose = assistantResponses[assistantResponses.length - 1];
                const commonLastResponse = messages.filter((item) => item !== undefined)[messages?.length - 1];
                if (commonLastResponse?.role === 'user') {
                    return [...prev].filter((item) => item !== undefined)
                } else {
                    const lastPrev = prev[prev.length - 1];
                    if (lastPrev?.role === 'assistant') {
                        if (lastPrev?.id !== lastAssistantRespnose?.id) {
                            const prevArr = [...prev];
                            return [...prevArr, lastAssistantRespnose].filter((item) => item !== undefined)
                        }
                    }
                    if (lastPrev?.id === lastAssistantRespnose?.id) {
                        prev.pop();
                    }
                    return [...prev, lastAssistantRespnose].filter((item) => item !== undefined)
                }
            });
            messagesRef.current = messages;
            if(messages[messages.length -1].role === 'assistant') {
                setStarting(false);
            }
        };
    }, [messages, setResponses]);
    // handle response

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getPlainText = (element: HTMLElement): string => {
        if (!element) return "";
        let text = element.innerHTML;
        if (text === '<br>') {
            return "";
        }
        text = text.replace(/<br\s*\/?>/gi, '\n');
        text = text.replace(/<\/div>|<\/p>/gi, '\n');
        text = text.replace(/<[^>]+>/g, '');
        const tempEl = document.createElement('div');
        tempEl.innerHTML = text;
        return (tempEl.textContent || "").trim();
    };

    const handleSearch = (e: any) => {
        const text = getPlainText(e.currentTarget);
        setPrompt(text);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };


    const handleSubmit = () => {
        if (connected) {
            if (prompt?.length > 0) {
                sendTextMessage(prompt);
                if (searchRef?.current) {
                    setPrompt('');
                    searchRef.current.textContent = '';
                    searchRef.current.blur();
                }
            }
        } else {
            if (loading) return;
            if (prompt?.length < 1) return;
            setLoading(true);
            setCompleted(false);
            setStarting(true);
            const userPrompt = { role: 'user', content: prompt, createdAt: new Date().toISOString() };
            setResponses((prev) => {
                return [
                    ...prev,
                    userPrompt
                ]
            });
            append({ role: 'user', content: prompt });
            scrollRef?.current?.scrollIntoView({ behavior: 'auto', block: "end" });
            setPrompt('');
            if (searchRef?.current) {
                searchRef.current.textContent = '';
                searchRef.current.blur();
            }
        }
    };

    useEffect(() => {
        if (scrollRef?.current) {
            scrollRef.current.scrollIntoView({ behavior: 'auto', block: "end" });
        }
    }, [scrollRef, responses, loading, completed, isRecording]);

    // handle history
    const createHistory = async (newHistory) => {
        const titleResponse = await fetch(`/api/models/title`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: newHistory.responses })
        });
        let newTitle: any = newHistory.title;

        if (titleResponse.ok) {
            const titleText = await titleResponse.text();
            newTitle = titleText;
        }

        const response = await fetch(`/api/chatHistory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...newHistory, title: newTitle })
        });
        if (response.ok) {
            await getChatHistory();
            const data = await response.json();
            setCurrentChatId(data?._id);
            history.replaceState(null, '', `/copilot?conversation=${data._id}`);
        }
    };

    const updateHistory = async (newHistory) => {
        const response = await fetch(`/api/chatHistory`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ historyId: newHistory._id, newHistory: newHistory })
        });
        if (response.ok) {
            getChatHistory();
        }
    };

    useEffect(() => {
        if (completed) {
            if (user?.id?.length > 0) {
                if (currentChatId) {
                    const currentHistory = chatHistory.find((item) => item._id === currentChatId);
                    if (currentHistory?._id?.length > 0) {
                        const updatedHistory = {
                            ...currentHistory,
                            responses: [...responses]
                        }
                        updateHistory(updatedHistory);
                    } else {
                        const newConvTitle = responses.filter((item) => item.role === 'user')?.content || 'Untitled conversation';
                        const newConv = {
                            userId: user?.id,
                            title: newConvTitle,
                            responses: responses,
                            agentId: currentAgent?.id
                        };
                        createHistory(newConv);
                    }
                } else {
                    const newConvTitle = responses.filter((item) => item.role === 'user')?.content || 'Untitled conversation';
                    const newConv = {
                        userId: user?.id,
                        title: newConvTitle,
                        responses: responses,
                        agentId: currentAgent?.id
                    };
                    createHistory(newConv);
                }
            }
        }
    }, [completed]);
    // handle history

    return (
        <div className={`w-full h-full transition-all ease-out will-change-auto overflow-hidden duration-150 relative`}>
            <div className={`absolute w-full top-0 left-0 bottom-0 main_card_shadow rounded-[16px] bg-in1c overflow-hidden duration-150 transition-all ease-out will-change-auto flex flex-col ${open ? '' : 'translate-x-[100%]'}`}>
                {/* sticky top */}
                <div className='w-full h-fit px-[16px] py-[16px] min-h-[64px] flex items-center relative justify-between shrink-0 z-[10]'>
                    {user ? (
                        <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center text-infa duration-150 transition-all hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762]' onClick={() => setLeftOpen((prev) => !prev)}>
                            {leftMenuIcon}
                        </button>
                    ) : (
                        <div className='w-fit h-fit flex items-center gap-[8px]'>
                            <InCircleButtonSkeleton />
                        </div>
                    )}

                    <div className='w-fit h-fit absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
                        {user ? (
                            <p className='text-[20px] leading-[24px] font-600 text-infa tracking-[-0.02em]'>Copilot</p>
                        ) : (
                            <InTitleSkeleton />
                        )}
                    </div>

                    {user ? (
                        <RealtimeHandler />
                    ) : (
                        <div className='w-fit h-fit flex items-center gap-[8px]'>
                            <InCircleButtonSkeleton />
                            <InCircleButtonSkeleton />
                        </div>
                    )}
                </div>
                <div className={`w-full border-t border-in37 duration-150 transition-all ease-out will-change-auto ${showBorder ? 'opacity-[100%]' : 'opacity-[0%]'}`} />
                {/* sticky top */}
                {/* main body */}
                {user ? (
                    <div className='w-full flex-1 flex flex-col'>
                        {/* response box */}
                        <div ref={responseContainerRef} className='w-full flex-1 relative'>
                            <div ref={scrollableContainerRef} className='w-full h-full absolute inset-0 overflow-y-auto no-scrollbar'>
                                {/* initial */}
                                {(responses?.length < 1 && !starting) && (
                                    <div ref={contentRef} className='w-full h-fit min-h-full flex flex-col items-center justify-center px-[12px]'>
                                        <div className='w-full h-fit min-h-full px-[12px] py-[8px] flex flex-col items-center justify-center'>
                                            <h3 className='text-center mt-[12px] text-[20px] leading-[32px] font-600 text-infa'>Copilot is here to help.</h3>
                                            <h3 className='text-center text-[20px] leading-[32px] font-600 text-infa'>Just ask</h3>
                                            <div className='w-full h-fit max-w-[320px] mt-[32px] mb-[14px] flex flex-col gap-[12px]'>
                                                {copilotFeatures?.map((item, i) => (
                                                    <div key={i} className='flex items-start gap-[12px]'>
                                                        <span className='shrink-0 w-[24px] h-[24px] flex items-center justify-center rounded-[8px] bg-in2b text-inc9'>
                                                            <span className='w-[12px] h-[12px] flex items-center justify-center'>
                                                                {item?.icon}
                                                            </span>
                                                        </span>
                                                        <span className='mt-[2px] text-[14px] leading-[20px] text-inc9'>{item?.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* initial */}
                                {/* responses */}
                                {(responses?.length > 0 || starting) && (
                                    <>
                                        <div ref={contentRef} className='w-full h-fit flex flex-col pb-[48px] px-[12px]'>
                                            {(responses?.length > 0 || starting) && (
                                                <div className='w-full h-fit px-[12px]'>
                                                    {responses?.map((message, i) => {
                                                        const isAssistant = message?.role === 'assistant'; ``
                                                        if (!isAssistant) {
                                                            return (
                                                                <div key={i} className={`w-full h-fit mt-[12px] pb-[4px] ${i === 0 ? 'pt-[8px]' : 'pt-[20px] border-t border-in37'}`} >
                                                                    <CopilotUser message={message} />
                                                                </div>
                                                            )
                                                        }

                                                        if (isAssistant) {
                                                            return (
                                                                <div key={i} className='w-full h-fit pb-[4px]' >
                                                                    <CopilotAssistant message={message} />
                                                                </div>
                                                            )
                                                        }
                                                    })}
                                                    {/* loader */}
                                                    {starting && (
                                                        <div className={`w-full h-fit flex flex-col mt-[16px] gap-[12px]`}>
                                                            <div className='h-[12px] w-full rounded-full bg-in2b animate-pulse shrink-0' />
                                                            <div className='h-[12px] w-full rounded-full bg-in2b animate-pulse shrink-0' />
                                                            <div className='h-[12px] w-[65%] rounded-full bg-in2b animate-pulse shrink-0' />
                                                        </div>
                                                    )}
                                                    {/* loader */}
                                                </div>
                                            )}
                                        </div>
                                        {responses?.length > 0 && (
                                            <div ref={scrollRef} className='w-full h-[1px] opacity-[0%]' />
                                        )}
                                    </>
                                )}
                                {/* responses */}
                            </div>
                        </div>
                        {/* response box */}
                        {/* chatbox */}
                        <div className='w-full h-fit px-[16px] pb-[16px]'>
                            <div className={`w-full h-fit rounded-[12px] border-[2px] border-transparent bg-in1c flex items-end relative ${focus ? 'colorful_bg_image' : 'outline outline-[1px] outline-in37 outline-offset-[-1px]'}`}>
                                {/* text input */}
                                <div className='flex-1 h-fit relative'>
                                    <div
                                        ref={searchRef}
                                        contentEditable
                                        className={`bg-transparent w-full h-fit pl-[16px] py-[12px] text-[14px] leading-[24px] font-400 text-infa z-[9] overflow-y-auto break-word`}
                                        style={{ maxHeight: '192px' }}
                                        onInput={handleSearch}
                                        onKeyDown={handleKeyDown}
                                        onPaste={handlePaste}
                                        role="textbox"
                                        datatype="text"
                                        aria-multiline="true"
                                        aria-autocomplete="none"
                                        onFocus={(e) => { setFocus(true) }}
                                        onBlur={() => setFocus(false)}
                                    />
                                    {prompt?.length < 1 && (
                                        <p className='text-[14px] leading-[24px] top-1/2 -translate-y-1/2 left-[16px] absolute z-[8] text-in9b' onClick={() => searchRef?.current?.focus()} >{responses?.length > 0 ? 'Ask a follow up question...' : 'Ask a question...'}</p>
                                    )}
                                </div>
                                {/* text input */}
                                {/* buttons */}
                                <div className='w-fit h-fit ml-[2px] mb-[8px] flex items-center gap-[2px]'>
                                    <button disabled={loading || prompt?.length < 1} className={`w-[32px] h-[32px] flex items-center justify-center rounded-full bg-inf2 hover:bg-ine5 text-in1212 disabled:bg-in2b disabled:hover:bg-in2b disabled:text-in9b duration-150 transition-all ease-out will-change-auto mr-[8px]`}>
                                        {arrowUpIcon}
                                    </button>
                                </div>
                                {/* buttons */}
                            </div>
                        </div>
                        {/* chatbox */}
                    </div>
                ) : (
                    <div className='w-full flex-1 flex flex-col flex items-center justify-center'>
                        <MainLoaderAnimationIn />
                    </div>
                )}
                {/* main body */}
            </div>
        </div>
    )
};

const CopilotUser = ({ message }) => {
    const contentText = typeof message?.content === 'string'
        ? message.content
            .replace(/\\n/g, '\n')
            .replace(/\n/g, '\n')
        : '';

    return (
        <h2 className='font-600 text-[18px] leading-[24px] text-infa'>{contentText}</h2>
    )
};

const CopilotAssistant = ({ message }) => {
    const contentText = typeof message?.content === 'string'
        ? message.content
            .replace(/\\n/g, '\n')
        : '';

    const lines = contentText.split('\n');

    return (
        <p className='font-400 text-[14px] leading-[20px] text-infa'>
            {lines.map((line, i) => (
                <span key={i}>
                    {line}
                    {i < lines.length - 1 && <br />}
                </span>
            ))}
        </p>
    );
};
// helper components

const copilotFeatures = [
    {
        text: "Copilot can find answers to customer concerns by searching your team's sales content and best converting conversations.",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1.41 11.74C1.17 11.98 1.02 12.26 0.92 12.56L0 16L3.44 15.07C3.74 14.98 4.02 14.82 4.26 14.58C5.04 13.8 5.04 12.52 4.26 11.74C3.48 10.96 2.2 10.96 1.42 11.74H1.41ZM14.79 1.21002C12.95 0.580026 10.82 0.850026 9.32 2.04002C9.17 2.15002 9.02 2.27002 8.89 2.41002L6.06 5.24002H3.28C2.98 5.24002 2.69 5.36002 2.47 5.57002L0.38 7.67002C0.19 7.86002 0.28 8.17002 0.53 8.24002L3.95 9.16002L6.84 12.05L7.76 15.47C7.83 15.72 8.15 15.81 8.33 15.62L10.43 13.52C10.64 13.31 10.76 13.02 10.76 12.71V9.93003L13.59 7.10002C13.72 6.97002 13.84 6.82002 13.96 6.67002C15.15 5.17002 15.42 3.05002 14.79 1.20002V1.21002ZM11.89 5.88002C11.4 6.37002 10.61 6.37002 10.12 5.88002C9.63 5.39002 9.63 4.60002 10.12 4.11002C10.61 3.62002 11.4 3.62002 11.89 4.11002C12.38 4.60002 12.38 5.39002 11.89 5.88002Z"></path></svg>
    },
    {
        text: "It can help you figure out what to say, using your team's best internal sales data.",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4.51999 11H11.47L12.31 10.16C13.2 9.15 13.74 7.81999 13.74 6.37C13.74 3.19 11.17 0.619995 7.98999 0.619995C4.80999 0.619995 2.23999 3.19 2.23999 6.37C2.23999 7.81999 2.77999 9.15 3.66999 10.16L4.50999 11H4.51999ZM7.99999 2.32001C8.87999 2.32001 9.69999 2.61 10.36 3.09C10.86 3.45 10.83 4.20999 10.29 4.51999C10.01 4.67999 9.64999 4.68001 9.38999 4.48001C8.99999 4.20001 8.51999 4.01999 7.99999 4.01999C6.67999 4.01999 5.60999 5.09 5.60999 6.41C5.60999 6.66 5.65999 6.91001 5.72999 7.14001L4.24999 8C4.03999 7.5 3.90999 6.96 3.90999 6.41C3.90999 4.15 5.74999 2.32001 7.99999 2.32001Z"></path><path d="M5 12.5V14.15C5 14.28 5.05 14.41 5.15 14.5L6.5 15.85C6.59 15.94 6.72 16 6.85 16H9.16C9.29 16 9.42 15.95 9.51 15.85L10.86 14.5C10.95 14.41 11.01 14.28 11.01 14.15V12.5H5.01H5Z"></path></svg>
    },
    {
        text: "All it needs is knowledge. The more content you give, the more expert Copilot becomes.",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M3.01006 12.5L1.57006 15H14.4301L12.9901 12.5H3.01006ZM3.01006 8.5L1.57006 11H14.4301L12.9901 8.5H3.01006ZM11.5401 2H4.45006L1.56006 7H14.4201L11.5301 2H11.5401Z"></path></svg>
    },
    {
        text: "Copilot conversations are only visible to you.",
        icon: <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.3 6H12V4.5C12 2.29 10.21 0.5 8 0.5C5.79 0.5 4 2.29 4 4.5V6H2.7C2.31 6 2 6.31 2 6.7V13.3C2 13.69 2.31 14 2.7 14H13.3C13.69 14 14 13.69 14 13.3V6.7C14 6.31 13.69 6 13.3 6ZM5.5 4.5C5.5 3.12 6.62 2 8 2C9.38 2 10.5 3.12 10.5 4.5V6H5.5V4.5Z"></path></svg>
    }
];
// constants

// icons
const arrowUpIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M12.8498 6.20986L7.99984 1.35986L3.14984 6.20986C2.81984 6.53986 2.81984 7.07986 3.14984 7.40986C3.47984 7.73986 4.01984 7.73986 4.34984 7.40986L7.14984 4.60986V13.9999H8.84984V4.60986L11.6498 7.40986C11.8198 7.57986 12.0298 7.65986 12.2498 7.65986C12.4698 7.65986 12.6898 7.57986 12.8498 7.40986C13.1798 7.07986 13.1798 6.53986 12.8498 6.20986Z"></path></svg>

const leftMenuIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M2 2H14C14.55 2 15 2.45 15 3V13C15 13.55 14.55 14 14 14H2C1.45 14 1 13.55 1 13V3C1 2.45 1.45 2 2 2ZM13.3 3.7H6V12.3H13.3V3.7Z"></path></svg>
// icons