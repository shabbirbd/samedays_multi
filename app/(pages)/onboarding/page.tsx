"use client";

import { Check } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import { useToast } from '@/lib/toastContext';


const page = () => {
    const searchParams = useSearchParams();
    const defaultStage = searchParams.get('tab');
    const [stage, setStage] = useState('login');


    useEffect(() => {
        if(defaultStage && defaultStage?.length > 0) {
            setStage(defaultStage);
        } else {
            setStage('login');
        }
    }, [defaultStage]);

    const handleStage = useCallback(() => {
        if(stage === 'login') {
            history.replaceState(null, '', '/onboarding?tab=signup')
        } else {
            history.replaceState(null, '', '/onboarding');
        }
    }, [stage]);

    return (
        <div className='page'>
            <div className='page-inner relative'>
                <div className='login_container'>
                    {/* top */}
                    <div className='absolute top-0 left-0 right-0 p-[20px] tlg:p-[24px] z-[10] flex justify-end'>
                        <button className='w-fit h-[44px] tmd:h-[36px] tlg:h-[40px] px-[20px] tmd:px-[16px] flex items-center bg-white text-[#383e42] shadow-[0_1px_0_0_#16181d05,_0_0_0_1px_#16181d05,_0_1px_8px_-4px_#16181d0a,_0_4px_12px_-6px_#16181d0a,_0_1px_3px_1px_#16181d03] active:bg-[#16181d14] active:shadow-none active:text-[#16181d] duration-150 transition-all ease-out will-change-auto rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px]' onClick={handleStage} >
                            <span className='w-[24px] h-[24px] flex items-center justify-center mr-[6px] ml-[-6px]'>
                                {stage === 'login' ? userPlusIcon : userIcon}
                            </span>
                            <p className='font-500 text-[16px] tmd:text-[13px] tlg:text-[14px] txl:text-[15px] leading-[24px] tmd:leading-[18px] tlg:leading-[20px] txl:leading-[22px] tracking-[-0.01em] tmd:tracking-normal txl:tracking-[-0.01em]'>{stage === 'login' ? 'Sign up' : 'Log in'}</p>
                        </button>
                        <Link href="/" className='aspect-square h-[44px] tmd:h-[36px] tlg:h-[40px] ml-[12px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] flex items-center justify-center bg-white active:bg-[#16181d14] active:shadow-none active:text-[#16181d] text-[#383e42] active:shadow-none shadow-[0_1px_0_0_#16181d05,_0_0_0_1px_#16181d05,_0_1px_8px_-4px_#16181d0a,_0_4px_12px_-6px_#16181d0a,_0_1px_3px_1px_#16181d03]'>
                            {xIcon}
                        </Link>
                    </div>
                    {/* top */}
                    {/* login box */}
                    <div className='flex-[1_1_auto] flex absolute inset-0'>
                        <div className='flex flex-[1_1_auto] overflow-y-auto no-scrollbar'>
                            <div className='flex flex-[1_1_auto] relative'>
                                <div className='flex flex-[1_1_auto] px-[24px] pt-[64px] pb-[40px] m-auto'>
                                    <div className='flex-[1_1_auto] w-full mx-auto max-w-[380px] txl:max-w-[428px]'>
                                        <div className='bg-[#ffffffa3] p-[44px] tlg:p-[48px] rounded-[22px] tlg:rounded-[24px] flex flex-col' style={{ boxShadow: 'inset 0 1.5px 0 0 hsla(0,0%,100%,.8),0 1px 0 0 hsla(223,14%,10%,.04)' }}>
                                            {stage === 'login' && (
                                                <MainLoginBox />
                                            )}
                                            {stage === 'signup' && (
                                                <MainSignupBox />
                                            )}
                                            {stage === 'reset' && (
                                                <ResetBox />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* login box */}
                </div>
            </div>
        </div>
    )
}

export default page;


// helper components
const MainLoginBox = () => {
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [passError, setPassError] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [commonError, setCommonError] = useState('');
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const [googling, setGoogling] = useState(false);


    const handleEmailBlur = () => {
        if (email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Enter a valid email address');
            return
        } else {
            setEmailError('');
        }
    };

    const handleEmailChange = (e: any) => {
        const value = e.target.value;
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(value)) {
            setEmailError('');
        }
    };

    const handleReset = () => {
        setEmail('');
        setPassword('');
        setEmailError('');
        setPassError('');
        setCommonError('');
    };

    const handleSubmit = async () => {
        if (loading) return;
        if (email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmail('Enter a valid email address');
            return
        }
        if (password?.length < 1) {
            setPassError('Password is required');
            return
        }
        setEmailError('');
        setPassError('');
        setCommonError('');
        setLoading(true);
        const loginResponse = await signIn('credentials', {
            redirect: false,
            password: password,
            email: email
        });
        if (loginResponse?.ok) {
            setLoading(false);
            handleReset()
            window.location.href = callbackUrl || '/copilot';
        } else {
            setLoading(false);
            setCommonError('Invalid email or password');
            return
        }
    };

    const handleGoogleSignIn = async () => {
        if (googling) return;
        setGoogling(true);
        const response = await signIn('google', { callbackUrl: callbackUrl || '/copilot' });
        setGoogling(false);
    };

    return (
        <div className='w-full h-fit flex flex-col'>
            {/* logo and head */}
            <div className='w-full h-fit flex flex-col mb-[17px] tlg:mb-[20px] txl:mb-[23px] items-center'>
                <img src="/logos/same_fav_black.png" alt="samedays" className='w-[40px] h-[40px] mb-[12px] object-contain' />
                <h2 className='font-500 text-[17px] tmd:text-[16px] tlg:text-[17px] txl:text-[19px] tracking-[-0.01em] leading-[24px] tmd:leading-[21px] tlg:leading-[22px] txl:leading-[25px] text-[#2c3235]'>Log into Samedays</h2>
            </div>
            {/* logo and head */}

            {/* form */}
            <form action='submit' onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
            }} className='w-full h-hit flex flex-col'>
                {/* email */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
                    <label htmlFor="email" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Email</label>
                    <input type="email" name='email' placeholder='you@company.com' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] px-[20px] tmd:px-[12px] tlg:px-[16px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${emailError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => handleEmailBlur()} value={email} onChange={(e) => handleEmailChange(e)} />
                    {emailError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{emailError}</p>
                    )}
                </div>
                {/* email */}
                {/* password */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
                    <label htmlFor="password" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Password</label>
                    <div className='w-full h-fit relative'>
                        <input type={showPass ? 'text' : 'password'} placeholder='your password' name='password' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] pl-[20px] tmd:pl-[12px] tlg:pl-[16px] pr-[44px] tmd:pr-[40px] tlg:pr-[44px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,_0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${passError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => password?.length < 1 ? setPassError('Passwod is required') : setPassError('')} value={password} onChange={(e) => { setPassword(e.target.value); e.target?.value?.length > 0 ? setPassError('') : '' }} />
                        <button type="button" className={`w-[44px] h-full tmd:w-[36px] tlg:w-[40px] flex items-center pl-[12px] pr-[8px] tmd:pl-[0px] tmd:pr-[8px] tlg:pl-[4px] tlg:pr-[12px] duration-150 transition-all ease-out will-change-auto absolute top-0 right-0 ${showPass ? 'text-twBlue' : 'text-[#8d949a] hover:text-[#5C6073]'}`} onClick={() => setShowPass(!showPass)} >
                            {eyeIcon}
                        </button>
                    </div>
                    {passError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{passError}</p>
                    )}
                    {commonError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{commonError}</p>
                    )}
                    <button type="button" className='mt-[8px] tlg:mt-[12px] txl:mt-[11px] pb-[1px] hover:underline active:no-underline text-twBlue duration-150 transition-all ease-out will-change-auto text-[14px] leading-[20px] tracking-normal tmd:text-[12px] tmd:leading-[17px] txl:text-[13px] txl:leading-[18px] w-fit' onClick={() => history?.replaceState(null, '', '/onboarding?tab=reset')}>I forgot my password</button>
                </div>
                {/* password */}
                {/* login button */}
                <button disabled={loading} type="submit" className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] bg-twBlue shadow-[0_6px_16px_-8px_#0b2a4714,_0_4px_12px_-6px_#0b2a470f,_0_3px_8px_-4px_#0b2a470f,_0_2px_6px_-3px_#0b2a470a,_0_1px_4px_-2px_#0b2a470a,_0_1px_3px_-1px_#0b2a4705,_0_1px_2px_0_#0b2a4703,_inset 0_-1px_0_1px_#1d4b9f52,_inset_0_1px_2px_-1px_#ffffff52] text-white hover:bg-twBlueDarker hover:shadow-[0_6px_32px_-12px_#0b2a4729,_0_4px_24px_-12px_#0b2a471f,_0_4px_12px_-4px_#0b2a4714,_0_3px_8px_-3px_#0b2a470f,_0_2px_4px_-2px_#0b2a470a,_0_2px_4px_-1px_#0b2a4705,_0_1px_3px_0_#0b2a4703,_inset_0_-1px_0_1px_#143b7152,_inset_0_1px_2px_-1px_#ffffff52] active:bg-twBlueDarkest active:shadow-none duration-150 transition-all ease-out will-change-auto flex items-center justify-center disabled:bg-twBlueDisabled disabled:hover:bg-twBlueDisabled disabled:shadow-none disabled:text-[#e3e4f8]'>
                    {loading && (
                        <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                            {loaderIcon}
                        </span>
                    )}
                    <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Log in</p>
                </button>
                {/* login button */}
            </form>
            {/* form */}
            {/* or */}
            <div className='w-full h-fit relative mt-[26px] mb-[27px] tmd:mt-[15px] tmd:mb-[21px] txl:mt-[23px] txl:mb-[24px] text-center login_or text-[#5C6073] text-[14px] leading-[20px] tmd:text-[12px] tmd:leading-[17px] txl:text-[13px] txl:leading-[18px] flex whitespace-nowrap'>Or log in with</div>
            {/* or */}
            <button disabled={googling} className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] flex items-center justify-center bg-white shadow-[inset_0_-1px_0_0_#16181d0a,_inset_0_0_0_1px_#e9ecec] text-[#383e42] active:bg-[#16181d14] active:text-[#16181d] active:shadow-none hover:shadow-[inset_0_-1px_0_0_#16181d0a,_inset_0_0_0_1px_#e2e4e4] disabled:shadow-none disabled:bg-[#16181d14] disabled:hover:bg-[#16181d14] disabled:cursor-not-allowed duration-150 transition-all ease-out will-change-auto' onClick={() => handleGoogleSignIn()}>
                <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                    {googleIcon}
                </span>
                <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:tracking-normal tmd:leading-[18px] tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Google</p>
            </button>
        </div>
    )
};

const MainSignupBox = () => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [passError, setPassError] = useState('');
    const [password, setPassword] = useState('');
    const [commonError, setCommonError] = useState('');
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googling, setGoogling] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const [agreeError, setAgreeError] = useState('');


    const handleEmailBlur = () => {
        if (email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Enter a valid email address');
            return
        } else {
            setEmailError('');
        }
    };

    const handleEmailChange = (e: any) => {
        const value = e.target.value;
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(value)) {
            setEmailError('');
        }
    };

    const hashPassword = async (plainPassword: string) => {
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
        if (name?.length < 1) {
            setNameError('Full name is required');
            return
        }
        if (email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Enter a valid email address');
        }
        if (password?.length < 1) {
            setPassError('Password is required');
            return
        }
        if (password?.length < 8) {
            setPassError('Use 8+ characters for secure password')
        }
        if (!agree) {
            setAgreeError('Please, agree to the terms of services');
            return
        }
        setLoading(true);
        setNameError('');
        setPassError('');
        setAgreeError('');
        setCommonError('');
        const existingResponse = await fetch(`/api/users/${encodeURIComponent(email)}`, {
            method: 'GET'
        });
        if (existingResponse?.ok) {
            setLoading(false);
            setCommonError("An user is already exists with this email address.");
            return
        } else {
            const hashedPassword = await hashPassword(password);
            const newUser = {
                email: email,
                password: hashedPassword,
                name: name
            };
            const newResponse = await fetch(`/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newUser: newUser })
            });
            if (newResponse.ok) {
                signIn('credentials', {
                    retirect: true,
                    callbackUrl: callbackUrl || '/copilot',
                    password: password,
                    email: email
                });
                setLoading(false);
            } else {
                setCommonError('Something went wrong! Please try again.');
                setLoading(false);
                return
            }
        }
    };

    const handleGoogleSignIn = async () => {
        if (googling) return;
        setGoogling(true);
        const response = await signIn('google', { callbackUrl: callbackUrl || '/copilot' });
        setGoogling(false);
    };

    return (
        <div className='w-full h-fit flex flex-col'>
            {/* logo and head */}
            <div className='w-full h-fit flex flex-col mb-[17px] tlg:mb-[20px] txl:mb-[23px] flex items-center'>
                <img src="/logos/same_fav_black.png" alt="samedays" className='w-[40px] h-[40px] mb-[12px] object-contain' />
                <h2 className='font-500 text-[17px] tmd:text-[16px] tlg:text-[17px] txl:text-[19px] tracking-[-0.01em] leading-[24px] tmd:leading-[21px] tlg:leading-[22px] txl:leading-[25px] text-[#2c3235]'>Create Account</h2>
            </div>
            {/* logo and head */}

            {/* form */}
            <form action="submit" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }} >
                {/* name */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
                    <label htmlFor="name" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Full name</label>
                    <input type="text" name='name' placeholder='first and last name' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] px-[20px] tmd:px-[12px] tlg:px-[16px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${nameError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => { if (name?.length < 1) { setNameError('Full name is required') } else { setNameError('') } }} value={name} onChange={(e) => { setName(e.target.value); e.target?.value?.length > 0 ? setNameError('') : '' }} />
                    {nameError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{nameError}</p>
                    )}
                </div>
                {/* name */}
                {/* email */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
                    <label htmlFor="email" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Email</label>
                    <input type="email" name='email' placeholder='you@company.com' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] px-[20px] tmd:px-[12px] tlg:px-[16px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${emailError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => handleEmailBlur()} value={email} onChange={(e) => handleEmailChange(e)} />
                    {emailError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{emailError}</p>
                    )}
                </div>
                {/* email */}
                {/* password */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
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

                {/* agreement */}
                <div className='w-full h-fit mb-[25px] tmd:mb-[20px] tlg:mb-[22px] flex flex-col'>
                    <button type="button" className='w-full h-fit flex text-start' onClick={() => setAgree(!agree)}>
                        <span className={`mt-[2px] tlg:mt-[1px] txl:mt-[3px] w-[18px] h-[18px] tmd:w-[16px] tmd:w-[16px] tmd:h-[16px] shrink-0 rounded-[5px] tmd:rounded-[4px] flex items-center justify-center overflow-hidden ${agree ? 'bg-twBlue text-white shadow-[inset_0_-1px_0_0_hsla(223,14%,10%,.16)]' : 'shadow-[inset_0_-1px_0_0_hsla(223,14%,10%,.08),inset_0_0_0_1px_hsl(204,7%,85%)] bg-[white text-transparent'}`}>
                            <Check size={14} />
                        </span>
                        <p className='ml-[12px] text-[#16181d] text-[15px] leading-[22px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>I read and agree to <Link href="/privacy" target='_blank' className='duration-150 transition-all ease-out will-change-auto hover:underline text-twBlue' onClick={(e) => e.stopPropagation()}>terms & privacy policy</Link></p>
                    </button>
                    {agreeError?.length > 0 && (
                        <p className='mt-[2px] tmd:mt-[3px] tlg:mt-[2px] ml-[30px] tmd:ml-[28px] text-twRed text-[14px] leading-[20px] tracking-normal tmd:text-[12px] tmd:leading-[17px] txl:text-[13px] txl:leading-[18px]'>{agreeError}</p>
                    )}
                </div>
                {/* agreement */}

                {commonError?.length > 0 && (
                    <p className='pb-[1px] mb-[25px] tmd:mb-[20px] tlg:mb-[22px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{commonError}</p>
                )}

                {/* submit button */}
                <button disabled={loading} type="submit" className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] bg-twBlue shadow-[0_6px_16px_-8px_#0b2a4714,_0_4px_12px_-6px_#0b2a470f,_0_3px_8px_-4px_#0b2a470f,_0_2px_6px_-3px_#0b2a470a,_0_1px_4px_-2px_#0b2a470a,_0_1px_3px_-1px_#0b2a4705,_0_1px_2px_0_#0b2a4703,_inset 0_-1px_0_1px_#1d4b9f52,_inset_0_1px_2px_-1px_#ffffff52] text-white hover:bg-twBlueDarker hover:shadow-[0_6px_32px_-12px_#0b2a4729,_0_4px_24px_-12px_#0b2a471f,_0_4px_12px_-4px_#0b2a4714,_0_3px_8px_-3px_#0b2a470f,_0_2px_4px_-2px_#0b2a470a,_0_2px_4px_-1px_#0b2a4705,_0_1px_3px_0_#0b2a4703,_inset_0_-1px_0_1px_#143b7152,_inset_0_1px_2px_-1px_#ffffff52] active:bg-twBlueDarkest active:shadow-none duration-150 transition-all ease-out will-change-auto flex items-center justify-center disabled:bg-twBlueDisabled disabled:hover:bg-twBlueDisabled disabled:shadow-none disabled:text-[#e3e4f8]'>
                    {loading && (
                        <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                            {loaderIcon}
                        </span>
                    )}
                    <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Create account</p>
                </button>
                {/* submit button */}
            </form>
            {/* form */}
            {/* or */}
            <div className='w-full h-fit relative mt-[26px] mb-[27px] tmd:mt-[15px] tmd:mb-[21px] txl:mt-[23px] txl:mb-[24px] text-center login_or text-[#5C6073] text-[14px] leading-[20px] tmd:text-[12px] tmd:leading-[17px] txl:text-[13px] txl:leading-[18px] flex whitespace-nowrap'>Or sign up with</div>
            {/* or */}
            <button disabled={googling} className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] flex items-center justify-center bg-white shadow-[inset_0_-1px_0_0_#16181d0a,_inset_0_0_0_1px_#e9ecec] text-[#383e42] active:bg-[#16181d14] active:text-[#16181d] active:shadow-none hover:shadow-[inset_0_-1px_0_0_#16181d0a,_inset_0_0_0_1px_#e2e4e4] disabled:shadow-none disabled:bg-[#16181d14] disabled:hover:bg-[#16181d14] disabled:cursor-not-allowed duration-150 transition-all ease-out will-change-auto' onClick={() => handleGoogleSignIn()}>
                <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                    {googleIcon}
                </span>
                <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:tracking-normal tmd:leading-[18px] tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Google</p>
            </button>
        </div>
    )
};

const ResetBox = () => {
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const {addToast} = useToast();


    const handleEmailBlur = () => {
        if (email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Enter a valid email address');
            return
        } else {
            setEmailError('');
        }
    };

    const handleEmailChange = (e: any) => {
        const value = e.target.value;
        setEmail(value);
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(value)) {
            setEmailError('');
        }
    };


    const handleSubmit = async () => {
        if(loading) return;
        if(email?.length < 1) {
            setEmailError('Email is required');
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(email)) {
            setEmailError("Enter a valid email address");
            return
        }
        setLoading(true);
        const emailResponse = await fetch(`/api/auth/resetEmail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        });
        const data = await emailResponse.json();
        if (emailResponse.ok) {
            setLoading(false);
            history.replaceState(null, '', '/onboarding');
            addToast("We've sent you an email with instructions. If you can't see it, check your spam folder.", { type: 'success' });
        } else {
            addToast('Something went wrong', { type: 'error' });
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-fit flex flex-col'>
            {/* logo and head */}
            <div className='w-full h-fit flex flex-col mb-[17px] tlg:mb-[20px] txl:mb-[23px] flex items-center'>
                <img src="/logos/same_fav_black.png" alt="samedays" className='w-[40px] h-[40px] mb-[12px] object-contain' />
                <h2 className='font-500 text-[17px] tmd:text-[16px] tlg:text-[17px] txl:text-[19px] tracking-[-0.01em] leading-[24px] tmd:leading-[21px] tlg:leading-[22px] txl:leading-[25px] text-[#2c3235]'>Reset  Password</h2>
            </div>
            {/* logo and head */}
            {/* form */}
            <form action="submit" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }} className='w-full h-fit flex flex-col'>
                {/* email */}
                <div className='w-full h-fit mb-[16px] tlg:mb-[19px] txl:mb-[23px] flex flex-col'>
                    <label htmlFor="email" className='mb-[7px] tmd:mb-[8px] txl:mb-[7px] text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-normal sm:tracking-[-0.01em] tmd:tracking-normal font-500 text-[#5C6073]'>Email</label>
                    <input type="email" name='email' placeholder='you@company.com' className={`w-full h-[44px] tmd:h-[36px] tlg:h-[40px] px-[20px] tmd:px-[12px] tlg:px-[16px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] text-[#16181d] text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em] bg-white focus:shadow-[inset_0_0_0_1px_#275fce,0_0_0_1px_#275fce] duration-150 transition-all ease-out will-change-auto placeholder:text-[#747b81] ${emailError?.length > 0 ? 'shadow-[inset_0_0_0_1px_#e3646c]' : 'shadow-[inset_0_0_0_1px_#e2e4e4]'}`} onBlur={() => handleEmailBlur()} value={email} onChange={(e) => handleEmailChange(e)} />
                    {emailError?.length > 0 && (
                        <p className='pb-[1px] mt-[7px] tmd:mt-[6px] tlg:mt-[7px] text-twRed text-[15px] tmd:text-[12px] tlg:text-[13px] txl:text-[14px] leading-[22px] tmd:leading-[17px] tlg:leading-[18px] txl:leading-[20px] tracking-[-0.01em] tmd:tracking-normal'>{emailError}</p>
                    )}
                </div>
                {/* email */}
                {/* submit button */}
                <button disabled={loading || email?.length < 1} type="submit" className='w-full h-[44px] tmd:h-[36px] tlg:h-[40px] rounded-[9px] tmd:rounded-[7px] tlg:rounded-[8px] bg-twBlue shadow-[0_6px_16px_-8px_#0b2a4714,_0_4px_12px_-6px_#0b2a470f,_0_3px_8px_-4px_#0b2a470f,_0_2px_6px_-3px_#0b2a470a,_0_1px_4px_-2px_#0b2a470a,_0_1px_3px_-1px_#0b2a4705,_0_1px_2px_0_#0b2a4703,_inset 0_-1px_0_1px_#1d4b9f52,_inset_0_1px_2px_-1px_#ffffff52] text-white hover:bg-twBlueDarker hover:shadow-[0_6px_32px_-12px_#0b2a4729,_0_4px_24px_-12px_#0b2a471f,_0_4px_12px_-4px_#0b2a4714,_0_3px_8px_-3px_#0b2a470f,_0_2px_4px_-2px_#0b2a470a,_0_2px_4px_-1px_#0b2a4705,_0_1px_3px_0_#0b2a4703,_inset_0_-1px_0_1px_#143b7152,_inset_0_1px_2px_-1px_#ffffff52] active:bg-twBlueDarkest active:shadow-none duration-150 transition-all ease-out will-change-auto flex items-center justify-center disabled:bg-twBlueDisabled disabled:hover:bg-twBlueDisabled disabled:shadow-none disabled:text-[#e3e4f8] disabled:cursor-not-allowed'>
                    {loading && (
                        <span className='w-[24px] h-[24px] flex items-center justify-center mr-[8px] ml-[-4px]'>
                            {loaderIcon}
                        </span>
                    )}
                    <p className='font-500 text-[16px] leading-[24px] tracking-[-0.01em] tmd:text-[13px] tmd:leading-[18px] tmd:tracking-normal tlg:text-[14px] tlg:leading-[20px] txl:text-[15px] txl:leading-[22px] txl:tracking-[-0.01em]'>Send Recovery Email</p>
                </button>
                {/* submit button */}
            </form>
            {/* form */}
        </div>
    )
};
// helper components


// icons
const userPlusIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M8.5 8C8.5 6.61929 9.61929 5.5 11 5.5C12.3807 5.5 13.5 6.61929 13.5 8C13.5 9.38071 12.3807 10.5 11 10.5C9.61929 10.5 8.5 9.38071 8.5 8ZM11 4C8.79086 4 7 5.79086 7 8C7 10.2091 8.79086 12 11 12C13.2091 12 15 10.2091 15 8C15 5.79086 13.2091 4 11 4ZM8.75 13.5C6.12667 13.5 4.00006 15.6267 4 18.25C3.99999 18.6642 4.33577 19 4.74998 19C5.1642 19 5.49999 18.6642 5.5 18.25C5.50004 16.4551 6.95513 15 8.75 15H11.25C11.6642 15 12 14.6642 12 14.25C12 13.8358 11.6642 13.5 11.25 13.5H8.75ZM19.25 17.5C19.6642 17.5 20 17.1642 20 16.75C20 16.3358 19.6642 16 19.25 16H17.75C17.6119 16 17.5 15.8881 17.5 15.75V14.25C17.5 13.8358 17.1642 13.5 16.75 13.5C16.3358 13.5 16 13.8358 16 14.25V15.75C16 15.8881 15.8881 16 15.75 16H14.25C13.8358 16 13.5 16.3358 13.5 16.75C13.5 17.1642 13.8358 17.5 14.25 17.5H15.75C15.8881 17.5 16 17.6119 16 17.75V19.25C16 19.6642 16.3358 20 16.75 20C17.1642 20 17.5 19.6642 17.5 19.25V17.75C17.5 17.6119 17.6119 17.5 17.75 17.5H19.25Z" fill="currentColor"></path></svg>

const xIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.21967 7.21967c.29289-.29289.76777-.29289 1.06066 0l3.54287 3.54293c.0977.0976.2559.0976.3536 0l3.5429-3.54293c.2929-.29289.7677-.29289 1.0606 0 .2929.29289.2929.76777 0 1.06066l-3.5429 3.54287c-.0976.0977-.0976.2559 0 .3536l3.5429 3.5429c.2929.2929.2929.7677 0 1.0606-.2929.2929-.7677.2929-1.0606 0l-3.5429-3.5429c-.0977-.0976-.2559-.0976-.3536 0l-3.54287 3.5429c-.29289.2929-.76777.2929-1.06066 0s-.29289-.7677 0-1.0606l3.54293-3.5429c.0976-.0977.0976-.2559 0-.3536L7.21967 8.28033c-.29289-.29289-.29289-.76777 0-1.06066Z" clipRule="evenodd"></path></svg>

const eyeIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11.9963 9.5C11.3577 9.50095 10.7195 9.74503 10.2323 10.2322C9.25596 11.2085 9.25596 12.7915 10.2323 13.7678C11.2086 14.7441 12.7915 14.7441 13.7678 13.7678C14.7441 12.7915 14.7441 11.2085 13.7678 10.2322C13.2806 9.74503 12.6423 9.50095 12.0038 9.5C12.0013 9.5 11.9988 9.5 11.9963 9.5ZM15.7031 10.485C16.2943 11.9316 16.0027 13.6542 14.8285 14.8284C13.2664 16.3905 10.7337 16.3905 9.17161 14.8284C7.99738 13.6542 7.70582 11.9316 8.29692 10.485C7.23373 11.0757 6.22831 11.9361 5.34237 13.0768C5.0883 13.404 4.61714 13.4632 4.29 13.2091C3.96286 12.9551 3.90362 12.4839 4.15769 12.1568C6.28364 9.41941 9.11629 8 12 8C14.8838 8 17.7164 9.41941 19.8424 12.1568C20.0964 12.4839 20.0372 12.9551 19.7101 13.2091C19.3829 13.4632 18.9118 13.404 18.6577 13.0768C17.7718 11.9361 16.7663 11.0757 15.7031 10.485Z"></path></svg>

const googleIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19.68 12.181C19.681 11.6324 19.6321 11.0848 19.534 10.545H12V13.639H16.306C16.2169 14.1286 16.0295 14.5951 15.755 15.0102C15.4805 15.4252 15.1247 15.7804 14.709 16.054V18.061H17.294C18.807 16.669 19.68 14.618 19.68 12.181Z" fill="#4285F4"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.0001 20C14.1601 20 15.9721 19.283 17.2951 18.061L14.7101 16.054C13.9931 16.534 13.0771 16.818 12.0001 16.818C9.91705 16.818 8.15305 15.41 7.52405 13.52H4.85205V15.592C5.51762 16.9173 6.53859 18.0314 7.80087 18.8098C9.06316 19.5882 10.517 20.0003 12.0001 20Z" fill="#34A853"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.524 13.52C7.364 13.04 7.273 12.527 7.273 12C7.273 11.473 7.363 10.96 7.523 10.48V8.407H4.852C4.29159 9.5218 3.99981 10.7523 4 12C4 13.29 4.31 14.513 4.85 15.593L7.525 13.52H7.524Z" fill="#FBBC05"></path><path fillRule="evenodd" clipRule="evenodd" d="M12.0001 7.182C13.1751 7.182 14.2301 7.585 15.0591 8.378L17.3531 6.084C15.9681 4.793 14.1571 4 12.0011 4C10.5177 3.99906 9.06324 4.41073 7.80038 5.189C6.53753 5.96727 5.51603 7.08146 4.8501 8.407L7.5251 10.48C8.1551 8.59 9.9181 7.182 12.0021 7.182H12.0001Z" fill="#EA4335"></path></svg>

const userIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.0001 5.5C10.0671 5.5 8.50014 7.067 8.50014 9C8.50014 10.933 10.0671 12.5 12.0001 12.5C13.9331 12.5 15.5001 10.933 15.5001 9C15.5001 7.067 13.9331 5.5 12.0001 5.5ZM10.0001 9C10.0001 7.89543 10.8956 7 12.0001 7C13.1047 7 14.0001 7.89543 14.0001 9C14.0001 10.1046 13.1047 11 12.0001 11C10.8956 11 10.0001 10.1046 10.0001 9ZM7.40575 18.1142C7.20459 18.4763 6.74799 18.6068 6.3859 18.4056C6.02382 18.2045 5.89336 17.7479 6.09452 17.3858C6.7843 16.1442 7.67392 15.2844 8.70803 14.7421C9.73554 14.2032 10.8624 14 12.0001 14C13.1378 14 14.2647 14.2032 15.2922 14.7421C16.3264 15.2844 17.216 16.1442 17.9058 17.3858C18.1069 17.7479 17.9765 18.2045 17.6144 18.4056C17.2523 18.6068 16.7957 18.4763 16.5945 18.1142C16.0343 17.1058 15.3489 16.4656 14.5955 16.0704C13.8355 15.6718 12.9624 15.5 12.0001 15.5C11.0378 15.5 10.1647 15.6718 9.40474 16.0704C8.65135 16.4656 7.96598 17.1058 7.40575 18.1142Z" fill="currentColor"></path></svg>

const loaderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
// icons