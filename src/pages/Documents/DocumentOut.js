import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlusCircle,
    faAngleLeft,
    faAngleRight,
    faTrashCan,
    faPenToSquare,
    faEye,
    faFilterCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import DocumentCard from '~/components/Card/DocumentCard';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import * as documentServices from '~/services/documentServices';
import * as departmentServices from '~/services/departmentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { useDebounce, useFetchTasks } from '~/hooks';
import { handleCheck, handleCheckAll } from '~/utils/handleCheckbox';
import { handleDelete, handleDeleteMany } from '~/utils/apiDelete';
import { setLevelColor } from '~/utils/setMultiConditions';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import Loading from '~/components/Loading';

const DocumentOut = ({ socket }) => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);
    // List data state
    const [documentTypes, setDocumentTypes] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [allDocuments, setAllDocuments] = useState([]);
    const [documentLists, setDocumentLists] = useState([]);
    // Change status state
    const [documentStatus, setDocumentStatus] = useState('');
    const [statusId, setStatusId] = useState('');
    // Changen department state
    const [documentLocation, setDocumentLocation] = useState('');
    const [locationId, setLocationId] = useState('');
    // Pagination state
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const [rowStart, setRowStart] = useState(1);
    const [rowEnd, setRowEnd] = useState(0);
    // Checkbox state
    const [checked, setChecked] = useState(JSON.parse(localStorage.getItem('documentOutChecked')) || []);
    const [checkedAll, setCheckedAll] = useState(JSON.parse(localStorage.getItem('isCheckAlldocumentOut')) || false);
    // Filter input state
    const [fName, setFName] = useState('');
    const [fCode, setFCode] = useState('');
    const [fType, setFType] = useState('');
    const [fStatus, setFStatus] = useState('');
    const [fLevel, setFLevel] = useState('');
    const [fSendDate, setFSendDate] = useState('');

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const statusOptions = ['Khởi tạo', 'Đang xử lý', 'Hoàn thành'];
    const tableHeader = [
        'STT',
        'Số ký hiệu',
        'Tên văn bản',
        'Loại văn bản',
        'Mức độ',
        'Trạng thái',
        'Vị trí hiện tại',
        'Thao tác',
    ];
    const totalPage = Math.ceil(allDocuments?.length / limit);
    const nameValue = useDebounce(fName, 300);
    const codeValue = useDebounce(fCode, 300);
    const allTasks = useFetchTasks({ isSave });
    const userRole = JSON.parse(localStorage.getItem('userRole'));

    // Go to the next page
    const handleNextPage = () => {
        setPage(page + 1);
        setRowStart(rowStart + 5);
        setRowEnd(rowEnd + 5);
    };

    // Back to the previous page
    const handlePrevPage = () => {
        setPage(page - 1);
        setRowStart(rowStart - 5);
        setRowEnd(rowEnd - 5);
    };

    // Remove filter function
    const removeFilter = () => {
        setFName('');
        setFCode('');
        setFType('');
        setFStatus('');
        setFLevel('');
        setFSendDate('');
    };

    // isFilter boolean
    const isFilters = () => {
        if (fName || fCode || fType || fStatus || fLevel || fSendDate) {
            return true;
        } else {
            return false;
        }
    };

    // Get all document types from server
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

    // Get all departments from server
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

    // Get all documents from server
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await documentServices.getAllDocument(
                page,
                limit,
                false,
                nameValue,
                codeValue,
                fType,
                fStatus,
                fLevel,
                fSendDate,
            );
            if (res.code === 200) {
                setLoading(false);
                setAllDocuments(res.allDocumentOut);
                setDocumentLists(res.documents);
            } else {
                setLoading(false);
            }
        };
        fetchApi();
    }, [isSave, page, limit, nameValue, codeValue, fType, fStatus, fLevel, fSendDate]);

    // Set pagination state to default when have filter
    useEffect(() => {
        if (limit || nameValue || codeValue || fType || fStatus || fLevel || fSendDate) {
            setPage(1);
            setRowStart(1);
            setRowEnd(0);
        } else {
            return;
        }
    }, [limit, nameValue, codeValue, fType, fStatus, fLevel, fSendDate]);

    // Change document status
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

    // Change document department
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

    // Save checked list in localstorage
    useEffect(() => {
        localStorage.setItem('documentOutChecked', JSON.stringify(checked));
    }, [checked]);

    // Save checkedAll boolean in localstorage
    useEffect(() => {
        localStorage.setItem('isCheckAllDocumentOut', JSON.stringify(checkedAll));
    }, [checkedAll]);

    // Check all rows of document types function
    useEffect(() => {
        handleCheckAll(checkedAll, checked?.length, allDocuments, setChecked);
    }, [checkedAll, allDocuments, checked?.length]);

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
                        onClick={() =>
                            handleDeleteMany(
                                'văn bản đi',
                                checked,
                                documentServices.deleteManyDocument,
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
                                                    checked={checked?.length === allDocuments?.length}
                                                    onChange={(e) => setCheckedAll(e.target.checked)}
                                                />
                                            </div>
                                        </th>
                                        {tableHeader?.map((item, index) => {
                                            return (
                                                <th key={index} scope="col" className="whitespace-nowrap px-6 py-4">
                                                    {item}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="[&>*:nth-child(odd)]:bg-[#f9fafb]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center p-5">
                                                <Loading />
                                            </td>
                                        </tr>
                                    ) : documentLists?.length !== 0 ? (
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
                                                                onChange={() =>
                                                                    handleCheck(
                                                                        checked,
                                                                        setChecked,
                                                                        setCheckedAll,
                                                                        dcl?._id,
                                                                        allDocuments,
                                                                    )
                                                                }
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
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        'văn bản đi',
                                                                        documentServices.deleteDocumentById(dcl?._id),
                                                                        setIsSave,
                                                                    )
                                                                }
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
                            checked={checked?.length === allDocuments?.length}
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
                {loading ? (
                    <div className="text-center p-5">
                        <Loading />
                    </div>
                ) : documentLists?.length !== 0 ? (
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
                                handleDelete={() =>
                                    handleDelete('văn bản đi', documentServices.deleteDocumentById(dcl?._id), setIsSave)
                                }
                                checkBox={checked?.includes(dcl?._id)}
                                handleCheckBox={() =>
                                    handleCheck(checked, setChecked, setCheckedAll, dcl?._id, allDocuments)
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

export default DocumentOut;
