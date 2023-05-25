import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faFilterCircleXmark, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as taskServices from '~/services/taskServices';
import * as userServices from '~/services/userServices';

const AdminTasks = () => {
    const [allTaskLists, setAllTaskLists] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const userRole = JSON.parse(localStorage.getItem('userRole'));
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Còn hạn', 'Sắp đến hạn', 'Quá hạn'];

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask();
            setAllTaskLists(res.tasks);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getAllUser(1, 1, '');
            setAllUsers(res.allUsers);
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
                <div
                    className={
                        userRole === 'Member'
                            ? 'hidden'
                            : 'flex md:flex-col lg:flex-row items-center gap-5 mt-3 md:mt-0'
                    }
                >
                    <NavLink
                        to="/tasks/create"
                        className="text-[1.3rem] w-full lg:w-fit md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} /> Thêm mới
                    </NavLink>
                </div>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userRole === 'Member'
                    ? memTaskLists.map((mtl, index) => {
                          return (
                              <NavLink key={index} to="/tasks/detail/123">
                                  <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer">
                                      <h5 className="mb-2 text-[1.5rem] font-bold text-gray-900 block-ellipsis">
                                          {mtl?.taskName}
                                      </h5>
                                      <p className="text-[1.3rem] font-normal text-gray-700">{mtl?.dueDate}</p>
                                      <hr className="my-8" />
                                      <div className="text-right text-blue-600 text-[1.4rem] font-semibold">
                                          <FontAwesomeIcon icon={faArrowRight} /> Chi tiết
                                      </div>
                                  </div>
                              </NavLink>
                          );
                      })
                    : allTaskLists.map((atl, index) => {
                          return (
                              <NavLink key={index} to="/tasks/detail/123">
                                  <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 cursor-pointer">
                                      <h5 className="mb-2 text-[1.5rem] font-bold text-gray-900 block-ellipsis">
                                          {atl?.taskName}
                                      </h5>
                                      <p className="text-[1.3rem] font-normal text-gray-700">{atl?.dueDate}</p>
                                      <hr className="my-8" />
                                      <div className="flex -space-x-2">
                                          {atl?.assignTo.map((at, index) => {
                                              const user = allUsers.find((user) => {
                                                  return user._id === at;
                                              });
                                              return (
                                                  <img
                                                      key={index}
                                                      className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                                      src={
                                                          user?.avatar ||
                                                          'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                                      }
                                                      alt=""
                                                  />
                                              );
                                          })}
                                          <div className="hs-dropdown relative inline-flex [--placement:top-left]">
                                              <button
                                                  id="hs-dropdown-avatar-more"
                                                  className="hs-dropdown-toggle inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white font-medium text-gray-700 shadow-sm align-middle hover:bg-gray-300 focus:outline-none focus:bg-blue-100 focus:text-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                                              >
                                                  <span className="font-medium leading-none">9+</span>
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </NavLink>
                          );
                      })}
            </div> */}
            <div className="hidden md:flex flex-col bg-white shadow-4Way">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <div className="overflow-hidden">
                            <table className="min-w-full text-left text-[1.4rem] font-light">
                                <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className={userRole === 'Member' ? 'hidden' : 'px-6 py-4'}>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    // checked={isCheckedAll()}
                                                    // onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Tên công việc
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Tiến trình
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Đến hạn
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Người thực hiện
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {allTaskLists?.length !== 0 ? (
                                        allTaskLists?.map((atl, index) => {
                                            return (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'hidden'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                // checked={checked?.includes(dcl?._id)}
                                                                // onChange={() => handleCheck(dcl?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td
                                                        title={atl?.taskName}
                                                        className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate"
                                                    >
                                                        {atl?.taskName}
                                                    </td>
                                                    <td title={atl?.progress} className="whitespace-nowrap px-6 py-4">
                                                        <div className="bg-gray-200 rounded-full">
                                                            <div className="progress-bar percent60"></div>
                                                        </div>
                                                    </td>
                                                    <td title={atl?.dueDate} className="whitespace-nowrap px-6 py-4">
                                                        {atl?.dueDate}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex -space-x-2">
                                                            {atl?.assignTo.map((at, index) => {
                                                                const user = allUsers.find((user) => {
                                                                    return user._id === at;
                                                                });
                                                                return (
                                                                    <img
                                                                        key={index}
                                                                        className="inline-block h-[35px] w-[35px] rounded-full ring-2 ring-white"
                                                                        src={
                                                                            user?.avatar ||
                                                                            'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
                                                                        }
                                                                        alt=""
                                                                    />
                                                                );
                                                            })}
                                                            <div className="hs-dropdown relative inline-flex [--placement:top-left]">
                                                                <button
                                                                    id="hs-dropdown-avatar-more"
                                                                    className="hs-dropdown-toggle inline-flex items-center justify-center h-[35px] w-[35px] rounded-full bg-gray-200 border-2 border-white font-medium text-gray-700 shadow-sm align-middle hover:bg-gray-300 focus:outline-none focus:bg-blue-100 focus:text-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                                                                >
                                                                    <span className="font-medium leading-none">9+</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/tasks/detail/${atl?._id}`}>
                                                                <div className="flex w-[30px] h-[30px] bg-blue-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                                    <FontAwesomeIcon className="m-auto" icon={faEye} />
                                                                </div>
                                                            </NavLink>
                                                            <NavLink to={`/tasks/edit/${atl?._id}`}>
                                                                <div
                                                                    className={
                                                                        userRole === 'Member'
                                                                            ? 'hidden'
                                                                            : 'flex w-[30px] h-[30px] bg-green-600 p-2 ml-2 rounded-lg cursor-pointer hover:text-primary'
                                                                    }
                                                                >
                                                                    <FontAwesomeIcon
                                                                        className="m-auto"
                                                                        icon={faPenToSquare}
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                // onClick={() => handleDelete(dcl?._id)}
                                                                className={
                                                                    userRole === 'Member'
                                                                        ? 'hidden'
                                                                        : 'flex w-[30px] h-[30px] bg-red-600 p-2 ml-2 rounded-lg cursor-pointer hover:text-primary'
                                                                }
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
                {/* <div className="flex items-center justify-between py-3 mx-5">
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
                            Hiển thị <span>{documentLists?.length === 0 ? 0 : rowStart}</span> đến{' '}
                            <span>{rowEnd + documentLists?.length}</span> của <span>{allDocuments?.length}</span> mục
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
                </div> */}
            </div>
        </>
    );
};

export default AdminTasks;
