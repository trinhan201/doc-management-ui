const DropList = ({ options }) => {
    return (
        <select className="bg-inherit border border-[#cccccc] text-[1.4rem] rounded block w-full p-2 outline-none">
            {options?.map((option, index) => {
                return (
                    <option key={index} value={option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
};

export default DropList;
