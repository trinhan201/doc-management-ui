import { useState } from 'react';
import {
    faPlusCircle,
    faAngleLeft,
    faAngleRight,
    faTrashCan,
    faPenToSquare,
    faEye,
    faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DocumentCard from '~/components/Card/DocumentCard';
import DropList from '~/components/DropList';

import InputField from '~/components/InputField';

const DocumentOut = () => {
    const [docName, setDocName] = useState('');
    const [code, setCode] = useState('');
    const [createDate, setCreateDate] = useState('');

    const typeOptions = ['Hợp đồng', 'Thông báo', 'Khiếu nại'];
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const departmentOptions = ['Phòng nhân sự', 'Phòng IT', 'Phòng hành chính'];
    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way">
                <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <form>
                    <div className="flex flex-col md:flex-row gap-5 mt-5">
                        <div className="flex-1">
                            <label className="text-[1.4rem]">Tên văn bản:</label>
                            <InputField
                                className="default"
                                placeholder="Tên văn bản"
                                value={docName}
                                setValue={setDocName}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[1.4rem]">Mã văn bản:</label>
                            <InputField className="default" placeholder="Mã văn bản" value={code} setValue={setCode} />
                        </div>
                        <div className="flex-1">
                            <label className="text-[1.4rem]">Ngày tạo:</label>
                            <InputField
                                name="date"
                                className="default leading-[1.3]"
                                value={createDate}
                                setValue={setCreateDate}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                        <div className="flex-1">
                            <label className="text-[1.4rem]">Loại văn bản:</label>
                            <DropList options={typeOptions} />
                        </div>
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
                        <button className="w-full md:w-[50%] text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] mt-[20px] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                            Tìm kiếm <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </form>
            </div>
            <div className="flex items-center justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Danh sách văn bản đi</h1>
                <button className="text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Thêm mới <FontAwesomeIcon icon={faPlusCircle} />
                </button>
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
                                                <input type="checkbox" />
                                            </div>
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            STT
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Mã văn bản
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Tên văn bản
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Loại văn bản
                                        </th>

                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Mức độ
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Ghi chú
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Vị trí hiện tại
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td className="whitespace-nowrap px-6 py-4">HD00001</td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">Hợp đồng</td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-white text-[1.3rem] font-semibold text-center bg-[#cccccc] p-1 rounded-lg">
                                                Bình thường
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DropList options={statusOptions} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Đây là ghi chú
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <DropList options={departmentOptions} />
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td className="whitespace-nowrap px-6 py-4">HD00001</td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">Hợp đồng</td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-white text-[1.3rem] font-semibold text-center bg-green-700 p-1 rounded-lg">
                                                Ưu tiên
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DropList options={statusOptions} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Đây là ghi chú
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <DropList options={departmentOptions} />
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td className="whitespace-nowrap px-6 py-4">HD00001</td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">Hợp đồng</td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-white text-[1.3rem] font-semibold text-center bg-red-600 p-1 rounded-lg">
                                                Khẩn cấp
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DropList options={statusOptions} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Đây là ghi chú
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <DropList options={departmentOptions} />
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td className="whitespace-nowrap px-6 py-4">HD00001</td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">Hợp đồng</td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-white text-[1.3rem] font-semibold text-center bg-red-600 p-1 rounded-lg">
                                                Khẩn cấp
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DropList options={statusOptions} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Đây là ghi chú
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <DropList options={departmentOptions} />
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="border-b dark:border-neutral-500">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <input type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 font-medium">1</td>
                                        <td className="whitespace-nowrap px-6 py-4">HD00001</td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">Hợp đồng</td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-white text-[1.3rem] font-semibold text-center bg-red-600 p-1 rounded-lg">
                                                Khẩn cấp
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <DropList options={statusOptions} />
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate">
                                            Đây là ghi chú
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <DropList options={departmentOptions} />
                                            </div>
                                        </td>
                                        <td className="px-2 py-1 md:px-6 md:py-4">
                                            <div className="flex items-center">
                                                <div className="cursor-pointer hover:text-primary">
                                                    <FontAwesomeIcon icon={faEye} />
                                                </div>
                                                <div className="ml-2 cursor-pointer hover:text-primary">
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
                <div className="flex items-center justify-end py-3 mr-2">
                    <p className="text-[1.5rem] mr-9">1-5 of 9</p>
                    <div className="flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full pointer-events-none opacity-30">
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </div>
                    <div className="flex items-center justify-center w-[35px] h-[35px] hover:bg-[#dddddd] rounded-full">
                        <FontAwesomeIcon icon={faAngleRight} />
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <div className="mb-3">
                    <input type="checkbox" /> Chọn tất cả
                </div>
                <DocumentCard
                    id="1"
                    code="HD00001"
                    docName="Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè"
                    docType="Hợp đồng"
                    level="Bình thường"
                    note="Đây là ghi chú"
                />
                <DocumentCard
                    id="1"
                    code="HD00001"
                    docName="Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè"
                    docType="Hợp đồng"
                    level="Bình thường"
                    note="Đây là ghi chú"
                />
                <DocumentCard
                    id="1"
                    code="HD00001"
                    docName="Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè"
                    docType="Hợp đồng"
                    level="Bình thường"
                    note="Đây là ghi chú"
                />
                <DocumentCard
                    id="1"
                    code="HD00001"
                    docName="Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè"
                    docType="Hợp đồng"
                    level="Bình thường"
                    note="Đây là ghi chú"
                />
                <DocumentCard
                    id="1"
                    code="HD00001"
                    docName="Hợp đồng mua cơ sở vật chất cho bệnh viện Nhà bè"
                    docType="Hợp đồng"
                    level="Bình thường"
                    note="Đây là ghi chú"
                />
                <div className="flex items-center justify-center">
                    <div className="bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30">
                        Prev
                    </div>
                    <div className="bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]">
                        Next
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentOut;
