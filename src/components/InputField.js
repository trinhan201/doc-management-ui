import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

const InputField = (props) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggle = () => {
        setShowPassword(!showPassword);
    };

    const setTypes = () => {
        const inputName = props.name;
        if (inputName === 'password') {
            return !showPassword ? 'password' : 'text';
        } else if (inputName === 'email') {
            return 'email';
        } else if (inputName === 'radio') {
            return 'radio';
        } else if (inputName === 'checkbox') {
            return 'checkbox';
        } else {
            return 'text';
        }
    };

    return (
        <div className="relative rounded-md">
            <input
                className="w-full focus-within outline-none px-[16px] py-[8px] border border-solid border-[#cccccc] rounded-md"
                type={setTypes()}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                minLength={props.name === 'password' ? '6' : '2'}
                required
            />
            <div
                onClick={toggle}
                className={
                    props.name === 'password'
                        ? 'absolute top-[50%] translate-y-[-50%] right-[16px] p-[10px] cursor-pointer'
                        : 'hidden'
                }
            >
                <FontAwesomeIcon icon={!showPassword ? faEyeSlash : faEye} />
            </div>
        </div>
    );
};

export default InputField;
