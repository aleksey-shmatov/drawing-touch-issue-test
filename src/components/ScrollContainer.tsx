import React, { useState } from 'react';
import { Canvas } from './Canvas';

export const ScrollContainer  = () => {

    const [touchAction, setTouchAction] = useState('auto');

    const handleChangeTouchAction = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTouchAction(event.target.checked ? 'auto' : 'none');
    }

    return (
        <div className="scroll-container" style={{touchAction: touchAction}} >
            <Canvas />
            <div className='options'>
                <label>
                    touch action: <input type='checkbox' checked={touchAction === 'auto'} onChange={handleChangeTouchAction}/>
                </label>
            </div>
        </div>
    )
}


