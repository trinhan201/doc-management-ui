import SwitchButton from '~/components/SwitchButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlusCircle, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import DocumentTypeCard from '~/components/Card/DocumentTypeCard';

const DocumentType = () => {
    return (
        <>
            <div className="flex items-center justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem]">Các loại văn bản</h1>
                <button className="text-[1.3rem] md:text-[1.6rem] text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]">
                    Thêm mới <FontAwesomeIcon icon={faPlusCircle} />
                </button>
            </div>
            <div class="hidden md:flex flex-col bg-white shadow-4Way">
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
                                            Loại văn bản
                                        </th>
                                        <th scope="col" class="px-6 py-4">
                                            Mã loại
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                                        <td class="whitespace-nowrap px-6 py-4">Hợp đồng</td>
                                        <td class="whitespace-nowrap px-6 py-4">HD</td>
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
                <DocumentTypeCard id="1" typeName="Hợp đồng" typeCode="HD" note="Đây là ghi chú" />
                <DocumentTypeCard id="2" typeName="Hợp đồng" typeCode="HD" note="Đây là ghi chú" />
                <DocumentTypeCard id="3" typeName="Hợp đồng" typeCode="HD" note="Đây là ghi chú" />
                <DocumentTypeCard id="3" typeName="Hợp đồng" typeCode="HD" note="Đây là ghi chú" />
                <DocumentTypeCard
                    id="3"
                    typeName="Hợp đồng"
                    typeCode="HD"
                    note="Đây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chúĐây là ghi chú"
                />
            </div>
        </>
    );
};

export default DocumentType;
