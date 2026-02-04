"use client"
import axios from 'axios';
import { ArrowRight, ChevronLeft, Loader2Icon, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import { useAppData, user_service } from '../context/AppContext';
import Loading from './Loading';
import toast from 'react-hot-toast';

const VerifyOtp = () => {
  const {isAuth, setIsAuth, setUser, loading: userLoading} = useAppData();
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setotp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const searchparams = useSearchParams();
  const email: string | null = searchparams.get("email");

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
       e.preventDefault();
       const enteredOtp = otp.join("");
        if(enteredOtp.length !== 6){
          setError("Please enter a valid 6-digit code");
          setLoading(false);
          return;
        }
        
       setError("");
       setLoading(true);

       try {
        const {data} = await axios.post(`${user_service}/api/v1/verify`, {email, otp: enteredOtp});
        toast.success(data.message);
        Cookies.set("token", data.token, {
          expires: 15,
          secure: false,
          path: "/",
        });
        setotp(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus();
        setUser(data.user);
        setIsAuth(true);
       } catch (error: any) {
        toast.error(error.response.data.message)
       }finally{
        setLoading(false)
       }
  }

  const hadleResend = async(e: React.FormEvent<HTMLElement>): Promise<void> => {
       e.preventDefault();
       setResendLoading(true);
       setError("");

       try {
        const { data } = await axios.post(`${user_service}/api/v1/login`, {email});
        router.push(`/verify?email=${email}`);
        toast.success(data.message);
       } catch (error: any) {
        toast.error(error.response.data.message)
       }finally{
        setResendLoading(false)
       }}

  useEffect(() => {
    if(timer > 0){
      const interval = setInterval(() => {
        setTimer((prv) => prv -1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer])


  const handelInputChange = (index: number, value: string) => {
   if(value.length > 1) return;
   const newotp = [...otp];
   newotp[index] = value;
   setotp(newotp);
   setError("");

   if(value && index < 5){
    inputRefs.current[index + 1]?.focus();
   }
  }

  const handelkeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const handelpaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);
    if(digits.length===6){
    const newOtp = digits.split("")
    setotp(newOtp)
    inputRefs.current[5]?.focus();
  }
  }
  
  
  useEffect(() => {
    if (isAuth) {
      router.push("/chat");
    }
  }, [isAuth, router]);
  
  if(userLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8 relative">
            <button onClick={() => router.push("/login")} className='cursor-pointer hover:bg-blue-600 rounded-full absolute top-0 left-0 p-2 text-gray-300 hover:text-white'><ChevronLeft className='w-6 h-6' /></button>
            <div className="mx-auto w-17 h-17 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Lock size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Verify your Email
            </h1>
            <p className="text-gray-300 text-lg">
              We have sent 6-digit code to your <span className='text-blue-600 font-medium'>{email}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Enter your 6 digit Otp here</label>
                <div className='flex justify-between mb-5'>
                  {
                  otp.map((digit, index) => (
                    <input key={index}
                    type="text" 
                    className='w-14 h-14 bg-[#333A5C] text-white text-center text-2xl rounded-md placeholder:text-2xl'
                    ref={(el: HTMLInputElement | null) => {inputRefs.current[index] = el}}
                    value={digit}
                    onChange={(e) => handelInputChange(index, e.target.value)}
                    onKeyDown={(e) => handelkeyDown(index, e)}
                    onPaste={index === 0? handelpaste: undefined}
                    />
                  ))
                  }
                </div>
            </div>
            {error && (<div className="bg-red-900 border border-red-700 rounded-lg p-3">
                 <p className="text-red-300 text-sm text-center">{error}</p>
            </div>)}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 cursor-pointer text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <div className="flex justify-center items-center gap-2">
                    <span>Verifying...</span> 
                    <Loader2Icon className="animate-spin w-5 h-5 mt-1 text-white" />
                </div>: <div className="flex justify-center items-center gap-2">
                    <span>Verify</span> 
                    <ArrowRight className="w-5 h-5 mt-1" />
                </div>}
            </button>
          </form>
          <div className="mt-6 text-center">
             <p className="text-gray-400 text-sm mb-4">Didn&apos;t receive the code?</p>
              {
              timer > 0 ? <p className="text-gray-400 text-sm">Resend code in {timer} seconds</p> 
              :
              <button onClick={hadleResend} disabled={resendLoading} className='text-blue-400 hover:text-blue-300 font-medium text-sm disabled: opacity-50'>{resendLoading? "Sending..." : "Resend Code"}</button>
              }
         </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp;
