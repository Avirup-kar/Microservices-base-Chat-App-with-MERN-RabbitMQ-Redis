"use client"
import axios from 'axios';
import { ArrowRight, Loader2Icon, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const VerifyPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setotp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const searchparams = useSearchParams();
  const email: string | null = searchparams.get("email");

  const handleSubmit = async(e: React.FormEvent<HTMLElement>): Promise<void> => {
       e.preventDefault();
       setLoading(true);

       try {
        // const data = await axios.post("http://localhost:5000/api/v1/login", {});
        // router.push(`/verify?email=${email}`);
       } catch (error: any) {
        alert(error.response.data.message)
       }finally{
        setLoading(false)
       }
  }

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
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
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
                <div>
                  {
                  otp.map((digit, index) => (
                    <input key={index} type="text" 
                    ref={(el: HTMLInputElement | null) => {inputRefs.current[index] = el}}

                    />
                  ))
                  }
                </div>
            </div>
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
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
