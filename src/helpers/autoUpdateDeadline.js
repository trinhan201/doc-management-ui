import * as taskServices from '~/services/taskServices';
import * as notificationServices from '~/services/notificationServices';

const getAssignToIds = (arr) => {
    const final = arr.map((item) => item.value);
    return final;
};

export const autoUpdateDeadline = async (allTasks, socket, setIsSave) => {
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
};
