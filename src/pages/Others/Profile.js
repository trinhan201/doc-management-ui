import { useState, useEffect } from 'react';
import ProfileForm from '~/components/Form/ProfileForm';
import * as authServices from '~/services/authServices';

const Profile = () => {
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [currUser, setCurrUser] = useState({});

    useEffect(() => {
        const fetchApi = async () => {
            const res = await authServices.getCurrUser();
            setCurrUser(res);
        };
        fetchApi();
    }, []);

    return (
        <>
            <div className="flex flex-col lg:flex-row h-full gap-8">
                <div className="flex flex-col gap-8 w-full lg:w-[320px]">
                    <div className="flex w-full lg:w-[320px] h-[320px] bg-white shadow-4Way">
                        <div className="w-[200px] h-[200px] rounded-full cursor-pointer m-auto">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                src="https://img.freepik.com/premium-vector/cute-orange-robot-cat-avatar_79416-86.jpg?w=2000"
                                alt="avatar"
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-[320px] h-fit bg-white p-[12px] shadow-4Way">
                        <div>
                            <h1 className="text-[2.2rem] font-bold mb-7">Tất cả nhiệm vụ</h1>
                            <h3 className="text-[1.4rem] font-semibold">Mức độ hoàn thành</h3>
                            <div className="w-full bg-gray-200 rounded-full mt-3">
                                <div className="w-[45%] bg-blue-600 text-[1.4rem] font-medium text-blue-100 text-center p-1.5 leading-none rounded-full">
                                    45%
                                </div>
                            </div>
                            <div className="flex justify-between mt-9">
                                <div>
                                    <h3 className="text-[1.4rem] text-white px-2 rounded-xl bg-[#cccccc]">Được giao</h3>
                                    <p className="font-semibold text-[#cccccc] text-center">6</p>
                                </div>
                                <div>
                                    <h3 className="text-[1.4rem] text-white px-2 rounded-xl bg-green-600">
                                        Hoàn thành
                                    </h3>
                                    <p className="font-semibold text-green-600 text-center">1</p>
                                </div>
                                <div>
                                    <h3 className="text-[1.4rem] text-white px-2 rounded-xl bg-red-600">
                                        Chưa hoàn thành
                                    </h3>
                                    <p className="font-semibold text-red-600 text-center">5</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="px-10 bg-white h-fit shadow-4Way">
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Họ và tên:</span>{' '}
                            <span className="flex-1">{currUser?.fullName}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Giới tính:</span>{' '}
                            <span className="flex-1">{currUser?.gender}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Ngày sinh:</span>{' '}
                            <span className="flex-1">{currUser?.birthDate}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Email:</span>{' '}
                            <span className="flex-1">{currUser?.email}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Số điện thoại:</span>{' '}
                            <span className="flex-1">{currUser?.phoneNumber}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Phòng ban:</span>{' '}
                            <span className="flex-1">{currUser?.department}</span>
                        </p>
                        <hr />
                        <p className="flex text-[1.8rem] py-[12px]">
                            <span className="mr-5 lg:mr-0 lg:w-[240px] font-bold">Vai trò:</span>{' '}
                            <span className="flex-1">{currUser?.role}</span>
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowProfileForm(true)}
                            className="w-full lg:w-fit text-[1.5rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] mt-7"
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                </div>
            </div>
            {showProfileForm && (
                <ProfileForm formTitle="Chỉnh sửa thông tin cá nhân" setShowForm={setShowProfileForm} />
            )}
        </>
    );
};

export default Profile;
