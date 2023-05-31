const DropList = ({ selectedValue, options, setValue, setId }) => {
    return (
        <select
            value={selectedValue}
            onChange={(e) => {
                setValue(e.target.value);
                setId();
            }}
            className="drop-list appearance-none bg-inherit border border-[#cccccc] text-[1.5rem] rounded-[4px] block w-full h-[38px] leading-[1.2] outline-[#2684ff] truncate"
        >
            <option disabled hidden value="">
                --Vui lòng chọn--
            </option>
            {options?.map((option, index) => {
                return (
                    <option key={index} title={option} value={option}>
                        {option}
                    </option>
                );
            })}
        </select>
    );
};

export default DropList;
