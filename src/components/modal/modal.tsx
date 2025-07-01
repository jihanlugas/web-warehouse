import { NextPage } from 'next';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onClickOverlay: () => void;
  layout: 'sm:max-w-md' | 'sm:max-w-lg' | 'sm:max-w-xl' | 'sm:max-w-2xl' | 'sm:max-w-3xl' | 'sm:max-w-4xl' | 'sm:max-w-5xl' | 'sm:max-w-6xl' | 'sm:max-w-7xl'
}


const Modal: NextPage<Props> = ({ children, show, onClickOverlay, layout = '' }) => {
  if (!show)
    return null

  return (
    <div className={'z-50 inset-0 overflow-y-auto fixed'} >
      <div className="flex items-center justify-center min-h-[100dvh] pt-4 px-4 pb-4 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={() => onClickOverlay()} aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <dialog open className={`my-12 max-h-[90vh] rounded-lg text-left overflow-auto shadow-xl sm:my-8 sm:align-middle w-11/12 justify-self-center-safe ${layout}`}>
          {children}
        </dialog>
      </div>
    </div>
  );
};

export default Modal;