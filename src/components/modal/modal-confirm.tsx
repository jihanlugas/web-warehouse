import Modal from '@/components/modal/modal';
import { NextPage } from 'next';
import { ImSpinner2 } from 'react-icons/im';
import { MdClose } from 'react-icons/md';

type Props = {
  show: boolean;
  onClickOverlay: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

const ModalConfirm: NextPage<Props> = ({ show, onClickOverlay, onConfirm, isLoading = false, children }) => {

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 border-b-2 border-gray-200 pb-4 flex justify-between items-center'}>
          <span className='font-bold'>Konfirmasi</span>
          <button className='h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110' onClick={() => onClickOverlay()}>
            <MdClose className={''} size={'1.2rem'} />
          </button>
        </div>
        <div className={'mb-4'}>
          {children}
        </div>
        <div className={'flex justify-end'}>
          <button className='px-4 py-2 w-36 flex justify-center items-center bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed duration-300 rounded-md text-gray-50 font-semibold' onClick={() => onConfirm()} disabled={isLoading}>
            {isLoading ? <ImSpinner2 className={'animate-spin'} size={'1.2rem'} /> : 'Simpan'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;