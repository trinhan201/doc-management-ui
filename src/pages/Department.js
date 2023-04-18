import SwitchButton from '~/components/SwitchButton';
import DepartmentCard from '~/components/Card/DepartmentCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const Department = () => {
    return (
        <>
            <div className="flex items-center justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Danh sách phòng ban</h1>
                <button className="text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Thêm mới <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
            <div class="hidden md:flex flex-col bg-white">
                <div class="overflow-x-auto">
                    <div class="inline-block min-w-full">
                        <div class="overflow-hidden">
                            <table class="min-w-full text-left text-[1.4rem] font-light">
                                <thead class="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" class="px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Tên phòng ban
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Trạng thái
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Ghi chú
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-b dark:border-neutral-500">
                                        <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td class="whitespace-nowrap px-6 py-4">Phòng nhân sự</td>
                                        <td class="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <SwitchButton />
                                            </div>
                                        </td>
                                        <td class="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">Đây là ghi chú</td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <DepartmentCard id="1" departmentName="Phòng nhân sự" note="Đây là ghi chú" />
                <DepartmentCard id="2" departmentName="Phòng tài chính" note="Đây là ghi chú" />
                <DepartmentCard id="3" departmentName="Phòng Marketing" note="Đây là ghi chú" />
                <DepartmentCard id="3" departmentName="Phòng IT" note="Đây là ghi chú" />
                <DepartmentCard
                    id="3"
                    departmentName="Phòng Công đoàn"
                    note="Đây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chú"
                />
            </div>
        </>
    );
};

export default Department;
