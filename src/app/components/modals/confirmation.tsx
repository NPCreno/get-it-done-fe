interface ConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  confirmationTitle: string;
  confirmationDescription: string;
  confirmBtnLabel: string;
}

export default function ConfirmationModal({ 
  onClose, 
  onConfirm,
  confirmationTitle,
  confirmationDescription,
  confirmBtnLabel,
}: ConfirmationModalProps) {
 
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  window.addEventListener('keydown', handleEscapeKey);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-popup bg-white w-auto h-auto rounded-[10px] p-5 shadow-lg flex flex-col gap-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-[10px]">
            <div className="flex flex-row justify-center items-center text-text text-3xl font-bold font-lato">
              {confirmationTitle}
            </div>
            <h2 className="text-[#676767] text-sm font-lato text-center">{confirmationDescription}</h2>
        </div>

        <div className="flex flex-row justify-center gap-[10px] w-full  items-center">
          <button className="border border-error-200 rounded-[5px] flex justify-center items-center text-error-default
            font-lato text-xs p-[10px] font-bold" 
            onClick={onClose}>Cancel</button>
          
          <button className="bg-error-300 rounded-[5px] flex justify-center items-center text-white font-lato 
              text-xs p-[10px]" onClick={onConfirm}>
              {confirmBtnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}