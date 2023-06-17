import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputField from '~/components/InputField';
import { faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';
import * as departmentServices from '~/services/departmentServices';
import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';
import { fullNameValidator } from '~/utils/formValidation';
import { successNotify, errorNotify } from '~/components/ToastMessage';

const CreateDepartment = ({ title, socket }) => {
    const [allTasks, setAllTasks] = useState([]);
    const [isSave, setIsSave] = useState(false);
    const [fullName, setFullName] = useState('');
    const [note, setNote] = useState('');
    const [status, setStatus] = useState(false);

    const [fullNameErrMsg, setFullNameErrMsg] = useState({});
    const [isFullNameErr, setIsFullNameErr] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    const statusList = [
        ['Hoạt động', true],
        ['Không hoạt động', false],
    ];

    useEffect(() => {
        if (!id) return;
        const fetchApi = async () => {
            const res = await departmentServices.getDepartmentById(id);
            setFullName(res.data.departmentName);
            setStatus(res.data.status);
            setNote(res.data.note);
        };
        fetchApi();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isfullNameValid = fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg);
        if (!isfullNameValid) return;
        const data = {
            departmentName: fullName,
            status: status,
            note: note,
        };
        let res;
        if (id) {
            res = await departmentServices.updateDepartment(id, data);
        } else {
            res = await departmentServices.createDepartment(data);
        }
        if (res.code === 200) {
            successNotify(res.message);
            navigate('/departments');
        } else {
            errorNotify(res);
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            const res = await taskServices.getAllTask(1, 1, '', '', '', '', '', '');
            if (res.code === 200) {
                setAllTasks(res.allTasks);
            } else {
                console.log(res.message);
            }
        };
        fetchApi();
    }, [isSave]);

    const getAssignToIds = (arr) => {
        const final = arr.map((item) => item.value);
        return final;
    };

    useEffect(() => {
        if (allTasks?.length === 0) return;
        const timer = setInterval(async () => {
            allTasks?.map(async (item) => {
                const currDate = new Date();
                const startDate = new Date(item?.createdAt);
                const endDate = new Date(item?.dueDate);
                const allDateToDo = endDate.getTime() - startDate.getTime();
                const datesWerePassed = currDate.getTime() - startDate.getTime();
                if (currDate.getTime() <= endDate.getTime()) {
                    if (datesWerePassed >= (allDateToDo / 3) * 2) {
                        if (item?.status === 'Sắp đến hạn') return;
                        await taskServices.updateStatus(item?._id, { status: 'Sắp đến hạn' });
                        setIsSave((isSave) => !isSave);

                        const newNotiId = await Promise.all(
                            getAssignToIds(item?.assignTo)?.map(async (userId) => {
                                const noti = await notificationServices.createNotification({
                                    notification: `Nhiệm vụ ${item.taskName} sắp đến hạn`,
                                    userId: userId,
                                    linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                                });
                                return { notiId: noti.data._id, userId: noti.data.userId };
                            }),
                        );
                        socket.current?.emit('sendNotification', {
                            senderId: '',
                            _id: newNotiId,
                            receiverId: getAssignToIds(item?.assignTo),
                            text: `Nhiệm vụ ${item?.taskName} sắp đến hạn`,
                            linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                            isRead: false,
                        });
                    } else {
                        await taskServices.updateStatus(item?._id, { status: 'Còn hạn' });
                        setIsSave((isSave) => !isSave);
                    }
                } else {
                    if (item?.status === 'Quá hạn') return;
                    await taskServices.updateStatus(item?._id, { status: 'Quá hạn' });
                    setIsSave((isSave) => !isSave);

                    const newNotiId = await Promise.all(
                        getAssignToIds(item?.assignTo)?.map(async (userId) => {
                            const noti = await notificationServices.createNotification({
                                notification: `Nhiệm vụ ${item.taskName} đã quá hạn`,
                                userId: userId,
                                linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                            });
                            return { notiId: noti.data._id, userId: noti.data.userId };
                        }),
                    );
                    socket.current?.emit('sendNotification', {
                        senderId: '',
                        _id: newNotiId,
                        receiverId: getAssignToIds(item?.assignTo),
                        text: `Nhiệm vụ ${item?.taskName} đã quá hạn`,
                        linkTask: `http://localhost:3000/tasks/detail/${item._id}`,
                        isRead: false,
                    });
                }
            });
        }, 60000);
        return () => {
            clearInterval(timer);
        };
    }, [allTasks, socket]);

    return (
        <div className="bg-white p-[16px] shadow-4Way border-t-[3px] border-blue-600">
            <h1 className="text-[2rem] font-bold">{title}</h1>
            <form>
                <div className="mt-8">
                    <label className="font-bold">Tên phòng ban:</label>
                    <InputField
                        className={isFullNameErr ? 'invalid' : 'default'}
                        placeholder="Tên phòng ban"
                        value={fullName}
                        setValue={setFullName}
                        onBlur={() => fullNameValidator(fullName, setIsFullNameErr, setFullNameErrMsg)}
                    />
                    <p className="text-red-600 text-[1.3rem]">{fullNameErrMsg.fullName}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center mt-7">
                    <label className="font-bold mr-7">Trạng thái:</label>
                    <div className="flex items-center">
                        {statusList.map((st, index) => {
                            return (
                                <div key={index} className="flex items-center mr-5">
                                    <InputField
                                        name="radio"
                                        className="flex w-[15px] h-[15px]"
                                        checked={status === st[1]}
                                        setValue={() => setStatus(st[1])}
                                    />
                                    <label className="text-[1.5rem] ml-3">{st[0]}</label>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-7">
                    <label className="font-bold">Ghi chú:</label>
                    <InputField
                        textarea
                        rows="6"
                        cols="50"
                        className="default textarea"
                        placeholder="Ghi chú"
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
                        to="/departments"
                        className="block w-full md:w-fit text-center text-[white] bg-red-600 mt-4 md:mt-0 px-[16px] py-[8px] rounded-md hover:bg-[#1b2e4b] transition-all duration-[1s]"
                    >
                        <FontAwesomeIcon icon={faXmark} /> Hủy bỏ
                    </NavLink>
                </div>
            </form>
        </div>
    );
};

export default CreateDepartment;
