import React, { useState } from 'react';

const Info = ({ children }) => {
    const [visible, setVisible] = useState(false)
    const toggleVisible = () => setVisible(v => !v)
    return (
        <div className={"info"}><span onClick={toggleVisible}>ⓘ</span>
            <div className={`info--body ${visible ? 'visible' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default Info