const CommentItem = (props) => {
    return (
        <>
            <li className="p-[10px] bg-white rounded-md shadow-4Way mb-3">
                <div className="flex">
                    <div className="w-[35px] h-[35px]">
                        <img className="w-full h-full object-cover rounded-full" src={props.img} alt="" />
                    </div>

                    <div className="ml-3 text-[14px]">
                        <h3 className="font-semibold">{props.username}</h3>

                        <p className="text-[16px] text-[#9a919b]">{props.content}</p>
                        <div className="relative flex items-center">
                            <p className="text-[13px]">{props.cmtDate}</p>
                        </div>
                    </div>
                </div>
            </li>
        </>
    );
};

export default CommentItem;
