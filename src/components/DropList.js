const DropList = ({ options, setValue, roleValue }) => {
    return (
        <select
            onChange={(e) => setValue(e.target.value)}
            className="bg-inherit border border-[#cccccc] text-[1.5rem] rounded-[8px] block w-full px-[14px] py-[8px] outline-none"
        >
            {options?.map((option, index) => {
                return (
                    <option key={index} value={option} selected={roleValue === option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
};

export default DropList;
