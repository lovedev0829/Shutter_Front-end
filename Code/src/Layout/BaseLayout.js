import React from 'react'

export default function BaseLayout(props) {
    return (
        <div className="main_container">
            <div className="limani_body">
                { props.children }
            </div>
        </div>
    )
}
