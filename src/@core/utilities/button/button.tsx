const Button = ({className, children, action = () => {}}:
                {
                    className: string;
                    children:any;
                    action?:(option: string) => void;
                }) => {
    return (
        <button className={className} onClick={()=> action()}>
            {children}
        </button>
    )
}

export default Button;