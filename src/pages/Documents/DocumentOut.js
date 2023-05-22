import { useState, useEffect } from 'react';
import {
    faPlusCircle,
    faAngleLeft,
    faAngleRight,
    faTrashCan,
    faPenToSquare,
    faEye,
    faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import DocumentCard from '~/components/Card/DocumentCard';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as documentServices from '~/services/documentServices';
import * as departmentServices from '~/services/departmentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { useDebounce } from '~/hooks';

const DocumentOut = () => {
    const [documentTypes, setDocumentTypes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [documentLists, setDocumentLists] = useState([]);
    const [documentStatus, setDocumentStatus] = useState('');
    const [statusId, setStatusId] = useState('');
    const [documentLocation, setDocumentLocation] = useState('');
    const [locationId, setLocationId] = useState('');
    const [isSave, setIsSave] = useState(false);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('documentOutChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAlldocumentOut')) || false);

    const [fName, setFName] = useState('');
    const [fCode, setFCode] = useState('');
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fLevel, setFLevel] = useState('');
    const [fSendDate, setFSendDate] = useState('');

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const totalPage = Math.ceil(allDocuments?.length / limit);
    const nameValue = useDebounce(fName, 300);
    const codeValue = useDebounce(fCode, 300);
    const userRole = JSON.parse(localStorage.getItem('userRole'));

    const setLevelColor = (level) => {
        if (level === 'Ưu tiên') {
            return 'level priority';
        } else if (level === 'Khẩn cấp') {
            return 'level emergency';
        } else {
            return 'level normal';
        }
    };

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
            const res = await documentTypeServices.getAllDocumentType(1, 1, '');
            const documentTypeArray = res.allDocumentTypes
                ?.filter((item) => item.status !== false)
                .map((item) => item.documentTypeName);
            setDocumentTypes(documentTypeArray);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await departmentServices.getAllDepartment(1, 1, '');
            const departmentArray = res.allDepartments
                ?.filter((item) => item.status !== false)
                .map((item) => item.departmentName);
            setDepartments(departmentArray);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(
                page,
                Number(limit),
                false,
                nameValue,
                codeValue,
                fType,
                fStatus,
                fLevel,
                fSendDate,
            );
            setAllDocuments(res.allDocumentOut);
            setDocumentLists(res.documents);
        };
        fetchApi();
    }, [isSave, page, limit, nameValue, codeValue, fType, fStatus, fLevel, fSendDate]);

    console.log(documentLists);
    console.log(allDocuments);

    const removeFilter = () => {
        setFName('');
        setFCode('');
        setFType('');
        setFStatus('');
        setFLevel('');
        setFSendDate('');
    };

    const isFilters = () => {
        if (fName || fCode || fType || fStatus || fLevel || fSendDate) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        if (!limit) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [limit]);

    useEffect(() => {
        if (!nameValue) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [nameValue]);

    useEffect(() => {
        if (!codeValue) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [codeValue]);

    useEffect(() => {
        if (!fType) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [fType]);

    useEffect(() => {
        if (!fStatus) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [fStatus]);

    useEffect(() => {
        if (!fLevel) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [fLevel]);

    useEffect(() => {
        if (!fSendDate) return;
        setPage(1);
        setRowStart(1);
        setRowEnd(0);
    }, [fSendDate]);

    useEffect(() => {
        if (!documentStatus) return;
        const handleChangeStatus = async () => {
            const data = {
                documentStatus: documentStatus,
            };
            const res = await documentServices.changeDocumentStatus(statusId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleChangeStatus();
    }, [statusId, documentStatus]);

    useEffect(() => {
        if (!documentLocation) return;
        const handleChangeLocation = async () => {
            const data = {
                documentLocation: documentLocation,
            };
            const res = await documentServices.changeDocumentLocation(locationId, data);
            if (res.code === 200) {
                successNotify(res.message);
                setIsSave((isSave) => !isSave);
            } else {
                errorNotify(res);
            }
        };
        handleChangeLocation();
    }, [locationId, documentLocation]);

    const handleCheck = (id) => {
        setChecked((prev) => {
            const isChecked = checked?.includes(id);
            if (isChecked) {
                setCheckedAll(false);
                return checked?.filter((item) => item !== id);
            } else {
                if ([...prev, id].length === allDocuments?.length) {
                    setCheckedAll(true);
                }
                return [...prev, id];
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('documentOutChecked', JSON.stringify(checked));
    }, [checked]);

    useEffect(() => {
        localStorage.setItem('isCheckAllDocumentOut', JSON.stringify(checkedAll));
    }, [checkedAll]);

    const isCheckedAll = () => {
        return checked?.length === allDocuments?.length;
    };

    useEffect(() => {
        const handleCheckAll = () => {
            const idsArray = [];
            if (checkedAll === false) {
                if (checked?.length === allDocuments?.length) {
                    return setChecked([]);
                }
                return setChecked((checked) => checked);
            }
            allDocuments.map((item) => {
                return idsArray.push(item._id);
            });
            setChecked(idsArray);
        };
        handleCheckAll();
    }, [checkedAll, allDocuments, checked?.length]);

    const handleDelete = async (id) => {
        const confirmMsg = 'Bạn có chắc muốn xóa văn bản này không?';
        if (!window.confirm(confirmMsg)) return;
        const res = await documentServices.deleteDocumentById(id);
        if (res.code === 200) {
            successNotify(res.message);
            setIsSave((isSave) => !isSave);
        } else {
            errorNotify(res);
        }
    };

    const handleDeleteMany = async () => {
        const confirmMsg = 'Bạn có chắc muốn xóa những văn bản này không?';
        if (!window.confirm(confirmMsg)) return;
        const data = {
            arrayId: checked,
        };
        const res = await documentServices.deleteManyDocument(data);
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
                <h1 className="text-[2rem] md:text-[2.4rem] font-bold">Tìm kiếm</h1>
                <div className="flex flex-col md:flex-row gap-5 mt-5">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Tên văn bản:</label>
                        <InputField className="default" placeholder="Tên văn bản" value={fName} setValue={setFName} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Số ký hiệu:</label>
                        <InputField className="default" placeholder="Số ký hiệu" value={fCode} setValue={setFCode} />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Ngày ban hành:</label>
                        <InputField
                            name="date"
                            className="default leading-[1.3]"
                            value={fSendDate}
                            setValue={setFSendDate}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-5 mt-[12.5px]">
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Loại văn bản:</label>
                        <DropList
                            selectedValue={fType}
                            options={documentTypes}
                            setValue={setFType}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Trạng thái:</label>
                        <DropList
                            selectedValue={fStatus}
                            options={statusOptions}
                            setValue={setFStatus}
                            setId={() => undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[1.4rem]">Mức độ:</label>
                        <DropList
                            selectedValue={fLevel}
                            options={levelOptions}
                            setValue={setFLevel}
                            setId={() => undefined}
                        />
                    </div>
                </div>
                <div className={isFilters() ? 'flex justify-center' : 'hidden'}>
                    <button
                        onClick={removeFilter}
                        className="w-full md:w-[50%] text-[1.3rem] md:text-[1.6rem] text-[white] bg-red-600 mt-[20px] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faFilterCircleXmark} /> Xóa bộ lọc
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:justify-between bg-[#f7f7f7] p-[16px] border border-solid border-[#cccccc] mb-[12px] md:mb-0 shadow-4Way">
                <h1 className="text-[1.8rem] md:text-[2.4rem] font-bold">Danh sách văn bản đi</h1>
                <div
                    className={
                        userRole === 'Member'
                            ? 'hidden'
                            : 'flex md:flex-col lg:flex-row items-center gap-5 mt-3 md:mt-0'
                    }
                >
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
                        to="/documents/documents-out/create"
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
                                        <th scope="col" className={userRole === 'Member' ? 'hidden' : 'px-6 py-4'}>
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
                                            Số ký hiệu
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
                                            Vị trí hiện tại
                                        </th>
                                        <th scope="col" className="whitespace-nowrap px-6 py-4">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {documentLists?.length !== 0 ? (
                                        documentLists?.map((dcl, index) => {
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
                                                                checked={checked?.includes(dcl?._id)}
                                                                onChange={() => handleCheck(dcl?._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td title={dcl?.code} className="whitespace-nowrap px-6 py-4">
                                                        {dcl?.code}
                                                    </td>
                                                    <td
                                                        title={dcl?.documentName}
                                                        className="whitespace-nowrap px-6 py-4 max-w-[1px] truncate"
                                                    >
                                                        {dcl?.documentName}
                                                    </td>
                                                    <td title={dcl?.type} className="whitespace-nowrap px-6 py-4">
                                                        {dcl?.type}
                                                    </td>

                                                    <td title={dcl?.level} className="whitespace-nowrap px-6 py-4">
                                                        <div className={setLevelColor(dcl?.level)}>{dcl?.level}</div>
                                                    </td>
                                                    <td
                                                        title={dcl?.status}
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'pointer-events-none opacity-50 whitespace-nowrap px-6 py-4'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <DropList
                                                            selectedValue={dcl?.status}
                                                            options={statusOptions}
                                                            setValue={setDocumentStatus}
                                                            setId={() => setStatusId(dcl?._id)}
                                                        />
                                                    </td>
                                                    <td
                                                        title={dcl?.currentLocation}
                                                        className={
                                                            userRole === 'Member'
                                                                ? 'pointer-events-none opacity-50 whitespace-nowrap px-6 py-4'
                                                                : 'whitespace-nowrap px-6 py-4'
                                                        }
                                                    >
                                                        <DropList
                                                            selectedValue={dcl?.currentLocation}
                                                            options={departments}
                                                            setValue={setDocumentLocation}
                                                            setId={() => setLocationId(dcl?._id)}
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 md:px-6 md:py-4">
                                                        <div className="flex items-center text-white">
                                                            <NavLink to={`/documents/detail/${dcl?._id}`}>
                                                                <div className="flex w-[30px] h-[30px] bg-blue-600 p-2 rounded-lg cursor-pointer hover:text-primary">
                                                                    <FontAwesomeIcon className="m-auto" icon={faEye} />
                                                                </div>
                                                            </NavLink>
                                                            <NavLink to={`/documents/documents-out/edit/${dcl?._id}`}>
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
                                                                onClick={() => handleDelete(dcl?._id)}
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
                {documentLists?.length !== 0 ? (
                    documentLists?.map((dcl, index) => {
                        return (
                            <DocumentCard
                                key={index}
                                id={index + 1}
                                documentId={dcl?._id}
                                path="documents-out/edit"
                                code={dcl?.code}
                                docName={dcl?.documentName}
                                type={dcl?.type}
                                level={dcl?.level}
                                levelClass={setLevelColor(dcl?.level)}
                                statusValue={dcl?.status}
                                setStatusValue={setDocumentStatus}
                                setStatusId={() => setStatusId(dcl?._id)}
                                locationValue={dcl?.currentLocation}
                                setLocationValue={setDocumentLocation}
                                setLocationId={() => setLocationId(dcl?._id)}
                                locationOptions={departments}
                                handleDelete={() => handleDelete(dcl?._id)}
                                checkBox={checked?.includes(dcl?._id)}
                                handleCheckBox={() => handleCheck(dcl?._id)}
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

export default DocumentOut;
