import { useState, useEffect } from 'react';
import {
    faPlusCircle,
    faSearch,
    faAngleLeft,
    faAngleRight,
    faTrashCan,
    faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import UserCard from '~/components/Card/UserCard';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import SwitchButton from '~/components/SwitchButton';
import * as userServices from '~/services/userServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { useDebounce } from '~/hooks';

const User = () => {
    const [searchValue, setSearchValue] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [userLists, setUserLists] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [roleId, setRoleId] = useState('');
    const [activeId, setActiveId] = useState('');
    const [isActived, setIsActived] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [pageLength, setPageLength] = useState(0);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);
    const [checked, setChecked] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);

    const roleOptions = ['Moderator', 'Member'];

    const totalPage = Math.ceil(pageLength / limit);
    const filterPages = Math.ceil((pageLength - (pageLength - userLists.length)) / limit);
    const debouncedValue = useDebounce(searchValue, 300);

    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + 5);
        setRowEnd((rowEnd) => rowEnd + 5);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - 5);
        setRowEnd((rowEnd) => rowEnd - 5);
    };

    useEffect(() => {
        const fetchApi = async () => {
            if (debouncedValue) {
                setPage(1);
                setRowStart(1);
                setRowEnd(0);
            }
            const res = await userServices.getAllUser(page, Number(limit), debouncedValue);
            if (res.data.length === 0) {
                setRowStart(0);
            }
            setAllUsers(res.allUsers);
            setUserLists(res.data);
            setPageLength(debouncedValue ? filterPages : res.usersLength);
        };
        fetchApi();
    }, [isSave, page, limit, debouncedValue, filterPages]);

    useEffect(() => {
        if (!userRole) return;
        const handleChangeRole = async () => {
            const data = {
                role: userRole,
            };
            const res = await userServices.updateRole(roleId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleChangeRole();
    }, [roleId, userRole]);

    useEffect(() => {
        if (!activeId) return;
        const handleActivateUser = async () => {
            const data = {
                isActived: isActived,
            };
            const res = await userServices.activateUser(activeId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleActivateUser();
    }, [activeId, isActived]);

    const handleCheck = (id) => {
        setChecked((prev) => {
            const isChecked = checked.includes(id);
            if (isChecked) {
                return checked.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const isCheckedAll = () => {
        if (debouncedValue) {
            return checked.length === userLists.length;
        } else {
            return checked.length === allUsers.length;
        }
    };

    useEffect(() => {
        const handleCheckAll = () => {
            const idsArray = [];
            if (checkedAll === false) return setChecked([]);
            if (debouncedValue) {
                userLists.map((item) => {
                    return idsArray.push(item._id);
                });
                setChecked(idsArray);
            } else {
                allUsers.map((item) => {
                    return idsArray.push(item._id);
                });
                setChecked(idsArray);
            }
        };
        handleCheckAll();
    }, [checkedAll, debouncedValue, allUsers, userLists]);

    const handleDelete = async (id) => {
        const confirmMsg = 'Bạn có chắc muốn xóa vĩnh viễn người dùng không?';
        if (!window.confirm(confirmMsg)) return;
        const res = await userServices.deleteUserById(id);
        if (res.code === 200) {
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res);
        }
    };

    const handleDeleteMany = async () => {
        const confirmMsg = 'Bạn có chắc muốn xóa vĩnh viễn những người dùng này không không?';
        if (!window.confirm(confirmMsg)) return;
        const data = {
            arrayId: checked,
        };
        const res = await userServices.deleteManyUser(data);
        if (res.code === 200) {
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res);
        }
    };

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <form>
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="relative w-full">
                            <InputField
                                className="default icon"
                                placeholder="Tên / Email / Số Điện Thoại"
                                value={searchValue}
                                setValue={setSearchValue}
                            />
                            <div className="flex absolute top-[50%] translate-y-[-50%] left-0 w-[45px] h-[45px]">
                                <FontAwesomeIcon className="text-[#a9a9a9] m-auto" icon={faSearch} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex flex-col md:flex-row items-center md:justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách người dùng</h1>
                <div className="flex md:flex-col lg:flex-row items-center gap-5 mt-3 md:mt-0">
                    <button
                        onClick={handleDeleteMany}
                        className={
                            checked.length > 1
                                ? 'text-[1.3rem] w-full lg:w-fit md:text-[1.6rem] text-[white] bg-red-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap'
                                : 'hidden'
                        }
                    >
                        <FontAwesomeIcon icon={faTrashCan} /> Xóa <span>({checked.length})</span> mục
                    </button>
                    <NavLink
                        to="/users/create"
                        className="text-[1.3rem] w-full lg:w-fit md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                    </NavLink>
                </div>
            </div>
            <div className="hidden md:flex flex-col bg-white shadow-4Way">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-[1.4rem] font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={isCheckedAll()}
                                                    onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Họ và tên
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Email
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Số điện thoại
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Phòng ban
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Vai trò
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {userLists.length !== 0 ? (
                                        userLists?.map((ul, index) => {
                                            return (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked.includes(ul?._id)}
                                                                onChange={() => handleCheck(ul?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">{ul?.fullName}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{ul?.email}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{ul?.phoneNumber}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">{ul?.department}</td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <DropList
                                                            selectedValue={ul?.role}
                                                            options={roleOptions}
                                                            setValue={setUserRole}
                                                            setId={() => setRoleId(ul?._id)}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <SwitchButton
                                                                checked={ul?.isActived}
                                                                setValue={() => setIsActived(!ul?.isActived)}
                                                                setId={() => setActiveId(ul?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/users/${ul._id}`}>
                                                                <div className="flex w-[30px] h-[30px] bg-green-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                                    <FontAwesomeIcon
                                                                        className="m-auto"
                                                                        icon={faPenToSquare}
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                onClick={() => handleDelete(ul?._id)}
                                                                className="flex w-[30px] h-[30px] bg-red-600 p-2 ml-2 rounded-lg cursor-pointer hover:text-primary"
                                                            >
                                                                <FontAwesomeIcon className="m-auto" icon={faTrashCan} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="text-center p-5">
                                                Không tìm thấy dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between py-3 mx-5">
                    <div className="flex items-center text-[1.5rem]">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="bg-inherit border border-[#cccccc] text-[1.5rem] rounded-[8px] block w-fit px-[14px] py-[8px] outline-none"
                        >
                            <option value={5}>5 mục</option>
                            <option value={10}>10 mục</option>
                            <option value={100}>100 mục</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <p className="text-[1.5rem] mr-9">
                            Hiển thị <span>{rowStart}</span> đến <span>{rowEnd + userLists.length}</span> của{' '}
                            <span>{debouncedValue ? userLists.length : pageLength}</span> mục
                        </p>
                        <div
                            onClick={handlePrevPage}
                            className={
                                page <= 1
                                    ? 'flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full cursor-pointer pointer-events-none opacity-30'
                                    : 'flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full cursor-pointer'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <div
                            onClick={handleNextPage}
                            className={
                                page >= totalPage
                                    ? 'flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full cursor-pointer pointer-events-none opacity-30'
                                    : 'flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full cursor-pointer'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <div className="mb-3">
                    <input type="checkbox" checked={isCheckedAll()} onChange={(e) => setCheckedAll(e.target.checked)} />{' '}
                    Chọn tất cả
                </div>
                {userLists?.map((ul, index) => {
                    return (
                        <UserCard
                            key={index}
                            id={index + 1}
                            userId={ul?._id}
                            fullName={ul?.fullName}
                            email={ul?.email}
                            phone={ul?.phoneNumber}
                            department={ul?.department}
                            active={ul?.isActived}
                            role={ul?.role}
                            setRole={setUserRole}
                            setRoleId={() => setRoleId(ul?._id)}
                            checked={ul?.isActived}
                            setIsActived={() => setIsActived(!ul?.isActived)}
                            setActiveId={() => setActiveId(ul?._id)}
                            handleDelete={() => handleDelete(ul?._id)}
                            checkBox={checked.includes(ul?._id)}
                            handleCheckBox={() => handleCheck(ul?._id)}
                        />
                    );
                })}

                <div className="flex items-center justify-center">
                    <div
                        onClick={handlePrevPage}
                        className={
                            page <= 1
                                ? 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30'
                                : 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]'
                        }
                    >
                        Prev
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30'
                                : 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]'
                        }
                    >
                        Next
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;
