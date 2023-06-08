import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import FormData from 'form-data';
import Select from 'react-select';
import DropList from '~/components/DropList';
import InputField from '~/components/InputField';
import FileInput from '~/components/FileInput';
import { disabledPastDate, fullNameValidator, dateValidator } from '~/utils/formValidation';
import * as documentServices from '~/services/documentServices';
import * as taskServices from '~/services/taskServices';
import * as userServices from '~/services/userServices';
import * as notificationServices from '~/services/notificationServices';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateTask = ({ title, socket }) => {
    const [prevAssignTo, setPrevAssignTo] = useState(JSON.parse(localStorage.getItem('prevAssignTo')) || []);
    const [allUsers, setAllUsers] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [fullName, setFullName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [level, setLevel] = useState('');
    const [document, setDocument] = useState('');
    const [type, setType] = useState('');
    const [leader, setLeader] = useState();
    const [attachFiles, setAttachFiles] = useState([]);
    const [assignTo, setAssignTo] = useState([]);
    const [desc, setDesc] = useState('');
    const [resources, setResources] = useState([]);
    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isFullNameErr, setIsFullNameErr] = useState(false);
    const [deadlineErrMsg, setDeadlineErrMsg] = useState({});
    const [isDeadlineErr, setIsDeadlineErr] = useState(false);
    const [userId, setUserId] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];
    const typeOptions = ['Báo cáo', 'Tham luận', 'Kế hoạch'];

    useEffect(() => {
        const uid = JSON.parse(localStorage.getItem('userId'));
        setUserId(uid);
    }, []);

    const getUserOptions = () => {
        const options = allUsers?.map((item) => {
            return { value: item._id, label: item.fullName, flag: 'Support' };
        });
        return options;
    };

    const setUserResource = () => {
        const options = assignTo?.map((item) => {
            return { userId: item.value, resources: [], isSubmit: false };
        });
        return options;
    };

    const mergeUserResources = () => {
        const ids = new Set(resources.map((d) => d.userId));
        const merged = [...resources, ...setUserResource().filter((d) => !ids.has(d.userId))];
        return merged;
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await userServices.getAllUser(1, 1, '');
            setAllUsers(res.allUsers);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await taskServices.getTaskById(id);
            setFullName(res.data.taskName);
            setType(res.data.type);
            setDeadline(res.data.dueDate);
            setLevel(res.data.level);
            setDocument(res.data.refLink);
            setDesc(res.data.desc);
            setAssignTo(res.data.assignTo);
            setLeader(res.data.leader);
            setResources(res.data.resources);
            setPrevAssignTo(res.data.assignTo);
        };
        fetchApi();
    }, [id]);

    const getAssignToIds = (assignTo) => {
        const array = assignTo.map((item) => item.value);
        return array;
    };

    useEffect(() => {
        localStorage.setItem('prevAssignTo', JSON.stringify(prevAssignTo));
    }, [prevAssignTo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isDateValid = dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg);
        if (!isfullNameValid || !isDateValid) return;

        const data = {
            taskName: fullName,
            type: type,
            dueDate: deadline,
            level: level,
            refLink: document,
            desc: desc,
            leader: leader,
            assignTo: assignTo,
            resources: mergeUserResources(),
        };

        let res;
        if (id) {
            res = await taskServices.updateTask(id, data);
        } else {
            res = await taskServices.createTask(data);
        }
        if (res.code === 200) {
            if (attachFiles) {
                const data = new FormData();
                for (let i = 0; i < attachFiles.length; i++) {
                    data.append('myFile', attachFiles[i]);
                }
                await taskServices.uploadFile(res.data._id, data);
            }

            if (leader) {
                const data = {
                    userId: leader.value,
                    flag: 'Leader',
                };
                await taskServices.changeAssignRole(res.data._id, data);
            }
            if (!id) {
                setPrevAssignTo(res.newTask.assignTo);
                socket.current?.emit('sendNotification', {
                    senderId: userId,
                    receiverId: getAssignToIds(res.data.assignTo),
                    text: 'Bạn có nhiệm vụ mới',
                    linkTask: `http://localhost:3000/tasks/detail/${res.data._id}`,
                    isRead: false,
                });
                getAssignToIds(res.data.assignTo)?.map(async (userId) => {
                    return await notificationServices.createNotification({
                        notification: 'Bạn có nhiệm vụ mới',
                        userId: userId,
                        linkTask: `http://localhost:3000/tasks/detail/${res.data._id}`,
                    });
                });
            } else {
                const others = getAssignToIds(res.data.assignTo);
                const prev = getAssignToIds(prevAssignTo);
                const final = others.filter((item) => !prev.includes(item));
                setPrevAssignTo(res.data.assignTo);
                socket.current?.emit('sendNotification', {
                    senderId: userId,
                    receiverId: final,
                    text: 'Bạn có nhiệm vụ mới',
                    linkTask: `http://localhost:3000/tasks/detail/${res.data._id}`,
                    isRead: false,
                });
                final?.map(async (userId) => {
                    return await notificationServices.createNotification({
                        notification: 'Bạn có nhiệm vụ mới',
                        userId: userId,
                        linkTask: `http://localhost:3000/tasks/detail/${res.data._id}`,
                    });
                });
            }
            successNotify(res.message);
            navigate(-1);
        } else {
            errorNotify(res);
        }
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
                <div className="flex flex-col md:flex-row mt-7 gap-6">
                    <div className="flex-1">
                        <label className="font-bold">Ngày đến hạn:</label>
                        <InputField
                            name="datetime-local"
                            className={isDeadlineErr ? 'invalid' : 'default'}
                            value={deadline}
                            setValue={setDeadline}
                            min={disabledPastDate()}
                            onBlur={() => dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg)}
                        />
                        <p className="text-red-600 text-[1.3rem]">{deadlineErrMsg.date}</p>
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
                    <label className="font-bold">Dựa trên văn bản:</label>
                    <DropList
                        selectedValue={document}
                        options={documents}
                        setValue={setDocument}
                        setId={() => undefined}
                    />
                </div>
                <div className="flex flex-col md:flex-row mt-7 gap-6">
                    <div className="flex-1">
                        <label className="font-bold">Nhóm trưởng:</label>
                        <Select
                            placeholder="--Vui lòng chọn--"
                            options={getUserOptions()}
                            onChange={setLeader}
                            value={leader}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="font-bold">Loại:</label>
                        <DropList
                            selectedValue={type}
                            options={typeOptions}
                            setValue={setType}
                            setId={() => undefined}
                        />
                    </div>
                </div>
                <div className="mt-7">
                    <label className="font-bold">Người thực hiện:</label>
                    <Select
                        isMulti
                        placeholder="--Vui lòng chọn--"
                        options={getUserOptions()}
                        onChange={setAssignTo}
                        value={assignTo}
                    />
                </div>
                <div className="mt-7">
                    <label className="font-bold">File đính kèm:</label>
                    <FileInput setAttachFiles={setAttachFiles} />
                </div>
                <div className="mt-7">
                    <label className="font-bold">Mô tả công việc:</label>
                    <InputField
                        textarea
                        className="default textarea"
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
