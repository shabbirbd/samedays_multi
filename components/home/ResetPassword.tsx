"use client";

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import Link from 'next/link';
import { useToast } from '@/lib/toastContext';

const ResetPassword = () => {
    const [open, setOpen] = useState(false);
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const defaultToken = searchParams.get('token');
    const [token, setToken] = useState<any>(null);
    const [showPass, setShowPass] = useState(false);
    const [password, setPassword] = useState('');
    const [passError, setPassError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();


    useEffect(() => {
        if (mode && mode === 'reset_password') {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [mode]);

    useEffect(() => {
        if (mode && mode === 'reset_password' && defaultToken && defaultToken?.length > 0) {
            setToken(defaultToken);
        }
    }, [mode, defaultToken]);

    const hashPassword = async (plainPassword) => {
        const saltRounds = 10;
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(plainPassword, salt);
            return hashedPassword;
        } catch (err) {
            throw err;
        }
    };

    const handleSubmit = async () => {
        if (loading) return;
        if (password?.length < 1) {
            setPassError('Password is required');
            return
        }
        if (password?.length < 8) {
            setPassError('Use 8+ characters for secure password');
            return
        }
        setPassError('');
        setLoading(true);
        const hashedPassword = await hashPassword(password);
        const updateResponse = await fetch(`/api/auth/changePassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token, password: hashedPassword })
        });
        if (updateResponse.ok) {
            addToast('Successfully changed password. Please login', {type: 'success'});
            setTimeout(() => {
                window.location.href = '/onboarding';
                setLoading(false);
            }, 5000);
        } else {
            const data = await updateResponse.json();
            addToast(data?.error, { type: 'error' });
            setLoading(false);
        }

    };


    if (!open || !token) {
        return null
    }

    return (
        <div className='w-screen h-screen min-h-dvh max-h-dvh fixed inset-0 z-[999999] bg-[#16181d1a] backdrop-blur-[40px] flex reset_container'>
            {/* top banner */}
            <div className='fixed z-[999999] top-0 right-0 left-0 h-[24px]'>
                <button className='w-full auth_banner_shadow block' onClick={() => history.replaceState(null, '', '/')}>
                    <div className='relative w-[148px] h-[25px] mx-auto cursor-pointer'>
                        {topBannerIcon}
                    </div>
                </button>
            </div>
            {/* top banner */}

            {/* main */}
            <div className='min-w-[0px] flex-[1_1_auto] m-auto px-[24px] pt-[64px] pb-[40px]'>
                <div className='flex-[1_1_auto] w-full mx-auto max-w-[372px] tlg:max-w-[380px] txl:max-w-[412px] flex flex-col relative z-[9]'>
                    {/* form */}
                    <div className='w-full h-fit rounded-[14px] tlg:rounded-[16px] p-[24px] tlg:p-[28px] txl:p-[32px]' style={{ background: 'linear-gradient(0deg,rgba(255,255,255,.5),rgba(255,255,255,.5)),linear-gradient(0deg,#f7f8f8,#f7f8f8)', boxShadow: 'inset 0 0 0 1px hsla(0,0%,100%,.5),0 1px 0 0 hsla(223,14%,10%,.04)' }}>
                        {/* logo and head */}
                        <div className='w-full h-fit flex flex-col items-center mb-[17px] tlg:mb-[20px] txl:mb-[23px]'>
                            <img src="/logos/same_fav_black.png" alt="samedays" className='w-[40px] h-[40px] mb-[12px] object-contain' />
                            <h2 className='font-500 text-[17px] tmd:text-[16px] tlg:text-[17px] txl:text-[19px] tracking-[-0.01em] leading-[24px] tmd:leading-[21px] tlg:leading-[22px] txl:leading-[25px] text-[#2c3235]'>Update password</h2>
                        </div>
                        {/* logo and head */}
                        <form action="submit" onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className='w-full h-fit flex flex-col'>
                            {/* password */}
                            <div className='w-full h-fit mb-[16px] tlg:mb-[19px] flex flex-col'>
                                <label htmlFor="password" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Password</label>
                                <div className='w-full h-fit relative'>
                                    <input type={showPass ? 'text' : 'password'} placeholder='at least 8 characters' name='password' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] pl-[20px] tmd:pl-[12px] tlg:pl-[16px] pr-[44px] tmd:pr-[40px] tlg:pr-[44px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,_0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${passError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => password?.length < 8 ? password?.length < 1 ? setPassError('Password is required') : setPassError('Use 8+ characters for secure password') : setPassError('')} value={password} onChange={(e) => { setPassword(e.target.value); e.target?.value?.length > 7 ? setPassError('') : '' }} />
                                    <button type="button" className={`w-[44px] h-full tmd:w-[36px] tlg:w-[40px] flex items-center pl-[12px] pr-[8px] tmd:pl-[0px] tmd:pr-[8px] tlg:pl-[4px] tlg:pr-[12px] duration-150 transition-all ease-out will-change-auto absolute top-0 right-0 ${showPass ? 'text-twBlue' : 'text-[#8d949a] hover:text-[#5C6073]'}`} onClick={() => setShowPass(!showPass)} >
                                        {eyeIcon}
                                    </button>
                                </div>
                                {passError?.length > 0 && (
                                    <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{passError}</p>
                                )}
                            </div>
                            {/* password */}
                            {/* submit button */}
                            <button disabled={loading || password?.length < 1} type="submit" className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] bg-twBlue shadow-[0_6px_16px_-8px_#0b2a4714,_0_4px_12px_-6px_#0b2a470f,_0_3px_8px_-4px_#0b2a470f,_0_2px_6px_-3px_#0b2a470a,_0_1px_4px_-2px_#0b2a470a,_0_1px_3px_-1px_#0b2a4705,_0_1px_2px_0_#0b2a4703,_inset 0_-1px_0_1px_#1d4b9f52,_inset_0_1px_2px_-1px_#ffffff52] text-white hover:bg-twBlueDarker hover:shadow-[0_6px_32px_-12px_#0b2a4729,_0_4px_24px_-12px_#0b2a471f,_0_4px_12px_-4px_#0b2a4714,_0_3px_8px_-3px_#0b2a470f,_0_2px_4px_-2px_#0b2a470a,_0_2px_4px_-1px_#0b2a4705,_0_1px_3px_0_#0b2a4703,_inset_0_-1px_0_1px_#143b7152,_inset_0_1px_2px_-1px_#ffffff52] active:bg-twBlueDarkest active:shadow-none duration-150 transition-all ease-out will-change-auto flex items-center justify-center disabled:bg-twBlueDisabled disabled:hover:bg-twBlueDisabled disabled:shadow-none disabled:text-[#e3e4f8] disabled:cursor-not-allowed'>
                                {loading && (
                                    <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                                        {loaderIcon}
                                    </span>
                                )}
                                <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Update Password</p>
                            </button>
                            {/* submit button */}
                        </form>
                    </div>
                    {/* form */}
                    {/* login button */}
                    <div className='mt-[19px] tlg:mt-[23px] txl:mt-[26px] w-full h-fit text-center'>
                        <p className='font-500 text-[13px] leading-[18px] tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] text-[#444c50]'>Remembered the password?&nbsp;<Link href="/onboarding" className='text-twBlue hover:underline active:no-underline active:text-[#1c4ba0] duration-150 transition-all ease-out' >Log in</Link></p>
                    </div>
                    {/* login button */}
                </div>
            </div>
            {/* main */}
        </div>
    )
};

export default ResetPassword;


// icons
const topBannerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="148" height="25" fill="none"><g><path fill="#fff" d="M0 4h148c-.303 0-.454 0-.599.00261-4.658.08413-9.047 2.19389-12.022 5.77826-.093.11118-.187.22943-.377.46603l-3.316 4.1453c-2.822 3.5283-4.234 5.2924-5.985 6.5622-1.552 1.125-3.294 1.9619-5.142 2.471-2.085.5746-4.345.5746-8.863.5746H36.304c-4.5184 0-6.7776 0-8.8635-.5746a16.00063 16.00063 0 0 1-5.1411-2.471c-1.7517-1.2698-3.163-3.0339-5.9856-6.5622l-3.3162-4.1452c-.1893-.2366-.284-.35495-.3762-.46613C9.64612 6.1965 5.2565 4.08674.59896 4.00261.4545 4 .303 4 0 4Z"></path></g><path fill="#51585D" fillRule="evenodd" d="M70.2803 7.21967c-.2929-.29289-.7677-.29289-1.0606 0-.2929.29289-.2929.76777 0 1.06066L72.9393 12l-3.7196 3.7197c-.2929.2929-.2929.7677 0 1.0606.2929.2929.7677.2929 1.0606 0L74 13.0607l3.7197 3.7196c.2929.2929.7677.2929 1.0606 0 .2929-.2929.2929-.7677 0-1.0606L75.0607 12l3.7196-3.71967c.2929-.29289.2929-.76777 0-1.06066s-.7677-.29289-1.0606 0L74 10.9393l-3.7197-3.71963Z" clipRule="evenodd"></path></svg>

const eyeIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.9963 9.5C11.3577 9.50095 10.7195 9.74503 10.2323 10.2322C9.25596 11.2085 9.25596 12.7915 10.2323 13.7678C11.2086 14.7441 12.7915 14.7441 13.7678 13.7678C14.7441 12.7915 14.7441 11.2085 13.7678 10.2322C13.2806 9.74503 12.6423 9.50095 12.0038 9.5C12.0013 9.5 11.9988 9.5 11.9963 9.5ZM15.7031 10.485C16.2943 11.9316 16.0027 13.6542 14.8285 14.8284C13.2664 16.3905 10.7337 16.3905 9.17161 14.8284C7.99738 13.6542 7.70582 11.9316 8.29692 10.485C7.23373 11.0757 6.22831 11.9361 5.34237 13.0768C5.0883 13.404 4.61714 13.4632 4.29 13.2091C3.96286 12.9551 3.90362 12.4839 4.15769 12.1568C6.28364 9.41941 9.11629 8 12 8C14.8838 8 17.7164 9.41941 19.8424 12.1568C20.0964 12.4839 20.0372 12.9551 19.7101 13.2091C19.3829 13.4632 18.9118 13.404 18.6577 13.0768C17.7718 11.9361 16.7663 11.0757 15.7031 10.485Z"></path></svg>

const loaderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
// icons