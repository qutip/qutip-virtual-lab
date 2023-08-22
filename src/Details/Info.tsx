import React, { useState } from 'react';

const Info = ({ text }) => {
    const [visible, setVisible] = useState(false)
    const toggleVisible = () => setVisible(v => !v)
    return (
        <div className={"info"}><span onClick={toggleVisible}>ⓘ</span>
            <div className={`info--body ${visible ? 'visible' : ''}`}>
                {text}
            </div>
        </div>
    )
}

export default Info