import React from 'react';
import '../App.css'

function Modal (modalInput) {
  if (!modalInput.show) {
    return null;
  }

  const content = modalInput.input.content;
  const title = modalInput.input.title;

  return (<>
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>
        </div>
        <div className="modal-body">
          {content}
        </div>
        <div className="modal-footer">
          <button onClick={modalInput.onClose} className="button">Close</button>
        </div>
      </div>
    </div>
  </>)
}

export default Modal;
