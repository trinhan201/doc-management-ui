import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenToSquare,
    faPlusCircle,
    faTrashCan,
    faSearch,
    faAngleLeft,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import SwitchButton from '~/components/SwitchButton';
import DocumentTypeCard from '~/components/Card/DocumentTypeCard';
import InputField from '~/components/InputField';
import * as documentTypeServices from '~/services/documentTypeServices';
import { useDebounce, useFetchTasks } from '~/hooks';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { handleCheck, handleCheckAll } from '~/utils/handleCheckbox';
import { handleDelete, handleDeleteMany } from '~/utils/apiDelete';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';

const DocumentType = ({ socket }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isSave, setIsSave] = useState(false);
    //Document type state
    const [allDocumentTypes, setAllDocumentTypes] = useState([]);
    const [documentTypeLists, setDocumentTypeLists] = useState([]);
    // Activate document type state
    const [activeId, setActiveId] = useState('');
    const [isActived, setIsActived] = useState(false);
    // Pagination state
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);
    // Checkbox state
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('documentTypeChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAllDocumentType')) || false);

    const totalPage = Math.ceil(allDocumentTypes?.length / limit);
    const debouncedValue = useDebounce(searchValue, 300);
    const allTasks = useFetchTasks({ isSave });
    const tableHeader = ['STT', 'Loại văn bản', 'Trạng thái', 'Ghi chú', 'Thao tác'];

    // Go to next page
    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + 5);
        setRowEnd(rowEnd + 5);
    };

    // Back to previous page
    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - 5);
        setRowEnd(rowEnd - 5);
    };

    // Get document types from server
    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType(page, limit, debouncedValue);
            setAllDocumentTypes(res.allDocumentTypes); // all document types
            setDocumentTypeLists(res.data); // document types with filter and pagination
        };
        fetchApi();
    }, [isSave, page, limit, debouncedValue]);

    // Set pagination state to default when have filter
    useEffect(() => {
        if (debouncedValue || limit) {
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
        } else {
            return;
        }
    }, [debouncedValue, limit]);

    // Activate document type function
    useEffect(() => {
        if (!activeId) return;
        const handleActivateDocumentType = async () => {
            const data = {
                status: isActived,
            };
            const res = await documentTypeServices.activateDocumentType(activeId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleActivateDocumentType();
    }, [activeId, isActived]);

    // Save checked list in localstorage
    useEffect(() => {
        localStorage.setItem('documentTypeChecked', JSON.stringify(checked));
    }, [checked]);

    // Save checkedAll boolean in localstorage
    useEffect(() => {
        localStorage.setItem('isCheckAllDocumentType', JSON.stringify(checkedAll));
    }, [checkedAll]);

    // Check all rows of document types function
    useEffect(() => {
        handleCheckAll(checkedAll, checked?.length, allDocumentTypes, setChecked);
    }, [checkedAll, allDocumentTypes, checked?.length]);

    // Check tasks deadline function
    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            autoUpdateDeadline(allTasks, socket, setIsSave);
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, [allTasks, socket]);

    return (
        <>
            <div className="bg-white p-[16px] mb-5 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <form>
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="relative w-full">
                            <InputField
                                className="default icon"
                                placeholder="Tên loại văn bản"
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
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Các loại văn bản</h1>
                <div className="flex md:flex-col lg:flex-row items-center gap-5 mt-3 md:mt-0">
                    <button
                        onClick={() =>
                            handleDeleteMany(
                                'loại văn bản',
                                checked,
                                documentTypeServices.deleteManyDocumentType,
                                setChecked,
                                setPage,
                                setRowStart,
                                setRowEnd,
                                setIsSave,
                            )
                        }
                        className={
                            checked?.length > 1
                                ? 'text-[1.3rem] w-full lg:w-fit md:text-[1.6rem] text-[white] bg-red-600 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s] whitespace-nowrap'
                                : 'hidden'
                        }
                    >
                        <FontAwesomeIcon icon={faTrashCan} /> Xóa <span>({checked?.length})</span> mục
                    </button>
                    <NavLink
                        to="/document-types/create"
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
                                                    checked={checked?.length === allDocumentTypes?.length}
                                                    onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        {tableHeader?.map((item, index) => {
                                            return (
                                                <th key={index} scope="col" className="px-6 py-4">
                                                    {item}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {documentTypeLists?.length !== 0 ? (
                                        documentTypeLists?.map((dtl, index) => {
                                            return (
                                                <tr key={index} className="border-b dark:border-neutral-500">
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked?.includes(dtl?._id)}
                                                                onChange={() =>
                                                                    handleCheck(
                                                                        checked,
                                                                        setChecked,
                                                                        setCheckedAll,
                                                                        dtl?._id,
                                                                        allDocumentTypes,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="relative group whitespace-nowrap px-6 py-4 max-w-[200px]">
                                                        <p title={dtl?.documentTypeName} className="w-[200px] truncate">
                                                            {dtl?.documentTypeName}
                                                        </p>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <div className="flex items-center">
                                                            <SwitchButton
                                                                checked={dtl?.status}
                                                                setValue={() => setIsActived(!dtl?.status)}
                                                                setId={() => setActiveId(dtl?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="relative group whitespace-nowrap px-6 py-4 max-w-[200px]">
                                                        <p title={dtl?.note} className="w-[200px] truncate">
                                                            {dtl?.note}
                                                        </p>
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/document-types/edit/${dtl?._id}`}>
                                                                <div className="flex w-[30px] h-[30px] bg-green-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                                    <FontAwesomeIcon
                                                                        className="m-auto"
                                                                        icon={faPenToSquare}
                                                                    />
                                                                </div>
                                                            </NavLink>
                                                            <div
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        'loại văn bản',
                                                                        documentTypeServices.deleteDocumentTypeById(
                                                                            dtl?._id,
                                                                        ),
                                                                        setIsSave,
                                                                    )
                                                                }
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
                            Hiển thị <span>{documentTypeLists?.length === 0 ? 0 : rowStart}</span> đến{' '}
                            <span>{rowEnd + documentTypeLists?.length}</span> của{' '}
                            <span>{allDocumentTypes?.length}</span> mục
                        </p>
                        <div
                            onClick={handlePrevPage}
                            className={
                                page <= 1 ? 'md-page-btn hover:bg-[#dddddd] disabled' : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </div>
                        <div
                            onClick={handleNextPage}
                            className={
                                page >= totalPage
                                    ? 'md-page-btn hover:bg-[#dddddd] disabled'
                                    : 'md-page-btn hover:bg-[#dddddd]'
                            }
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-5">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={checked?.length === allDocumentTypes?.length}
                            onChange={(e) => setCheckedAll(e.target.checked)}
                        />{' '}
                        <p className="ml-3 mt-1">Chọn tất cả</p>
                    </label>
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
                {documentTypeLists?.length !== 0 ? (
                    documentTypeLists?.map((dtl, index) => {
                        return (
                            <DocumentTypeCard
                                key={index}
                                id={index + 1}
                                documentTypeId={dtl?._id}
                                documentTypeName={dtl?.documentTypeName}
                                note={dtl?.note}
                                activeValue={dtl?.status}
                                activeChecked={dtl?.status}
                                setIsActived={() => setIsActived(!dtl?.status)}
                                setActiveId={() => setActiveId(dtl?._id)}
                                handleDelete={() =>
                                    handleDelete(
                                        'loại văn bản',
                                        documentTypeServices.deleteDocumentTypeById(dtl?._id),
                                        setIsSave,
                                    )
                                }
                                checkBox={checked?.includes(dtl?._id)}
                                handleCheckBox={() =>
                                    handleCheck(checked, setChecked, setCheckedAll, dtl?._id, allDocumentTypes)
                                }
                            />
                        );
                    })
                ) : (
                    <p className="text-center p-5">Không tìm thấy dữ liệu</p>
                )}
                <div className="flex items-center justify-center">
                    <div
                        onClick={handlePrevPage}
                        className={
                            page <= 1 ? 'sm-page-btn hover:bg-[#bbbbbb] disabled' : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        Trước
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'sm-page-btn hover:bg-[#bbbbbb] disabled'
                                : 'sm-page-btn hover:bg-[#bbbbbb]'
                        }
                    >
                        Sau
                    </div>
                </div>
            </div>
        </>
    );
};

export default DocumentType;
