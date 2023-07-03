import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import FormData from 'form-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import FileInput from '~/components/FileInput';
import * as departmentServices from '~/services/departmentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import * as documentServices from '~/services/documentServices';
import { fullNameValidator, dateValidator } from '~/utils/formValidation';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks } from '~/hooks';
import Loading from '~/components/Loading';

const CreateDocument = ({ title, inputLabel, documentIn, path, socket }) => {
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);
    // Input state
    const [fullName, setFullName] = useState('');
    const [number, setNumber] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');
    const [sender, setSender] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [level, setLevel] = useState('Bình thường');
    const [note, setNote] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    // Input validation state
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [numberErrMsg, setNumberErrMsg] = useState({});
    const [isNumberErr, setIsNumberErr] = useState(false);
    const [sendDateErrMsg, setSendDateErrMsg] = useState({});
    const [isSendDateErr, setIsSendDateErr] = useState(false);
    const [codeErrMsg, setCodeErrMsg] = useState({});
    const [isCodeErr, setIsCodeErr] = useState(false);
    const [senderErrMsg, setSenderErrMsg] = useState({});
    const [isSenderErr, setIsSenderErr] = useState(false);
    const [issuedDateErrMsg, setIssuedDateErrMsg] = useState({});
    const [isIssuedDateErr, setIsIssuedDateErr] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const allTasks = useFetchTasks({ isSave });
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];

    // Create or edit document function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isNumberValid = fullNameValidator(number, setIsNumberErr, setNumberErrMsg);
        const isSendDateValid = dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg);
        const isCodeValid = fullNameValidator(code, setIsCodeErr, setCodeErrMsg);
        const isSenderValid = fullNameValidator(sender, setIsSenderErr, setSenderErrMsg);
        const isIssuedDateValid = dateValidator(issuedDate, setIsIssuedDateErr, setIssuedDateErrMsg);
        if (
            !isfullNameValid ||
            !isNumberValid ||
            !isSendDateValid ||
            !isCodeValid ||
            !isSenderValid ||
            !isIssuedDateValid
        )
            return;
        setLoading(true);
        const data = {
            documentName: fullName,
            number: number,
            sendDate: sendDate,
            type: type,
            documentIn: documentIn,
            code: code,
            sender: sender,
            issuedDate: issuedDate,
            level: level,
            note: note,
            currentLocation: currentLocation,
        };
        let res;
        if (id) {
            res = await documentServices.updateDocument(id, data);
        } else {
            res = await documentServices.createDocument(data);
        }
        if (res.code === 200) {
            if (!attachFiles) {
                setLoading(false);
                successNotify(res.message);
                navigate(`/documents/${path}`);
            } else {
                const data = new FormData();
                for (let i = 0; i < attachFiles.length; i++) {
                    data.append('myFile', attachFiles[i]);
                }
                await documentServices.uploadFile(res.data._id, data);
                setLoading(false);
                successNotify(res.message);
                navigate(`/documents/${path}`);
            }
        } else {
            setLoading(false);
            errorNotify(res);
        }
    };

    // Get available document data when edit document
    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await documentServices.getDocumentById(id);
            setFullName(res.data.documentName);
            setNumber(res.data.number);
            setSendDate(res.data.sendDate);
            setCode(res.data.code);
            setType(res.data.type);
            setIssuedDate(res.data.issuedDate);
            setSender(res.data.sender);
            setLevel(res.data.level);
            setCurrentLocation(res.data.currentLocation);
            setNote(res.data.note);
        };
        fetchApi();
    }, [id]);

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
            <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
                <h1 className="text-[2rem] font-bold">{title}</h1>
                <form>
                    <input type="hidden" value={documentIn} />
                    <div className="mt-8">
                        <label className="font-bold">Tên văn bản:</label>
                        <InputField
                            id="docName"
                            className={isFullNameErr ? 'invalid' : 'default'}
                            placeholder="Tên văn bản"
                            value={fullName}
                            setValue={setFullName}
                            onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                        />
                        <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-7">
                        <div className="flex-1">
                            <label className="font-bold">Số {inputLabel}:</label>
                            <InputField
                                id="number"
                                className={isNumberErr ? 'invalid' : 'default'}
                                placeholder={`Số ${inputLabel}`}
                                value={number}
                                setValue={setNumber}
                                onBlur={() => fullNameValidator(number, setIsNumberErr, setNumberErrMsg)}
                            />
                            <p className="text-red-600 text-[1.3rem]">{numberErrMsg.comeNumber}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">Ngày {inputLabel}:</label>
                            <InputField
                                name="date"
                                className={isSendDateErr ? 'invalid' : 'default'}
                                value={sendDate}
                                setValue={setSendDate}
                                onBlur={() => dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg)}
                            />
                            <p className="text-red-600 text-[1.3rem]">{sendDateErrMsg.inDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-7">
                        <div className="flex-1">
                            <label className="font-bold">Số ký hiệu:</label>
                            <InputField
                                id="docCode"
                                className={isCodeErr ? 'invalid' : 'default'}
                                placeholder="Số ký hiệu"
                                value={code}
                                setValue={setCode}
                                onBlur={() => fullNameValidator(code, setIsCodeErr, setCodeErrMsg)}
                            />
                            <p className="text-red-600 text-[1.3rem]">{codeErrMsg.code}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">Loại văn bản:</label>
                            <DropList
                                selectedValue={type}
                                options={documentTypes}
                                setValue={setType}
                                setId={() => undefined}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-7">
                        <div className="flex-1">
                            <label className="font-bold">Ngày ban hành:</label>
                            <InputField
                                name="date"
                                className={isIssuedDateErr ? 'invalid' : 'default'}
                                value={issuedDate}
                                setValue={setIssuedDate}
                                onBlur={() => dateValidator(issuedDate, setIsIssuedDateErr, setIssuedDateErrMsg)}
                            />
                            <p className="text-red-600 text-[1.3rem]">{issuedDateErrMsg.issuedDate}</p>
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">Nơi ban hành:</label>
                            <InputField
                                className={isSenderErr ? 'invalid' : 'default'}
                                placeholder="Nơi ban hành"
                                value={sender}
                                setValue={setSender}
                                onBlur={() => fullNameValidator(sender, setIsSenderErr, setSenderErrMsg)}
                            />
                            <p className="text-red-600 text-[1.3rem]">{senderErrMsg.sender}</p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 mt-7">
                        <div className="flex-1">
                            <label className="font-bold">Mức độ:</label>
                            <DropList
                                selectedValue={level}
                                options={levelOptions}
                                setValue={setLevel}
                                setId={() => undefined}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="font-bold">Ví trí hiện tại:</label>
                            <DropList
                                selectedValue={currentLocation}
                                options={departments}
                                setValue={setCurrentLocation}
                                setId={() => undefined}
                            />
                        </div>
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">File đính kèm:</label>
                        <FileInput setAttachFiles={setAttachFiles} />
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">Trích yếu:</label>
                        <InputField
                            textarea
                            className="default textarea"
                            rows="6"
                            cols="50"
                            placeholder="Trích yếu"
                            value={note}
                            setValue={setNote}
                        />
                    </div>
                    <div className="block md:flex items-center gap-5 mt-12">
                        <button
                            onClick={handleSubmit}
                            className="w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                        </button>
                        <NavLink
                            to={`/documents/${path}`}
                            className="block w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                        >
                            <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                        </NavLink>
                    </div>
                </form>
            </div>
            {loading && (
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#000000]/[.15] z-[999]">
                    <Loading />
                </div>
            )}
        </>
    );
};

export default CreateDocument;
