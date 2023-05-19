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
import { useDebounce } from '~/hooks';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const DocumentType = () => {
    const [searchValue, setSearchValue] = useState('');
    const [allDocumentTypes, setAllDocumentTypes] = useState([]);
    const [documentTypeLists, setDocumentTypeLists] = useState([]);
    const [activeId, setActiveId] = useState('');
    const [isActived, setIsActived] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('documentTypeChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAllDocumentType')) || false);

    const totalPage = Math.ceil(allDocumentTypes?.length / limit);
    const debouncedValue = useDebounce(searchValue, 300);

    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + 5);
        setRowEnd(rowEnd + 5);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - 5);
        setRowEnd(rowEnd - 5);
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentTypeServices.getAllDocumentType(page, Number(limit), debouncedValue);
            setAllDocumentTypes(res.allDocumentTypes);
            setDocumentTypeLists(res.data);
        };
        fetchApi();
    }, [isSave, page, limit, debouncedValue]);

    useEffect(() => {
        if (!debouncedValue) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [debouncedValue]);

    useEffect(() => {
        if (!limit) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [limit]);

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

    const handleCheck = (id) => {
        setChecked((prev) => {
            const isChecked = checked?.includes(id);
            if (isChecked) {
                setCheckedAll(false);
                return checked?.filter((item) => item !== id);
            } else {
                if ([...prev, id].length === allDocumentTypes.length) {
                    setCheckedAll(true);
                }
                return [...prev, id];
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('documentTypeChecked', JSON.stringify(checked));
    }, [checked]);

    useEffect(() => {
        localStorage.setItem('isCheckAllDocumentType', JSON.stringify(checkedAll));
    }, [checkedAll]);

    const isCheckedAll = () => {
        return checked?.length === allDocumentTypes?.length;
    };

    useEffect(() => {
        const handleCheckAll = () => {
            const idsArray = [];
            if (checkedAll === false) {
                if (checked?.length === allDocumentTypes?.length) {
                    return setChecked([]);
                }
                return setChecked((checked) => checked);
            }
            allDocumentTypes.map((item) => {
                return idsArray.push(item._id);
            });
            setChecked(idsArray);
        };
        handleCheckAll();
    }, [checkedAll, allDocumentTypes, checked?.length]);

    const handleDelete = async (id) => {
        const confirmMsg = 'Bạn có chắc muốn xóa vĩnh viễn loại văn bản không?';
        if (!window.confirm(confirmMsg)) return;
        const res = await documentTypeServices.deleteDocumentTypeById(id);
        if (res.code === 200) {
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res);
        }
    };

    const handleDeleteMany = async () => {
        const confirmMsg = 'Bạn có chắc muốn xóa vĩnh viễn những loại văn bản này không không?';
        if (!window.confirm(confirmMsg)) return;
        const data = {
            arrayId: checked,
        };
        const res = await documentTypeServices.deleteManyDocumentType(data);
        if (res.code === 200) {
            successNotify(res.message);
            setChecked([]);
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
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
                        onClick={handleDeleteMany}
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
                <div className="inline-block min-w-full">
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
                                <th scope="col" className="px-6 py-4">
                                    STT
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Loại văn bản
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Trạng thái
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Ghi chú
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Thao tác
                                </th>
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
                                                        onChange={() => handleCheck(dtl?._id)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                            <td className="relative group whitespace-nowrap px-6 py-4 max-w-[200px]">
                                                <p className="w-[200px] truncate">{dtl?.documentTypeName}</p>
                                                <p className="absolute bottom-[100%] rounded-xl left-0 hidden bg-[#cccccc] px-6 py-4 shadow-4Way group-hover:block z-50 tooltip-bottom">
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
                                                <p className="w-[200px] truncate">{dtl?.note}</p>
                                                <p className="absolute bottom-[100%] rounded-xl left-0 hidden bg-[#cccccc] px-6 py-4 shadow-4Way group-hover:block z-50 break-words whitespace-pre-wrap tooltip-bottom">
                                                    {dtl?.note}
                                                </p>
                                            </td>
                                            <td className="px-2 py-1 md:px-6 md:py-4">
                                                <div className="flex items-center text-white">
                                                    <NavLink to={`/document-types/edit/${dtl?._id}`}>
                                                        <div className="flex w-[30px] h-[30px] bg-green-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                            <FontAwesomeIcon className="m-auto" icon={faPenToSquare} />
                                                        </div>
                                                    </NavLink>
                                                    <div
                                                        onClick={() => handleDelete(dtl?._id)}
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
                <div className="flex items-center justify-between mb-5">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isCheckedAll()}
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
                                handleDelete={() => handleDelete(dtl?._id)}
                                checkBox={checked?.includes(dtl?._id)}
                                handleCheckBox={() => handleCheck(dtl?._id)}
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
                            page <= 1
                                ? 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30'
                                : 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]'
                        }
                    >
                        Trước
                    </div>
                    <div
                        onClick={handleNextPage}
                        className={
                            page >= totalPage
                                ? 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb] pointer-events-none opacity-30'
                                : 'bg-[#cccccc] px-[8px] py-[4px] rounded-md mx-1 cursor-pointer hover:bg-[#bbbbbb]'
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
