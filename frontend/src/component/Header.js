import '../css/Header.css';
function Header(props) {
    const updateSearchBox = e => props.setData(e.target.value);


    return (
        <header className="header">
            <div className="input-area">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.60879 15.2176C11.811 15.2176 15.2176 11.811 15.2176 7.60879C15.2176 3.40657 11.811 0 7.60879 0C3.40657 0 0 3.40657 0 7.60879C0 11.811 3.40657 15.2176 7.60879 15.2176ZM7.60879 14.2031C11.2507 14.2031 14.2031 11.2507 14.2031 7.60879C14.2031 3.96687 11.2507 1.01451 7.60879 1.01451C3.96687 1.01451 1.01451 3.96687 1.01451 7.60879C1.01451 11.2507 3.96687 14.2031 7.60879 14.2031Z" fill="#50B8E4"/>
                    <path d="M13.5472 14.2646C13.3492 14.0665 13.3492 13.7453 13.5472 13.5472C13.7453 13.3492 14.0665 13.3492 14.2646 13.5472L17.8514 17.1341C18.0495 17.3322 18.0495 17.6533 17.8514 17.8514C17.6533 18.0495 17.3322 18.0495 17.1341 17.8514L13.5472 14.2646Z" fill="#50B8E4"/>
                </svg>
                <input
                    type="text"
                    placeholder={props.placeholder}
                    value={props.data}
                    onChange={updateSearchBox}
                />
            </div>
        </header>
    );
}

export default Header;