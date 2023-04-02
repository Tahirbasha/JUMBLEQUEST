import { FC } from "react";

const Modal: FC<ModalProps> = ({ children }) => {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-content">{children}</div>
      </div>
    </div>
  );
};

interface ModalProps {
  children: any;
}

export default Modal;
