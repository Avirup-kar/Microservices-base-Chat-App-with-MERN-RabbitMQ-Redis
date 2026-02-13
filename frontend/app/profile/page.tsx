"use client";
import React, { useState } from "react";
import { useAppData, user_service } from "../context/AppContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, isAuth, loading, setUser } = useAppData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");

  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/update/name`, { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Cookies.set("token", data.token, {
          expires: 15,
          secure: false,
          path: "/",
      });
      setUser(data.user);
      setName(data.user.name);
      setIsEdit(false)
      toast.success(data.message);  
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  };

  return <div>Profile Page</div>;
};

export default ProfilePage;
