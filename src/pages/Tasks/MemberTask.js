import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as taskServices from '~/services/taskServices';
import * as userServices from '~/services/userServices';

const MemberTask = () => {
    const [memTaskLists, setMemTaskLists] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Còn hạn', 'Sắp đến hạn', 'Quá hạn'];

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1);
            setMemTaskLists(res.allMemberTasks);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getPublicInfo();
            setAllUsers(res.data);
        };
        fetchApi();
    }, []);
    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way">
                <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>

                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Tên công việc:</label>
                        <InputField className="default" placeholder="Tên công việc" />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Ngày bắt đầu:</label>
                        <InputField name="date" className="default leading-[1.3]" />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Ngày kết thúc:</label>
                        <InputField name="date" className="default leading-[1.3]" />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trạng thái:</label>
                        <DropList options={statusOptions} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Mức độ:</label>
                        <DropList options={levelOptions} />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="w-full md:w-[50%] text-[1.3rem] md:text-[1.6rem] text-[white] bg-red-600 mt-[20px] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                        <FontAwesomeIcon icon={faFilterCircleXmark} /> Xóa bộ lọc
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách công việc</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {memTaskLists.map((mtl, index) => {
                    return (
                        <NavLink key={index} to="/tasks/detail/123">
                            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer">
                                <h5 className="mb-2 text-[1.5rem] font-bold text-gray-900 block-ellipsis">
                                    {mtl?.taskName}
                                </h5>
                                <p className="text-[1.3rem] font-normal text-gray-700">{mtl?.dueDate}</p>
                                <hr className="my-8" />
                                <div className="flex -space-x-2">
                                    {mtl?.assignTo.slice(0, 3).map((mt, index) => {
                                        const user = allUsers.find((user) => {
                                            return user._id === mt.value;
                                        });
                                        return (
                                            <img
                                                key={index}
                                                className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                                src={
                                                    user?.avatar ||
                                                    'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                                }
                                                alt="avatar"
                                            />
                                        );
                                    })}
                                    <div
                                        className={
                                            mtl?.assignTo.length > 3
                                                ? 'hs-dropdown relative inline-flex [--placement:top-left]'
                                                : 'hidden'
                                        }
                                    >
                                        <div className="inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white font-medium text-gray-700 shadow-sm align-middle">
                                            <span className="font-medium leading-none text-[1.3rem]">
                                                +{mtl?.assignTo.length - 3}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        </>
    );
};

export default MemberTask;
