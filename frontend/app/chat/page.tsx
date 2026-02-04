"use client"
import React, { useEffect } from 'react'
import { useAppData } from '../context/AppContext'
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';

const ChatPage = () => {
  const {isAuth, loading} = useAppData();
  const router = useRouter();

  useEffect(() => {
    if(!isAuth && !loading){
      router.push("/login");
    }
  }, [isAuth, loading, router])
  
  if(loading) return <Loading />
  return (
    <div>
      chatApp
    </div>
  )
}

export default ChatPage;
