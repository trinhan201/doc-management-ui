import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import FormData from 'form-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faXmark, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import InputField from '~/components/InputField';
import DropList from '~/components/DropList';
import FileInput from '~/components/FileInput';
import * as documentServices from '~/services/documentServices';
import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';
import * as taskTypeServices from '~/services/taskTypeServices';
import { fullNameValidator, dateValidator, dropListValidator } from '~/utils/formValidation';
import { successNotify, errorNotify } from '~/components/ToastMessage';
import { autoUpdateDeadline } from '~/helpers/autoUpdateDeadline';
import { useFetchTasks, useFetchDepartments, useFetchDocumentTypes, useFetchUsers } from '~/hooks';
import Loading from '~/components/Loading';
import SwitchButton from '~/components/SwitchButton';
import { disabledPastDate } from '~/utils/formValidation';

const CreateDocument = ({ title, inputLabel, documentIn, path, socket }) => {
    const [allTaskTypes, setAllTaskTypes] = useState([]);
    const [addType, setAddType] = useState(false);
    const [isAssigned, setAssigned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);
    // Input state
    const [fullName, setFullName] = useState('');
    const [number, setNumber] = useState('');
    const [sendDate, setSendDate] = useState('');
    const [type, setType] = useState('');
    const [newType, setNewType] = useState('');
    const [code, setCode] = useState('');
    const [sender, setSender] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [level, setLevel] = useState('Bình thường');
    const [note, setNote] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [attachFiles, setAttachFiles] = useState([]);
    const [isHaveTask, setIsHaveTask] = useState(true);
    // Task input state
    const [leader, setLeader] = useState();
    const [assignTo, setAssignTo] = useState([]);
    const [deadline, setDeadline] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskType, setTaskType] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
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
    const [currLocationErrMsg, setCurrLocationErrMsg] = useState({});
    const [isCurrLocationErr, setIsCurrLocationErr] = useState(false);
    const [deadlineErrMsg, setDeadlineErrMsg] = useState({});
    const [isDeadlineErr, setIsDeadlineErr] = useState(false);
    const [taskNameErrMsg, setTaskNameErrMsg] = useState({});
    const [isTaskNameErr, setIsTaskNameErr] = useState(false);
    const [leaderErrMsg, setLeaderErrMsg] = useState({});
    const [isLeaderErr, setIsLeaderErr] = useState(false);
    const [assignToErrMsg, setAssignToErrMsg] = useState({});
    const [isAssignToErr, setIsAssignToErr] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    const allTasks = useFetchTasks({ isSave });
    const departments = useFetchDepartments({ isActived: false });
    const documentTypes = useFetchDocumentTypes();
    const allUsers = useFetchUsers().privateUsers;
    const levelOptions = ['Bình thường', 'Ưu tiên', 'Khẩn cấp'];

    // Handle add new type
    const handleAddNewType = async () => {
        const data = {
            taskType: newType,
        };
        const res = await taskTypeServices.createTaskType(data);
        if (res.code === 200) {
            setNewType('');
            setAddType(false);
            setIsSave((isSave) => !isSave);
            successNotify(res.message);
        } else {
            errorNotify(res);
        }
    };

    // Just get id of assigned user
    const getAssignToIds = (assignTo) => {
        const array = assignTo.map((item) => item.value);
        return array;
    };

    // Format all users array
    const getUserOptions = () => {
        const options = allUsers?.map((item) => {
            return { value: item._id, label: item.fullName, flag: 'Support' };
        });
        return options;
    };

    // Create user resource for each assigned user
    const setUserResource = () => {
        const options = assignTo?.map((item) => {
            return { userId: item.value, status: 'Chưa nộp', resources: [], isSubmit: false };
        });
        return options;
    };

    // Create or edit document function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        const isNumberValid = fullNameValidator(number, setIsNumberErr, setNumberErrMsg);
        const isSendDateValid = dateValidator(sendDate, setIsSendDateErr, setSendDateErrMsg);
        const isCodeValid = fullNameValidator(code, setIsCodeErr, setCodeErrMsg);
        const isSenderValid = fullNameValidator(sender, setIsSenderErr, setSenderErrMsg);
        const isIssuedDateValid = dateValidator(issuedDate, setIsIssuedDateErr, setIssuedDateErrMsg);
        const isCurrLocationValid = dropListValidator(currentLocation, setIsCurrLocationErr, setCurrLocationErrMsg);
        const isLeaderValid = dropListValidator(leader, setIsLeaderErr, setLeaderErrMsg);
        const isAssignToValid = dropListValidator(assignTo, setIsAssignToErr, setAssignToErrMsg);
        const isTaskNameValidator = fullNameValidator(taskName, setIsTaskNameErr, setTaskNameErrMsg);
        const isTaskDeadlineValidator = dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg);
        if (
            !isfullNameValid ||
            !isNumberValid ||
            !isSendDateValid ||
            !isCodeValid ||
            !isSenderValid ||
            !isIssuedDateValid ||
            !isCurrLocationValid
        )
            return;
        if (isAssigned) {
            if (!isLeaderValid || !isAssignToValid || !isTaskNameValidator || !isTaskDeadlineValidator) return;
        }
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
            isHaveTask: isAssigned ? true : false,
            assignTo: isAssigned ? assignTo : [],
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
            // ------------------------------------
            if (isAssigned) {
                const taskDatas = {
                    taskName: taskName,
                    type: taskType,
                    dueDate: deadline,
                    level: level,
                    refLink: res.data.documentName,
                    desc: taskDesc,
                    leader: leader,
                    assignTo: assignTo,
                    resources: setUserResource(),
                };
                const resTask = await taskServices.createTask(taskDatas);
                // ------------------------------------
                if (resTask.code === 200) {
                    await documentServices.changeDocumentStatus(res.data._id, { documentStatus: 'Đang xử lý' });
                    if (leader) {
                        const data = {
                            userId: leader.value,
                            flag: 'Leader',
                        };
                        await taskServices.changeAssignRole(resTask.data._id, data);
                    }
                    const newNotiId = await Promise.all(
                        getAssignToIds(resTask.data.assignTo)?.map(async (userId) => {
                            const noti = await notificationServices.createNotification({
                                notification: 'Bạn có nhiệm vụ mới',
                                userId: userId,
                                linkTask: `http://localhost:3000/tasks/detail/${resTask.data._id}`,
                            });
                            return { notiId: noti.data._id, userId: noti.data.userId };
                        }),
                    );
                    socket.current?.emit('sendNotification', {
                        senderId: '',
                        _id: newNotiId,
                        receiverId: getAssignToIds(resTask.data.assignTo),
                        text: 'Bạn có nhiệm vụ mới',
                        linkTask: `http://localhost:3000/tasks/detail/${resTask.data._id}`,
                        isRead: false,
                    });
                }
                // ------------------------------------
            }
            // ------------------------------------
        } else {
            setLoading(false);
            errorNotify(res);
        }
    };

    //Get all task type
    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskTypeServices.getAllTaskType();
            if (res.code === 200) {
                const typeName = res?.data?.map((item) => item?.taskType);
                setAllTaskTypes(typeName);
            } else {
                console.log(res);
            }
        };
        fetchApi();
    }, [isSave]);

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
            setIsHaveTask(res.data.isHaveTask);
        };
        fetchApi();
    }, [id]);

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
                        <label className="font-bold">
                            Tên văn bản: <span className="text-red-600">*</span>
                        </label>
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
                            <label className="font-bold">
                                Số {inputLabel}: <span className="text-red-600">*</span>
                            </label>
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
                            <label className="font-bold">
                                Ngày {inputLabel}: <span className="text-red-600">*</span>
                            </label>
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
                            <label className="font-bold">
                                Số ký hiệu: <span className="text-red-600">*</span>
                            </label>
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
                            <label className="font-bold">
                                Ngày ban hành: <span className="text-red-600">*</span>
                            </label>
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
                            <label className="font-bold">
                                Nơi ban hành: <span className="text-red-600">*</span>
                            </label>
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
                            <label className="font-bold">
                                Ví trí hiện tại: <span className="text-red-600">*</span>
                            </label>
                            <DropList
                                isErr={isCurrLocationErr}
                                selectedValue={currentLocation}
                                options={departments}
                                setValue={setCurrentLocation}
                                setId={() => undefined}
                                onBlur={() =>
                                    dropListValidator(currentLocation, setIsCurrLocationErr, setCurrLocationErrMsg)
                                }
                            />
                            <p className="text-red-600 text-[1.3rem]">{currLocationErrMsg.currLocation}</p>
                        </div>
                    </div>
                    <div className="mt-7">
                        <label className="font-bold">File đính kèm:</label>
                        <FileInput setAttachFiles={setAttachFiles} />
                    </div>
                    {(title === 'Thêm văn bản đến mới' || (title === 'Sửa văn bản đến' && isHaveTask === false)) && (
                        <div className="flex items-center gap-x-5 mt-7">
                            <label className="font-bold">Giao việc:</label>
                            <SwitchButton
                                checked={isAssigned}
                                setValue={() => setAssigned(!isAssigned)}
                                setId={() => undefined}
                            />
                        </div>
                    )}
                    {isAssigned && (
                        <div className="border-[2px] border-[#bbbbbb] border-dashed p-3 mt-7">
                            <div>
                                <label className="font-bold">
                                    Tên công việc: <span className="text-red-600">*</span>
                                </label>
                                <InputField
                                    id="taskName"
                                    className={isTaskNameErr ? 'invalid' : 'default'}
                                    placeholder="Tên công việc"
                                    value={taskName}
                                    setValue={setTaskName}
                                    onBlur={() => fullNameValidator(taskName, setIsTaskNameErr, setTaskNameErrMsg)}
                                />
                                <p className="text-red-600 text-[1.3rem]">{taskNameErrMsg.fullName}</p>
                            </div>
                            <div className="flex flex-col md:flex-row mt-7 gap-6">
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Ngày đến hạn: <span className="text-red-600">*</span>
                                    </label>
                                    <InputField
                                        name="datetime-local"
                                        className={isDeadlineErr ? 'invalid' : 'default'}
                                        value={deadline}
                                        setValue={setDeadline}
                                        min={disabledPastDate()}
                                        onBlur={() => dateValidator(deadline, setIsDeadlineErr, setDeadlineErrMsg)}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{deadlineErrMsg.dueDate}</p>
                                </div>
                                <div className="flex-1">
                                    <label className="font-bold">Loại:</label>
                                    <div className="flex items-center gap-x-3">
                                        {!addType ? (
                                            <div className="flex-1">
                                                <DropList
                                                    selectedValue={taskType}
                                                    options={allTaskTypes}
                                                    setValue={setTaskType}
                                                    setId={() => undefined}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <InputField
                                                    id="type"
                                                    className="default"
                                                    placeholder="Loại công việc"
                                                    value={newType}
                                                    setValue={setNewType}
                                                />
                                            </div>
                                        )}
                                        {!newType ? (
                                            <div
                                                onClick={() => setAddType(!addType)}
                                                className="text-[2rem] cursor-pointer"
                                            >
                                                <FontAwesomeIcon icon={addType ? faXmark : faPlusCircle} />
                                            </div>
                                        ) : (
                                            <div onClick={handleAddNewType} className="text-[2rem] cursor-pointer">
                                                <FontAwesomeIcon icon={faPlusCircle} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 mt-7">
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Nhóm trưởng: <span className="text-red-600">*</span>
                                    </label>
                                    <Select
                                        className={isLeaderErr && 'droplistInvalid'}
                                        placeholder="--Vui lòng chọn--"
                                        options={getUserOptions()}
                                        onChange={setLeader}
                                        onBlur={() => dropListValidator(leader, setIsLeaderErr, setLeaderErrMsg)}
                                        value={leader}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{leaderErrMsg.leader}</p>
                                </div>
                                <div className="flex-1">
                                    <label className="font-bold">
                                        Người thực hiện: <span className="text-red-600">*</span>
                                    </label>
                                    <Select
                                        isMulti
                                        className={isAssignToErr && 'droplistInvalid'}
                                        placeholder="--Vui lòng chọn--"
                                        options={getUserOptions()}
                                        onChange={setAssignTo}
                                        onBlur={() => dropListValidator(assignTo, setIsAssignToErr, setAssignToErrMsg)}
                                        value={assignTo}
                                    />
                                    <p className="text-red-600 text-[1.3rem]">{assignToErrMsg.assignTo}</p>
                                </div>
                            </div>
                            <div className="mt-7">
                                <label className="font-bold">Mô tả công việc:</label>
                                <InputField
                                    textarea
                                    className="default textarea"
                                    placeholder="Mô tả công việc"
                                    rows="6"
                                    cols="50"
                                    value={taskDesc}
                                    setValue={setTaskDesc}
                                />
                            </div>
                        </div>
                    )}

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
