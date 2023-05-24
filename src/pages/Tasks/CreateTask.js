import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import FileInput from '~/components/FileInput';
import { fullNameValidator } from '~/utils/formValidation';
import * as documentServices from '~/services/documentServices';

const CreateTask = ({ title }) => {
    const [documents, setDocuments] = useState([]);
    const [fullName, setFullName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [level, setLevel] = useState('');
    const [document, setDocument] = useState('');
    const [progress, setProgress] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [desc, setDesc] = useState('');
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isFullNameErr, setIsFullNameErr] = useState(false);

    const navigate = useNavigate();
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const progressOptions = ['Khởi tạo', 'Đang xử lý', 'Chờ duyệt', 'Hoàn thành'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        if (!isfullNameValid) return;
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await documentServices.getAllDocument(1, 1, true, '', '', '', '', '', '');
            const documentArray = res.allDocumentIn
                ?.filter((item) => item.status === 'Đang xử lý')
                .map((item) => item.documentName);
            setDocuments(documentArray);
        };
        fetchApi();
    }, []);
    return (
        <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form autoComplete="on">
                <div className="mt-8">
                    <label className="font-bold">Tên công việc:</label>
                    <InputField
                        id="fullName"
                        className={isFullNameErr ? 'invalid' : 'default'}
                        placeholder="Tên công việc"
                        value={fullName}
                        setValue={setFullName}
                        onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                    />
                    <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                </div>
                <div className="flex mt-7 gap-6">
                    <div className="flex-1">
                        <label className="font-bold">Ngày đến hạn:</label>
                        <InputField name="datetime-local" className="default" value={deadline} setValue={setDeadline} />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold">Mức độ:</label>
                        <DropList
                            selectedValue={level}
                            options={levelOptions}
                            setValue={setLevel}
                            setId={() => undefined}
                        />
                    </div>
                </div>
                <div className="mt-7">
                    <label className="font-bold">Tiến trình:</label>
                    <DropList
                        selectedValue={progress}
                        options={progressOptions}
                        setValue={setProgress}
                        setId={() => undefined}
                    />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Dựa trên văn bản:</label>
                    <DropList
                        selectedValue={document}
                        options={documents}
                        setValue={setDocument}
                        setId={() => undefined}
                    />
                </div>
                {/* <div className="mt-7">
                    <label className="font-bold">Người thực hiện:</label>
                    <DropList
                    // selectedValue={department}
                    // options={departments}
                    // setValue={setDepartment}
                    // setId={() => undefined}
                    />
                </div> */}
                <div className="mt-7">
                    <label className="font-bold">File đính kèm:</label>
                    <FileInput setAttachFiles={setAttachFiles} />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Mô tả công việc:</label>
                    <InputField
                        textarea
                        className="default"
                        placeholder="Mô tả công việc"
                        rows="6"
                        cols="50"
                        value={desc}
                        setValue={setDesc}
                    />
                </div>
                <div className="block md:flex items-center gap-5 mt-12">
                    <button
                        onClick={handleSubmit}
                        className="w-full md:w-fit text-center text-[white] bg-[#321fdb] px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} /> Lưu thông tin
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate(-1);
                        }}
                        className="block w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;
