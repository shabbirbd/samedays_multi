"use client";

import { useEdgeStore } from '@/lib/edgestore';
import { usePlatformState } from '@/lib/PlatformStateProvider';
import { useThemeProvider } from '@/lib/ThemeProvider';
import { useToast } from '@/lib/toastContext';
import { generateRandomCode, shallowEqual } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

const SettingsDialog = ({ setOpen, open }) => {
    const dialogRef = useRef(null);
    const [stage, setStage] = useState('initial');
    const { user, teammates, getTeammates } = usePlatformState();
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState('');
    const [role, setRole] = useState('admin');
    const { addToast } = useToast();
    const [currentTeammate, setCurrentTeammate] = useState<any>(null);
    const [defaultCurrentTeammate, setDefaultCurrentTeammate] = useState<any>(null);
    const [teamDeleteOpen, setTeamDeleteOpen] = useState(false);
    const [teamDeleting, setTeamDeleting] = useState(false);
    const [resending, setResending] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [prevStage, setPrevStage] = useState('initial');


    useEffect(() => {
        setStage('initial');
        setLoading(false);
        setEmails('');
        setRole('admin');
        setCurrentTeammate(null);
        setDefaultCurrentTeammate(null);
    }, [open]);

    const handleSend = async () => {
        if (loading) return;
        if (emails?.length < 0) return;
        const allEmails = emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
        if (allEmails?.length < 1) return;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newInvalidEmails = allEmails.filter(email => !emailPattern.test(email));
        if (newInvalidEmails?.length > 0) return;
        setLoading(true);
        const newToken = generateRandomCode(40);
        const constructedTeammates = allEmails?.map((item) => {
            const alreadyInvited = teammates.find((member) => member.email === item.trim());
            if (alreadyInvited?.email?.length > 0) {
                return undefined;
            } else {
                const newTeammate = {
                    userId: user?.id,
                    email: item,
                    expiary: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
                    seat: role,
                    status: 'pending',
                    name: '',
                    token: newToken
                }
                return newTeammate;
            }
        }).filter((item) => item !== undefined);
        if (constructedTeammates?.length > 0) {
            const saveResponse = await fetch('/api/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(constructedTeammates)
            });
            if (saveResponse.ok) {
                await fetch('/api/team/invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userName: user?.name?.length > 0 ? user?.name : user?.email, newTeammates: constructedTeammates })
                });
                addToast('Invite sent to your teammates', { type: 'success' });
                setLoading(false);
                getTeammates();
                setEmails('');
                setStage('teammates');
            } else {
                setLoading(false);
                addToast('Something went wrong', { type: 'error' });
                return
            }

        } else {
            addToast('The teamamtes are already invited', { type: 'error' });
            setLoading(false);
        }
    };

    const handleUpdateTeammate = async () => {
        if (loading || !currentTeammate) return;
        setLoading(true);
        const response = await fetch('/api/team', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId: currentTeammate?._id, newMember: currentTeammate })
        });
        if (response.ok) {
            addToast('Successfully updated', { type: 'success' });
            setLoading(false);
            getTeammates();
            setStage('teammates');
            setCurrentTeammate(null);
            setDefaultCurrentTeammate(null);
        } else {
            addToast('Failed to update', { type: 'error' });
            setLoading(false);
        }
    };

    // outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dialogRef.current && !dialogRef.current.contains(event.target) && !loading && !teamDeleteOpen && !resending) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loading, teamDeleteOpen, resending]);
    // outside click

    return (
        <>
            <div className='fixed w-screen h-screen inset-0 z-[999999999] px-[32px] pt-[64px] pb-[130px] bg-[#0000004d] dark:bg-[#00000080] flex items-center justify-center'>
                <div ref={dialogRef} className='w-full max-w-[500px] h-full rounded-[24px] bg-in1c m-auto in_dialog_shadow flex flex-col overflow-y-auto no-scrollbar relative'>
                    {/* top */}
                    <div className='w-full h-[65px] shrink-0 px-[12px] sticky top-0 bg-in1c'>
                        <div className='w-full h-full relative flex items-center justify-between'>
                            {/* left buttons */}
                            <div className='w-fit h-fit flex items-center'>
                                {stage === 'teammates' && (
                                    <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all disabled:cursor-not-allowed shrink-0' onClick={() => setStage('initial')}>
                                        <span className='rotate-180' >{chevronRightIcon}</span>
                                    </button>
                                )}
                                {stage === 'teammateDetail' && (
                                    <button disabled={loading || teamDeleting || resending} className='w-[32px] h-[32px] rounded-full flex items-center justify-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all disabled:cursor-not-allowed shrink-0' onClick={() => { setStage('teammates'); setCurrentTeammate(null); setDefaultCurrentTeammate(null) }}>
                                        <span className='rotate-180' >{chevronRightIcon}</span>
                                    </button>
                                )}
                                {stage === 'invite' && (
                                    <button disabled={loading} className='w-fit h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] disabled:cursor-not-allowed' onClick={() => setStage('teammates')} >
                                        <p className='text-[14px] leading-[20px] tracking-normal font-600'>Cancel</p>
                                    </button>
                                )}
                                {stage === 'allPlans' && (
                                    <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all disabled:cursor-not-allowed shrink-0' onClick={() => { setStage('subscription'); }}>
                                        <span className='rotate-180' >{chevronRightIcon}</span>
                                    </button>
                                )}
                                {stage === 'planDetail' && (
                                    <button className='w-[32px] h-[32px] rounded-full flex items-center justify-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all disabled:cursor-not-allowed shrink-0' onClick={() => { setStage(prevStage); setSelectedPlan(null)}}>
                                        <span className='rotate-180' >{chevronRightIcon}</span>
                                    </button>
                                )}
                            </div>
                            {/* left buttons */}

                            {/* middle text */}
                            <h2 className='text-[18px] leading-[24px] font-600 text-infa absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-[60px] truncate'>{stage === 'teammates' ? 'Teammates' : stage === 'invite' ? 'Invite Teammates' : (stage === 'teammateDetail' && currentTeammate) ? currentTeammate?.name?.length > 0 ? currentTeammate?.name : currentTeammate?.email : stage === 'subscription' ? 'Edit Subscription' : stage === 'allPlans' ? '' : stage === 'planDetail' ? '' : 'Settings'}</h2>
                            {/* middle text */}

                            {/* right buttons */}
                            {(stage === 'initial' || stage === 'teammates') && (
                                <button disabled={loading} className='w-[32px] h-[32px] rounded-full flex items-center justify-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all disabled:cursor-not-allowed shrink-0' onClick={() => setOpen(false)}>
                                    {xIcon}
                                </button>
                            )}
                            {stage === 'invite' && (
                                <button disabled={loading || emails?.length < 1} className='w-[59px] justify-center h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] disabled:cursor-not-allowed' onClick={() => handleSend()} >
                                    {loading ? (
                                        <span className='animate-spin'>{loaderIcon}</span>
                                    ) : (
                                        <p className='text-[14px] leading-[20px] tracking-normal font-600'>Send</p>
                                    )}
                                </button>
                            )}
                            {stage === 'teammateDetail' && (
                                <button disabled={loading || shallowEqual(currentTeammate, defaultCurrentTeammate) || teamDeleting || resending} className='w-[73px] justify-center h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] disabled:cursor-not-allowed disabled:text-in9b disabled:hover:bg-in2b' onClick={() => handleUpdateTeammate()} >
                                    {loading ? (
                                        <span className='animate-spin text-inc9'>{loaderIcon}</span>
                                    ) : (
                                        <p className='text-[14px] leading-[20px] tracking-normal font-600'>Update</p>
                                    )}
                                </button>
                            )}
                            {stage === 'subscription' && (
                                <button className='w-fit justify-center h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] disabled:cursor-not-allowed disabled:text-in9b disabled:hover:bg-in2b' onClick={() => setStage('initial')} >
                                    <p className='text-[14px] leading-[20px] tracking-normal font-600'>Done</p>
                                </button>
                            )}
                            {/* right buttons */}
                        </div>
                    </div>
                    {/* top */}
                    {/* body */}
                    {stage === 'initial' && (
                        <InitialStage setStage={setStage} setSelectedPlan={setSelectedPlan} setPrevStage={setPrevStage} />
                    )}

                    {stage === 'editProfile' && (
                        <EditProfileStage stage={stage} setStage={setStage} loading={loading} setLoading={setLoading} />
                    )}

                    {stage === 'teammates' && (
                        <Teammates setStage={setStage} setCurrentTeammate={setCurrentTeammate} setDefaultCurrentTeammate={setDefaultCurrentTeammate} />
                    )}

                    {stage === 'invite' && (
                        <TeamInvite role={role} setRole={setRole} stage={stage} emails={emails} setEmails={setEmails} loading={loading} />
                    )}

                    {stage === 'teammateDetail' && (
                        <TeammateDetail currentTeammate={currentTeammate} setCurrentTeammate={setCurrentTeammate} loading={loading} setDeleteOpen={setTeamDeleteOpen} resending={resending} setResending={setResending} />
                    )}

                    {stage === 'subscription' && (
                        <Subscription setStage={setStage} />
                    )}

                    {stage === 'allPlans' && (
                        <AllPlans setStage={setStage} setSelectedPlan={setSelectedPlan} setPrevStage={setPrevStage} />
                    )}

                    {stage === 'planDetail' && (
                        <PlanDetial setStage={setStage} selectedPlan={selectedPlan} />
                    )}
                    {/* body */}
                </div>
            </div>
            {/* popups */}
            {teamDeleteOpen && (
                <TeamDeleteDialog teammate={currentTeammate} setTeammate={setCurrentTeammate} loading={teamDeleting} setLoading={setTeamDeleting} setOpen={setTeamDeleteOpen} setDefaultTeammate={setDefaultCurrentTeammate} setStage={setStage} />
            )}
            {/* popups */}
        </>
    )
};

export default SettingsDialog;

// helper components
const InitialStage = ({ setStage, setSelectedPlan, setPrevStage }) => {
    const { user } = usePlatformState();

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col justify-center items-center'>
            <div className='h-[100px] w-[100px] flex items-center justify-center rounded-full overflow-hidden dark:bg-[#b87aad] bg-[#b946a6] border border-in37'>
                {user?.image?.length > 0 ? (
                    <img src={user?.image} alt={user?.email} className='w-full h-full object-cover' />
                ) : (
                    <h2 className='text-[32px] leading-[36  px] font-600 text-infa uppercase' >{user?.name?.length > 0 ? user?.name?.slice(0, 2) : user?.email?.slice(0, 2)}</h2>
                )}
            </div>
            <h2 className='text-[20px] leading-[24px] text-infa font-500 tracking-[-0.02em] text-infa mt-[16px] text-center' >{user?.name?.length > 0 ? user?.name : user?.email}</h2>
            <button className='w-fit h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] mt-[12px]' onClick={() => setStage('editProfile')}>
                <p className='text-[14px] leading-[20px] tracking-normal font-600 ml-[3px]'>Edit profile</p>
            </button>
            <div className='w-full h-fit flex flex-col mt-[32px]'>
                <p className='text-[14px] leading-[20px] text-inc9 font-500 ml-[20px]'>Account</p>
                <div className='h-fit w-full rounded-[16px] px-[20px] flex flex-col bg-in2b mt-[8px]'>
                    {/* email */}
                    <div className='w-full h-[48px] border-b border-in37 box-border flex items-center justify-between gap-[16px]'>
                        <div className='w-fit h-fit flex items-center gap-[8px] text-infa shrink-0'>
                            {emailIcon}
                            <p className='text-[14px] leading-[20px] font-500' >Email</p>
                        </div>
                        <p className='text-[14px] leading-[20px] text-inc9 truncate whitespace-nowrap' >{user?.email}</p>
                    </div>
                    {/* email */}
                    {/* phone */}
                    <div className='w-full h-[48px] border-b border-in37 box-border flex items-center justify-between gap-[16px]'>
                        <div className='w-fit h-fit flex items-center gap-[8px] text-infa shrink-0'>
                            {phoneIcon}
                            <p className='text-[14px] leading-[20px] font-500' >Phone number</p>
                        </div>
                        <p className='text-[14px] leading-[20px] text-inc9 truncate whitespace-nowrap' >{user?.phone?.length > 0 ? user?.phone : 'Not set yet'}</p>
                    </div>
                    {/* phone */}
                    {/* subscription */}
                    <div className='w-full h-[48px] box-border flex items-center justify-between gap-[16px] border-b border-in37 cursor-pointer' onClick={() => setStage('subscription')} >
                        <div className='w-fit h-fit flex items-center gap-[8px] text-infa shrink-0'>
                            {subscriptionIcon}
                            <p className='text-[14px] leading-[20px] font-500' >Subscription</p>
                        </div>
                        <p className='text-[14px] leading-[20px] text-inc9 truncate whitespace-nowrap' >Free</p>
                    </div>
                    {/* subscription */}
                    {/* pro */}
                    <div className='w-full h-[48px] box-border flex items-center justify-between gap-[16px] border-b border-in37 cursor-pointer' onClick={() => {setSelectedPlan(allPlans[1]); setStage('planDetail'); setPrevStage('initial')}} >
                        <div className='w-fit h-fit flex items-center gap-[8px] text-infa shrink-0'>
                            {subscriptionIcon}
                            <p className='text-[14px] leading-[20px] font-500' >Upgrade to Pro</p>
                        </div>
                    </div>
                    {/* pro */}
                    {/* teammates */}
                    <div className='w-full h-[48px] box-border flex items-center justify-between gap-[16px] cursor-pointer rounded-[8px]' onClick={() => setStage('teammates')}>
                        <div className='w-fit h-fit flex items-center gap-[8px] text-infa shrink-0'>
                            {usersIcon}
                            <p className='text-[14px] leading-[20px] font-500' >Teammates</p>
                        </div>
                        <p className='text-[14px] leading-[20px] text-inc9 truncate whitespace-nowrap' >{chevronRightIcon}</p>
                    </div>
                    {/* teammates */}

                </div>
            </div>
        </div>
    )
};

const EditProfileStage = ({ stage, setStage, loading, setLoading }) => {
    const { user, update } = usePlatformState();
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        phone: ''
    });
    const [progress, setProgress] = useState(0);
    const imageRef = useRef(null);
    const { edgestore } = useEdgeStore();
    const { addToast } = useToast();

    useEffect(() => {
        if (user) {
            setFormData((prev) => {
                return {
                    name: user?.name || "",
                    image: user?.image || "",
                    phone: user?.phone || ""
                }
            })
        }
    }, [user, stage]);

    const handleImageClick = () => {
        if (loading) return;
        if (progress > 0) return;
        if (imageRef?.current) {
            imageRef?.current?.click();
        }
    };

    const uploadFile = async (file) => {
        if (file) {
            const res = await edgestore.publicFiles.upload({
                file: file,
                onProgressChange: (prog) => {
                    setProgress(prog)
                }
            });
            return res.url
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const url = await uploadFile(file);
            if (url?.length > 0) {
                setFormData((prev) => {
                    return {
                        ...prev,
                        image: url
                    }
                });
            }
            setProgress(0);
        }
    };

    const handleSave = async () => {
        if (loading) return;
        if (formData?.name?.length < 1) return;
        setLoading(true);
        const response = await fetch('/api/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: formData?.name, image: formData?.image, userId: user?.id, phone: formData?.phone })
        });
        if (response.ok) {
            addToast('Profile updated', { type: "success" });
            setLoading(false);
            setStage('initial');
            update();
        } else {
            addToast('Failed to update', { type: 'error' });
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col items-center justify-center'>
            {/* image */}
            <div className='w-fit h-fit relative cursor-pointer'>
                <div className='h-[100px] w-[100px] flex items-center justify-center rounded-full overflow-hidden dark:bg-[#b87aad] bg-[#b946a6] border border-in37 cursor-pointer z-[9]' onClick={() => handleImageClick()}>
                    {formData?.image?.length > 0 ? (
                        <img src={formData?.image} alt={user?.email} className='w-full h-full object-cover' />
                    ) : (
                        <h2 className='text-[32px] leading-[36px] font-600 text-infa uppercase' >{user?.name?.length > 0 ? user?.name?.slice(0, 2) : user?.email?.slice(0, 2)}</h2>
                    )}
                </div>
                <div className='w-[32px] h-[32px] rounded-full absolute top-[70px] left-[70px] bg-in2b border border-[#00000033] z-[10] flex items-center justify-center text-inc9' onClick={() => handleImageClick()}>
                    {editIcon}
                </div>
                {progress > 0 && (
                    <div className='w-full h-full rounded-full absolute top-0 left-0 z-[99] bg-black/30 text-[#fafafa] flex items-center justify-center'>
                        <p className='text-[18px] leading-[24px]'>{progress.toFixed(0)}%</p>
                    </div>
                )}
                <input type="file" accept='image/*' className='w-[0px] h-[0px] fixed top-0 left-0 z-[-99999] opacity-[0%]' ref={imageRef} onChange={(e) => {
                    handleFileChange(e);
                    e.target.value = '';
                }} />
            </div>
            {/* image */}
            {/* name */}
            <div className='w-full h-fit mt-[24px] flex flex-col gap-[8px]'>
                <p className='text-[14px] leading-[16px] font-500 text-inc9' >Name</p>
                <input type="text" className='h-[32px] w-full max-w-[558px] rounded-[6px] px-[11px] border border-in37 hover:border-in50 focus:border-in50 focus:shadow-[inset_0_0_0_1px_#c6c9c0] dark:focus:shadow-[inset_0_0_0_1px_#505762] text-infa text-[14px] leading-[20px] font-400 tracking-normal transition-all ease-out will-change-auto duration-150 bg-transparent' value={formData?.name || ""} onChange={(e) => setFormData((prev) => {
                    return {
                        ...prev,
                        name: e.target.value
                    }
                })} />
            </div>
            {/* name */}
            {/* phone */}
            <div className='w-full h-fit mt-[24px] flex flex-col gap-[8px]'>
                <p className='text-[14px] leading-[16px] font-500 text-inc9' >Phone number</p>
                <input
                    type="text"
                    placeholder="Enter your phone number"
                    className='h-[32px] w-full max-w-[558px] rounded-[6px] px-[11px] border border-in37 hover:border-in50 focus:border-in50 focus:shadow-[inset_0_0_0_1px_#c6c9c0] dark:focus:shadow-[inset_0_0_0_1px_#505762] text-infa text-[14px] leading-[20px] font-400 tracking-normal transition-all ease-out will-change-auto duration-150 bg-transparent'
                    value={formData?.phone || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        const newNumber = value.replace(/[^+\d]/g, '');
                        setFormData((prev) => {
                            return {
                                ...prev,
                                phone: newNumber
                            }
                        })
                    }}
                />
            </div>
            {/* phone */}
            <p className='text-[14px] leading-[20px] mt-[16px] text-inc9'>Your profile helps people recognize you.</p>
            {/* buttons */}
            <div className='w-full h-fit mt-[24px] flex flex-col gap-[8px] items-center justify-center'>
                <button disabled={loading || formData?.name?.length < 1} className='w-[105px] justify-center h-[32px] px-[12px] rounded-full bg-inf2 hover:bg-ine5 flex items-center gap-[4px] duration-150 transition-all text-in1212 disabled:bg-in2b disabled:text-in9b disabled:cursor-not-allowed' onClick={() => handleSave()}>
                    <p className='text-[14px] font-600 leading-[20px] tracking-normal'>Save profile</p>
                </button>
                <button disabled={loading} className='w-[105px] justify-center h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] disabled:cursor-not-allowed' onClick={() => setStage('initial')} >
                    <p className='text-[14px] leading-[20px] tracking-normal font-600'>Cancel</p>
                </button>
            </div>
            {/* buttons */}
        </div>
    )
};

const Teammates = ({ setStage, setCurrentTeammate, setDefaultCurrentTeammate }) => {
    const { teammates, user } = usePlatformState();

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col items-center justify-center'>
            <p className='text-[14px] leading-[20px] text-inc9'>You can add them one by one or many. You'll also be able to set up their permissions and roles.</p>
            <div className='w-full h-fit flex flex-col shrink-0 mt-[24px]'>
                <p className='text-[14px] leading-[20px] text-inc9 font-500 ml-[20px]'>Your teammates</p>
                {/* list */}
                <div className='h-fit rounded-[16px] px-[20px] flex flex-col bg-in2b mt-[8px]'>
                    {/* admin */}
                    <div className='w-full h-[48px] flex items-center justify-between cursor-pointer gap-[8px]'>
                        <div className='w-fit h-fit flex items-center gap-[8px]'>
                            <div className='w-[24px] h-[24px] rounded-full dark:bg-[#b87aad] bg-[#b946a6] flex items-center justify-center shrink-0'>
                                <p className='text-[10px] leading-[20px] font-600 uppercase text-infa'>{user?.name?.length > 0 ? user?.name?.slice(0, 2) : user?.email?.slice(0, 2)}</p>
                            </div>
                            <p className='text-[14px] leading-[20px] shrink-1 truncate line-clamp-1'>{user?.name?.length > 0 ? user?.name : user?.email}</p>
                        </div>
                        <p className='text-[14px] leading-[20px] text-inc9'>Owner</p>
                    </div>
                    {/* admin */}
                    {/* list */}
                    {teammates?.map((item, i) => (
                        <div key={i} className='w-full h-[48px] box-border border-t border-in37 flex items-center justify-between cursor-pointer' onClick={() => { setCurrentTeammate(item); setDefaultCurrentTeammate(item); setStage('teammateDetail') }}  >
                            <div className='w-fit h-fit flex items-center gap-[8px]'>
                                <div className='w-[24px] h-[24px] rounded-full dark:bg-[#b87aad] bg-[#b946a6] flex items-center justify-center shrink-0'>
                                    <p className='text-[10px] leading-[20px] font-600 uppercase text-infa'>{item?.name?.length > 0 ? item?.name?.slice(0, 2) : item?.email?.slice(0, 2)}</p>
                                </div>
                                <p className='text-[14px] leading-[20px] shrink-1 truncate line-clamp-1'>{item?.name?.length > 0 ? item?.name : item?.email}</p>
                            </div>
                            <div className='w-fit h-fit flex items-center gap-[4px]'>
                                {item?.status === 'pending' && (
                                    <p className='text-[14px] leading-[20px] text-inc9'>Pending</p>
                                )}
                                <span className='text-inc9'>
                                    {chevronRightIcon}
                                </span>
                            </div>
                        </div>
                    ))}
                    {/* list */}
                </div>
                {/* list */}
                {/* invite button */}
                <button className='mt-[24px] w-full h-[48px] rounded-full bg-in2b hover:bg-in39 px-[20px] flex items-center justify-between duration-150 transition-all ease-out will-change-auto' onClick={() => setStage('invite')} >
                    <p className='text-[14px] leading-[20px] whitespace-nowrap truncate text-inblue font-500' >Invite teammates</p>
                    <span className='text-inc9'>
                        {chevronRightIcon}
                    </span>
                </button>
                {/* invite button */}
            </div>
        </div>
    )
};

const TeamInvite = ({ stage, emails, setEmails, loading, role, setRole }) => {
    const [invalidEmails, setInvalidEmails] = useState([]);

    const handleBlur = () => {
        const allEmails = emails.split(',').map(email => email.trim()).filter(email => email.length > 0);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const newInvalidEmails = allEmails.filter(email => !emailPattern.test(email));
        setInvalidEmails(newInvalidEmails);
    };

    useEffect(() => {
        setEmails('');
        setInvalidEmails([]);
    }, [stage]);

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col'>
            <p className='text-[14px] leading-[20px] text-infa font-500 ml-[20px]'>Email addresses&nbsp;<span className='text-inc9'>(comma seperated)</span></p>
            <div className='w-full h-fit mt-[8px] rounded-[16px] px-[20px] bg-in2b flex flex-col shrink-0'>
                {/* email */}
                <input type="text" placeholder='name@company.com, name2@company.com' className='w-full h-[48px] border-b border-in37 bg-transparent placeholder:text-inc9 text-infa text-[16px] md:text-[14px] leading-[20px]' value={emails} onChange={(e) => {
                    setEmails(e.target.value);
                    setInvalidEmails([]);
                }} onBlur={() => {
                    handleBlur();
                }} />
                {/* email */}
                {/* text */}
                <div className='w-full h-fit py-[8px] flex items-center'>
                    {invalidEmails?.length > 0 ? (
                        <p className='text-[14px] leading-[20px] text-ininputred'>{invalidEmails.join(', ')}&nbsp;{invalidEmails?.length > 1 ? 'are' : 'is'}&nbsp;invalid.</p>
                    ) : (
                        <p className='text-[14px] leading-[20px] text-inc9'>If your team member is new to Samedays, they'll be asked to create an account.</p>
                    )}
                </div>
                {/* text */}
            </div>
            <p className='text-[14px] leading-[20px] text-infa font-500 ml-[20px] mt-[24px]'>Role</p>
            <div className='w-full h-fit mt-[8px] rounded-[16px] px-[20px] bg-in2b flex flex-col shrink-0'>
                <button disabled={loading} className='group w-fit h-[48px] flex items-center gap-[8px]' onClick={() => setRole('admin')} >
                    <span className={`w-[32px] h-[16px] rounded-full p-[2px] duration-150 transition-all ease-out will-change-auto ease-out block shrink-0 ${role === 'admin' ? 'bg-inred' : 'bg-in50'}`}>
                        <span className={`w-[12px] h-[12px] rounded-full main_card_shadow bg-in1c block relative duration-150 transition-all ease-out will-change-auto ${role === 'admin' ? 'translate-x-4' : ''}`} />
                    </span>
                    <span className='text-[14px] text-infa font-500'>Admin</span>
                </button>
                <div className="w-full h-[1px] bg-in37" />
                <button disabled={loading} className='group w-fit h-[48px] flex items-center gap-[8px]' onClick={() => setRole('user')} >
                    <span className={`w-[32px] h-[16px] rounded-full p-[2px] duration-150 transition-all ease-out will-change-auto ease-out block shrink-0 ${role === 'user' ? 'bg-inred' : 'bg-in50'}`}>
                        <span className={`w-[12px] h-[12px] rounded-full main_card_shadow bg-in1c block relative duration-150 transition-all ease-out will-change-auto ${role === 'user' ? 'translate-x-4' : ''}`} />
                    </span>
                    <span className='text-[14px] text-infa font-500'>Member</span>
                </button>
            </div>
        </div>
    )
};

const TeammateDetail = ({ currentTeammate, setCurrentTeammate, loading, setDeleteOpen, resending, setResending }) => {
    const { user } = usePlatformState();
    const { addToast } = useToast();


    const handleResend = async () => {
        if (resending) return;
        setResending(true);
        const response = await fetch('/api/team/resend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName: user?.name, teammate: currentTeammate })
        });
        if (response.ok) {
            addToast(`The invite to ${currentTeammate?.email} has been resent.`, { type: 'success' });
            setResending(false);
        } else {
            addToast('Failed to resend', { type: 'error' });
            setResending(false);
            return;
        }
    };

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col' >
            {currentTeammate?.status === 'pending' ? (
                <p className='text-[14px] leading-[20px] text-inc9 px-[20px]'>{currentTeammate?.email} is not accepted your invite yet.</p>
            ) : (
                <p className='text-[14px] leading-[20px] text-inc9 px-[20px]'>{currentTeammate?.name?.length > 0 ? currentTeammate?.name : currentTeammate?.email} is accepted your invite and your active teammate,</p>
            )}
            <p className='text-[14px] leading-[20px] text-infa font-500 ml-[20px] mt-[24px]'>Role</p>
            <div className='w-full h-fit mt-[8px] rounded-[16px] px-[20px] bg-in2b flex flex-col shrink-0'>
                <button disabled={loading} className='group w-fit h-[48px] flex items-center gap-[8px]' onClick={() => setCurrentTeammate((prev) => {
                    return {
                        ...prev,
                        seat: 'admin'
                    }
                })} >
                    <span className={`w-[32px] h-[16px] rounded-full p-[2px] duration-150 transition-all ease-out will-change-auto ease-out block shrink-0 ${currentTeammate?.seat === 'admin' ? 'bg-inred' : 'bg-in50'}`}>
                        <span className={`w-[12px] h-[12px] rounded-full main_card_shadow bg-in1c block relative duration-150 transition-all ease-out will-change-auto ${currentTeammate?.seat === 'admin' ? 'translate-x-4' : ''}`} />
                    </span>
                    <span className='text-[14px] text-infa font-500'>Admin</span>
                </button>
                <div className="w-full h-[1px] bg-in37" />
                <button disabled={loading} className='group w-fit h-[48px] flex items-center gap-[8px]' onClick={() => setCurrentTeammate((prev) => {
                    return {
                        ...prev,
                        seat: 'user'
                    }
                })} >
                    <span className={`w-[32px] h-[16px] rounded-full p-[2px] duration-150 transition-all ease-out will-change-auto ease-out block shrink-0 ${currentTeammate?.seat === 'user' ? 'bg-inred' : 'bg-in50'}`}>
                        <span className={`w-[12px] h-[12px] rounded-full main_card_shadow bg-in1c block relative duration-150 transition-all ease-out will-change-auto ${currentTeammate?.seat === 'user' ? 'translate-x-4' : ''}`} />
                    </span>
                    <span className='text-[14px] text-infa font-500'>Member</span>
                </button>
            </div>
            <div className='w-full h-fit flex flex-col gap-[8px] items-center justify-center mt-[24px]'>
                {currentTeammate?.status === 'pending' && (
                    <button disabled={loading || resending} className='w-[116px] justify-center h-[32px] px-[12px] rounded-full bg-inf2 hover:bg-ine5 flex items-center gap-[4px] duration-150 transition-all text-in1212 disabled:bg-in2b disabled:text-in9b disabled:cursor-not-allowed' onClick={() => handleResend()}>
                        {resending ? (
                            <span className='animate-spin text-inc9'>
                                {loaderIcon}
                            </span>
                        ) : (
                            <p className='text-[14px] font-600 leading-[20px] tracking-normal'>Resend Invite</p>
                        )}
                    </button>
                )}
                <button disabled={loading || resending} className='w-fit h-[32px] px-[12px] rounded-full bg-inbuttonred text-in12 text-[14px] leading-[16px] hover:bg-inbuttonrdhover font-600 flex items-center justify-center duration-150 transiton-all will-change-auto disabled:cursor-not-allowed' onClick={() => setDeleteOpen(true)}>
                    <p className='text-[14px] font-600 leading-[20px] tracking-normal'>Delete teammate</p>
                </button>
            </div>
        </div>
    )
};

const TeamDeleteDialog = ({ setStage, teammate, setTeammate, loading, setLoading, setOpen, setDefaultTeammate }) => {
    const dialogRef = useRef(null);
    const { getTeammates } = usePlatformState();
    const { addToast } = useToast();

    const handleDelete = async () => {
        if (loading) return;
        setLoading(true);
        const response = await fetch('/api/team', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ memberId: teammate?._id })
        });
        if (response) {
            addToast('Successfully deleted teammate.', { type: 'success' });
            getTeammates();
            setStage('teammates');
            setTeammate(null);
            setDefaultTeammate(null);
            setOpen(false);
            setLoading(false);
        } else {
            addToast('Failed to delete. Please try again.', { type: 'error' });
            setLoading(false);
        }
    };

    // outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dialogRef.current && !dialogRef.current.contains(event.target) && !loading) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [loading]);
    // outside click

    return (
        <div className='fixed w-screen h-screen inset-0 z-[99999999999999999] p-[32px] bg-[#0000004d] dark:bg-[#00000080] flex items-center justify-center'>
            <div ref={dialogRef} className='w-full max-w-[400px] m-auto h-fit rounded-[16px] bg-in2b in_dialog_shadow relative overflow-hidden flex flex-col'>
                {/* top */}
                <div className='w-full h-[64px] shrink-0 flex items-center justify-between pl-[30px] pr-[20px]'>
                    <h3 className='text-[18px] leading-[24px] font-600 text-infa'>Delete teammate</h3>
                    <button disabled={loading} className='w-[16px] h-[24px] flex items-center justify-center text-infa hover:text-inred duration-150 transition-all ease-out will-change-auto' onClick={() => setOpen(false)}>
                        {xIcon}
                    </button>
                </div>
                {/* top */}
                {/* middle */}
                <div className='w-full h-fit px-[30px] pb-[30px] pt-[10px] border-b border-in37'>
                    <p className='text-[14px] leading-[20px] font-400 text-infa whitespace-prewrap text-balance'>Are you sure you want to delete {teammate?.name?.length > 0 ? teammate?.name : teammate?.email} from your team?</p>
                </div>
                {/* middle */}
                {/* bottom */}
                <div className='w-full h-fit p-[20px] flex items-center justify-end gap-[4px]'>
                    <button disabled={loading} className='w-fit h-[32px] rounded-full flex items-center gap-[4px] duration-150 transition-all bg-in2b text-infa hover:bg-in39 active:bg-in39 active:shadow-[0_0_0_1px_#c6c9c0] dark:active:shadow-[0_0_0_1px_#505762] duration-150 transittion-all px-[12px] opacity-[0%] group-hover:opacity-[100%]' onClick={() => setOpen(false)}>
                        <p className='text-[14px] leading-[20px] tracking-normal font-600 ml-[3px] mr-[3px'>Cancel</p>
                    </button>
                    <button disabled={loading} className='w-[139px] h-[32px] px-[12px] rounded-full bg-inbuttonred text-in12 text-[14px] leading-[16px] hover:bg-inbuttonrdhover font-600 flex items-center justify-center duration-150 transiton-all will-change-auto' onClick={() => handleDelete()}>
                        {loading ? (
                            <span className='w-fit h-fit flex items-center justify-center animate-spin'>
                                {loaderIcon}
                            </span>
                        ) : (
                            <p className='text-[14px] leading-[16px] font-600'>Delete teammate</p>
                        )}
                    </button>
                </div>
                {/* bottom */}
            </div>
        </div>
    )
};

const Subscription = ({ setStage }) => {
    const { theme } = useThemeProvider();
    const { user } = usePlatformState();
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [planPrice, setPlanPrice] = useState('$0.00');

    useEffect(() => {
        if (user && user?.plan?.length > 0) {
            if (user?.plan === 'plus' || user?.plan === 'yearlyPlus') {
                setCurrentPlan("Plus");
                if (user?.plan === 'yearlyPlus') {
                    setPlanPrice('$200.00 per month');
                } else {
                    setPlanPrice('$19.99 per month');
                }
            } else if (user?.plan === 'pro') {
                setCurrentPlan('Pro');
                setPlanPrice('$200.00 per month')
            } else {
                setCurrentPlan('Free');
                setPlanPrice('$00.00');
            }
        } else {
            setCurrentPlan('Free');
            setPlanPrice('$00.00');
        }
    }, [user]);

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col'>
            {/* current plan */}
            <div className='w-full h-fit rounded-[16px] p-[20px] flex flex-col bg-in2b'>
                <img src={theme === 'dark' ? '/logos/same_fav.png' : '/logos/same_fav_black.png'} alt="samedays" className='w-[40px] h-[40px] object-contain' />
                <h2 className='text-[20px] leading-[24px] tracking-[-0.02em] font-600 text-infa mt-[8px]'>Samedays</h2>
                <div className='mt-[16px] w-full flex items-center justify-between pb-[8px] border-b border-in37'>
                    <h2 className='text-[16px] leading-[20px] font-600 text-infa' >Samedays {currentPlan}</h2>
                    <button className='h-fit w-fit flex items-center gap-[px] text-inblue group' onClick={() => setStage('allPlans')} >
                        <p className='text-[14px] leading-[20px] font-500 group-hover:underline duration-150 transition-all ease-out will-change-auto'>See All Plans</p>
                        {chevronRightIcon}
                    </button>
                </div>
                <div className='w-full h-fit mt-[12px] flex flex-col gap-[4px]'>
                    {/* price */}
                    <div className='w-fit h-fit flex items-center gap-[8px] text-infa'>
                        {cardIcon}
                        <p className='text-[14px] leading-[20px]' >{planPrice}</p>
                    </div>
                    {/* price */}
                    {/* renewal */}
                    <div className='w-fit h-fit flex items-center gap-[8px] text-infa'>
                        {dateIcon}
                        <p className='text-[14px] leading-[20px]' >{user?.renewal?.length > 0 ? formatDate(user?.reneual) : 'Unlimited'}</p>
                    </div>
                    {/* renewal */}
                </div>
            </div>
            {/* current plan */}

            {/* cancel button */}
            <button className='mt-[24px] w-full h-[48px] rounded-full bg-in2b hover:bg-in39 px-[20px] flex items-center justify-between duration-150 transition-all ease-out will-change-auto' >
                <p className='text-[14px] leading-[20px] whitespace-nowrap truncate text-inbuttonred font-500' >Cancel Subscription</p>
            </button>
            {/* cancel button */}
        </div>
    )
};

const AllPlans = ({ setStage, setSelectedPlan, setPrevStage }) => {
    const { theme } = useThemeProvider();
    const { user } = usePlatformState();

    return (
        <div className='w-full h-fit shrink-0 p-[24px] flex flex-col' >
            {/* head */}
            <div className='w-full h-fit flex flex-col items-center justify-center'>
                <img src={theme === 'dark' ? '/logos/same_fav.png' : '/logos/same_fav_black.png'} alt="samedays" className='w-[40px] h-[40px] object-contain' />
                <p className='text-[18px] leading-[24px] text-infa mt-[8px] text-center' >Aavailable Plans</p>
            </div>
            {/* head */}
            {/* plans */}
            <div className='w-full h-fit mt-[24px] flex flex-col gap-[12px]'>
                {allPlans.map((item, i) => (
                    <div key={i} className={`w-full h-fit p-[16px] rounded-[16px] flex items-center bg-in2b cursor-pointer border ${item?.key === user?.plan ? 'border-inblue' : 'border-in37'}`} onClick={() => {setSelectedPlan(item); setStage('planDetail'); setPrevStage('allPlans')}} >
                        <div className='w-full h-fit flex flex-col gap-[4px]'> 
                            <div className='w-full h-fit flex items-center justify-between'>
                                <h3 className='text-[16px] leading-[20px] text-infa line-clamp-1' >{item?.title}</h3>
                                <div className={`w-[16px] h-[16px] rounded-full border box-border ${user?.plan === item?.key ? 'border-inblue bg-inblue text-[#121212]' : 'border-in50 text-transparent'}`}>
                                    {checkIcon}
                                </div>
                            </div>
                            <p className='text-[14px] leading-[20px] text-inc9' >{item?.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* plans */}
        </div>
    )
};

const PlanDetial = ({setStage, selectedPlan}) => {
    return (
        <div className='w-full h-fit px-[24px] pb-[24px] flex flex-col shrink-0 items-center justify-center' >
            <span className='w-[40px] h-[40px] flex items-center justify-center text-infa'>
                {sparkIcon}
            </span>
            <h3 className='text-[24px] leading-[28px] font-600 mt-[16px] tracking-[-0.024em] text-infa' >{selectedPlan?.title}</h3>
            <p className='text-[16px] leading-[20px] text-inc9 mt-[8px] text-center' >Get the best of Samedays with the highest level of access</p>

            <div className='w-full h-fit mt-[48px] flex flex-col gap-[8px]'>
                <div className='w-full h-fit flex items-start gap-[8px]'>
                    <span className='w-[20px] h-[20px] flex items-center justify-center text-inlightgreen'>
                        {checkIcon}
                    </span>
                    <p className='text-[14px] leading-[20px] text-infa'>Everything in Plus</p>
                </div>
                <div className='w-full h-fit flex items-start gap-[8px]'>
                    <span className='w-[20px] h-[20px] flex items-center justify-center text-inlightgreen'>
                        {checkIcon}
                    </span>
                    <p className='text-[14px] leading-[20px] text-infa'>Unlimited access to copilot Thinking Pro, which uses more compute for the best answers to the hardest questions</p>
                </div>
                <div className='w-full h-fit flex items-start gap-[8px]'>
                    <span className='w-[20px] h-[20px] flex items-center justify-center text-inlightgreen'>
                        {checkIcon}
                    </span>
                    <p className='text-[14px] leading-[20px] text-infa'>Unlimited access to advanced voice</p>
                </div>
                <div className='w-full h-fit flex items-start gap-[8px]'>
                    <span className='w-[20px] h-[20px] flex items-center justify-center text-inlightgreen'>
                        {checkIcon}
                    </span>
                    <p className='text-[14px] leading-[20px] text-infa'>Extended access to deep research, reports and copilot assistance</p>
                </div>
                <div className='w-full h-fit flex items-start gap-[8px]'>
                    <span className='w-[20px] h-[20px] flex items-center justify-center text-inlightgreen'>
                        {checkIcon}
                    </span>
                    <p className='text-[14px] leading-[20px] text-infa'>Access to research preview of Operator (U.S. only)</p>
                </div>
            </div>

            <button className='w-full h-[48px] px-[12px] rounded-full bg-inf2 hover:bg-ine5 flex items-center justify-center gap-[4px] duration-150 transition-all text-in1212 disabled:bg-in2b disabled:text-in9b disabled:cursor-not-allowed mt-[48px]'>
                <p className='text-[16px] font-600 leading-[20px] tracking-normal'>Upgrade for {selectedPlan === 'pluls' ? '$19.99' : '$200.00'}</p>
            </button>
        </div>
    )
};
// helper components

// helper functions
const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    const now = new Date();
    const currentYear = now.getFullYear();

    if (year === currentYear) {
        return `${month} ${day}`;
    } else {
        return `${month} ${day}, ${year}`;
    }
};
// helper functions


// constants
const allPlans = [
    {
        title: "Samedays Plus",
        price: '$19.99 per month',
        key: 'plus'
    },
    {
        title: "Samedays Pro",
        price: '$200.00 per month',
        key: 'pro'
    },
    {
        title: "Samedays Plus",
        price: '$200.00 per year',
        key: 'yearlyPlus'
    }
]
// constants

// icons
const xIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 3.95L12.05 2.75L8 6.8L3.95 2.75L2.75 3.95L6.8 8L2.75 12.05L3.95 13.25L8 9.2L12.05 13.25L13.25 12.05L9.2 8L13.25 3.95Z"></path></svg>

const emailIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14 3H2C1.45 3 1 3.45 1 4V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V4C15 3.45 14.55 3 14 3ZM13.5 6.91L8 10.09L2.5 6.91V4.95L8 8.13L13.5 4.95V6.91Z"></path></svg>

const phoneIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4.77 11.23C6.63 13.09 8.93001 14.25 11.33 14.71C11.99 14.84 12.67 14.63 13.15 14.16L14.56 12.75C14.83 12.48 14.83 12.03 14.56 11.76L12.01 9.21001C11.74 8.94001 11.29 8.94001 11.02 9.21001L9.73001 10.5C9.51001 10.72 9.17 10.78 8.89 10.62C8.17 10.21 7.5 9.71001 6.88 9.10001C6.26 8.49001 5.77 7.81 5.36 7.09C5.21 6.82 5.26001 6.47 5.48001 6.25L6.77 4.96C7.04 4.69 7.04 4.24 6.77 3.97L4.22001 1.42C3.95001 1.15 3.50001 1.15 3.23001 1.42L1.82 2.83C1.34 3.31 1.14 3.99 1.27 4.65C1.73 7.05 2.89 9.35001 4.75 11.21L4.77 11.23Z"></path></svg>

const subscriptionIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14 3H2C1.45 3 1 3.45 1 4V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V4C15 3.45 14.55 3 14 3ZM11.1 9.1C10.93 9.27 10.72 9.35 10.5 9.35C10.28 9.35 10.06 9.27 9.9 9.1L8.85 8.05V12H7.15V8.05L6.1 9.1C5.77 9.43 5.23 9.43 4.9 9.1C4.57 8.77 4.57 8.23 4.9 7.9L8 4.8L11.1 7.9C11.43 8.23 11.43 8.77 11.1 9.1Z"></path></svg>

const usersIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M11 6.88C9.79 6.88 8.7 7.32999 7.83 8.03999C9.44 8.82999 10.69 10.26 11.22 12H16V11.88C16 9.12 13.76 6.88 11 6.88ZM5 8.88C2.24 8.88 0 11.12 0 13.88V14H10V13.88C10 11.12 7.76 8.88 5 8.88ZM5 7.75C6.1 7.75 7 6.85 7 5.75C7 4.65 6.1 3.75 5 3.75C3.9 3.75 3 4.65 3 5.75C3 6.85 3.9 7.75 5 7.75ZM11 5.75C12.1 5.75 13 4.85 13 3.75C13 2.65 12.1 1.75 11 1.75C9.9 1.75 9 2.65 9 3.75C9 4.85 9.9 5.75 11 5.75Z"></path></svg>

const chevronRightIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.1499 11.9998C5.1499 11.7798 5.2299 11.5598 5.3999 11.3998L8.7999 7.99984L5.3999 4.59984C5.0699 4.26984 5.0699 3.72984 5.3999 3.39984C5.7299 3.06984 6.2699 3.06984 6.5999 3.39984L11.1999 7.99984L6.5999 12.5998C6.2699 12.9298 5.7299 12.9298 5.3999 12.5998C5.2299 12.4298 5.1499 12.2198 5.1499 11.9998Z"></path></svg>

const editIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M7.13004 14H15V12.5H8.63004L7.13004 14ZM14.87 3.44L11.79 0.360001C11.69 0.260001 11.56 0.210007 11.44 0.210007C11.32 0.210007 11.18 0.260001 11.09 0.360001L2.73004 8.72C2.33004 9.12 2.04004 9.62999 1.89004 10.18L1.01004 13.45C0.900035 13.87 1.22004 14.26 1.63004 14.26C1.68004 14.26 1.74004 14.26 1.80004 14.24L5.07004 13.36C5.62004 13.21 6.12004 12.92 6.53004 12.52L14.89 4.16C15.09 3.96 15.09 3.65 14.89 3.45L14.87 3.44ZM5.45004 11.44C5.23004 11.66 4.96004 11.81 4.67004 11.89L2.84004 12.38L3.33004 10.55C3.41004 10.25 3.57004 9.98 3.78004 9.77L4.63004 8.92L6.30004 10.59L5.45004 11.44Z"></path></svg>

const loaderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>

const cardIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13.6 3H2.4C1.63467 3 1 3.67 1 4.5V12.5C1 13.33 1.63467 14 2.4 14H13.6C14.3653 14 15 13.33 15 12.5V4.5C15 3.67 14.3653 3 13.6 3ZM2.4 7V5H13.6V7H2.4Z"></path></svg>

const dateIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M15 5V3C15 2.45 14.55 2 14 2H13V0.75C13 0.34 12.66 0 12.25 0C11.84 0 11.5 0.34 11.5 0.75V2H4.5V0.75C4.5 0.34 4.16 0 3.75 0C3.34 0 3 0.34 3 0.75V2H2C1.45 2 1 2.45 1 3V5H15Z"></path><path d="M1 6.5V13C1 13.55 1.45 14 2 14H14C14.55 14 15 13.55 15 13V6.5H1Z"></path></svg>

const checkIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.76003 12.95L2.15003 9.34C1.82003 9.01 1.82003 8.47 2.15003 8.14C2.48003 7.81 3.02002 7.81 3.35002 8.14L5.76003 10.55L12.65 3.66C12.98 3.33 13.52 3.33 13.85 3.66C14.18 3.99 14.18 4.53 13.85 4.86L5.76003 12.95Z"></path></svg>

const sparkIcon = <svg fill='currentColor' width="50" height="50" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.4301 7H10.0001V0.779998C10.0001 0.509998 9.66011 0.370001 9.48011 0.580001L2.35011 8.5C2.18011 8.69 2.31011 9 2.57011 9H7.00011V15.22C7.00011 15.49 7.34011 15.63 7.52011 15.42L14.6501 7.5C14.8201 7.31 14.6901 7 14.4301 7Z"></path></svg>
// icons