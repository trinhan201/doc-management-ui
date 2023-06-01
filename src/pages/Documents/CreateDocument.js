import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import FormData from 'form-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import FileInput from '~/components/FileInput';
import * as departmentServices from '~/services/departmentServices';
import * as documentTypeServices from '~/services/documentTypeServices';
import * as documentServices from '~/services/documentServices';
import { fullNameValidator, dateValidator } from '~/utils/formValidation';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateDocument = ({ title, documentIn, path }) => {
    const [fullName, setFullName] = useState('');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');
    const [sender, setSender] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [level, setLevel] = useState('');
    const [note, setNote] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [codeErrMsg, setCodeErrMsg] = useState({});
    const [isCodeErr, setIsCodeErr] = useState(false);
    const [senderErrMsg, setSenderErrMsg] = useState({});
    const [isSenderErr, setIsSenderErr] = useState(false);
    const [sendDateErrMsg, setSendDateErrMsg] = useState({});
    const [isSendDateErr, setIsSendDateErr] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await documentServices.getDocumentById(id);
            setFullName(res.data.documentName);
            setCode(res.data.code);
            setType(res.data.type);
            setSendDate(res.data.sendDate);
            setSender(res.data.sender);
            setLevel(res.data.level);
            setCurrentLocation(res.data.currentLocation);
            setNote(res.data.note);
        };
        fetchApi();
    }, [id]);

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
            const res = await documentTypeServices.getAllDocumentType(1, 1, '');
            const documentTypeArray = res.allDocumentTypes
                ?.filter((item) => item.status !== false)
                .map((item) => item.documentTypeName);
            setDocumentTypes(documentTypeArray);
        };
        fetchApi();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isCodeValid = fullNameValidator(code, setIsCodeErr, setCodeErrMsg);
        const isSenderValid = fullNameValidator(sender, setIsSenderErr, setSenderErrMsg);
        const isDateValid = dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg);
        if (!isfullNameValid || !isCodeValid || !isSenderValid || !isDateValid) return;
        const data = {
            documentName: fullName,
            type: type,
            documentIn: documentIn,
            code: code,
            sender: sender,
            sendDate: sendDate,
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
                successNotify(res.message);
                navigate(`/documents/${path}`);
            } else {
                const data = new FormData();
                for (let i = 0; i < attachFiles.length; i++) {
                    data.append('myFile', attachFiles[i]);
                }
                await documentServices.uploadFile(res.data._id, data);
                successNotify(res.message);
                navigate(`/documents/${path}`);
            }
        } else {
            errorNotify(res);
        }
    };

    return (
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
                            className={isSendDateErr ? 'invalid' : 'default'}
                            value={sendDate}
                            setValue={setSendDate}
                            onBlur={() => dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg)}
                        />
                        <p className="text-red-600 text-[1.3rem]">{sendDateErrMsg.date}</p>
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
    );
};

export default CreateDocument;
