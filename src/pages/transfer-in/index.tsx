import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayTon } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import ModalConfirm from "@/components/modal/modal-confirm";
import { PiFolderOpenDuotone } from "react-icons/pi";
import ModalEditTransferIn from "@/components/modal/modal-edit-transfer-in";
import ModalPhoto from "@/components/modal/modal-photo";
import { LoginUser } from "@/types/auth";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { PageTransferin } from "@/types/transferin";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";
import { ImSpinner2 } from 'react-icons/im';
import { HiDotsVertical } from "react-icons/hi";
import { FaMapMarkerAlt, FaTruckLoading, FaBalanceScale } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { RiTruckLine } from "react-icons/ri";
import { TbPackage, TbNotes } from "react-icons/tb";

type Props = {
  loginUser: LoginUser
}

type PropsCard = {
  data: StockmovementvehicleView
  toggleModalSetUnloading: (id?: string) => void
  toggleModalSetComplete: (id?: string) => void
  toggleModalDetail: (id?: string) => void
  toggleModalPhoto: (id?: string, refresh?: boolean, status?: string) => void
  toggleModalEditTransferIn: (id?: string, refresh?: boolean) => void
  handleGenerateDeliveryRecipt: (id?: string) => void
  isPendingSetUnloading: boolean
  isPendingSetComplete: boolean
  isPendingDeliveryRecipt: boolean
}

const RenderStatus = ({ status }) => {
  switch (status) {
    case "LOADING":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    case "IN_TRANSIT":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-blue-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status.replace('_', ' ')}</span>
        </div>
      )
    case "UNLOADING":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    case "COMPLETED":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    default:
      return null
  }
}
const RenderCard: NextPage<PropsCard> = ({ data, toggleModalSetUnloading, toggleModalSetComplete, toggleModalDetail, toggleModalPhoto, toggleModalEditTransferIn, handleGenerateDeliveryRecipt, isPendingSetUnloading, isPendingSetComplete, isPendingDeliveryRecipt }) => {

  const refMenu = useRef<HTMLDivElement>(null);
  const [menuBar, setMenuBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (menuBar && refMenu.current && !refMenu.current.contains(e.target)) {
        setMenuBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [menuBar]);

  return (
    <div className="shadow p-2 sm:p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
      <div className="flex justify-between items-center">
        <div className="text-base">
          <div className="font-bold">{data.number}</div>
        </div>
        <div className="flex items-center">
          <RenderStatus status={data.stockmovementvehicleStatus} />
          <div className="ml-2 relative" ref={refMenu}>
            <button className="duration-300 rounded-full text-primary-400 hover:text-primary-500 hover:bg-gray-200 cursor-pointer p-2" onClick={() => setMenuBar(!menuBar)}>
              <HiDotsVertical className="" size={"1.2rem"} />
            </button>
            <div className={`absolute right-4 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white focus:outline-none duration-300 ease-in-out ${!menuBar && 'scale-0 shadow-none'}`}>
              <div className="" role="none">
                {data.stockmovementvehicleStatus === 'IN_TRANSIT' && (
                  <button
                    className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                    onClick={() => toggleModalSetUnloading(data.id)}
                    disabled={isPendingSetUnloading}
                  >
                    <div className="flex">
                      <div>Set Unloading</div>
                      {isPendingSetUnloading && <ImSpinner2 className={'ml-4 animate-spin'} size={'1.2rem'} />}
                    </div>
                  </button>
                )}
                {data.stockmovementvehicleStatus === 'UNLOADING' && (
                  <>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalSetComplete(data.id)}
                      disabled={isPendingSetComplete}
                    >
                      {isPendingSetComplete ? <ImSpinner2 className={'animate-spin'} size={'1.2rem'} /> : <div>Set Complete</div>}
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalEditTransferIn(data.id)}
                    >
                      <div>Unloading</div>
                    </button>
                  </>
                )}
                {data.stockmovementvehicleStatus === 'COMPLETED' && (
                  <button
                    className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                    onClick={() => handleGenerateDeliveryRecipt(data.id)}
                    disabled={isPendingDeliveryRecipt}
                  >
                    <div className="flex">
                      <div>Surat Terima</div>
                      {isPendingDeliveryRecipt && <ImSpinner2 className={'ml-4 animate-spin'} size={'1.2rem'} />}
                    </div>
                  </button>
                )}
                <button
                  className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                  onClick={() => toggleModalPhoto(data.id, false, data.stockmovementvehicleStatus)}
                >
                  <div>Photo</div>
                </button>
                <button
                  className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                  onClick={() => toggleModalDetail(data.id)}
                >
                  <div>Detail</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />
      <div>
        <div className="flex items-center mb-1">
          <TbPackage size={"1.2rem"} className="text-gray-500 mr-1" />
          <div className="ml-4">{data.product?.name}</div>
        </div>
        <div className="flex items-start mb-1">
          <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
          <div className="ml-4 whitespace-pre-wrap">{data.notes || '-'}</div>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />
      <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="">
          <div className="font-bold mb-2">{'Dikirim'}</div>
          <div className="text-sm">
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
              <div className="ml-4">{data.fromWarehouse?.name}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
              <div className="ml-4">{data.sentTime ? displayDateTime(data.sentTime) : '-'}</div>
            </div>
            <div className="flex items-center mb-1">
              <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
              <div className="ml-4">{displayTon(data.sentTareQuantity)}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
              <div className="ml-4">{displayTon(data.sentGrossQuantity)}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
              <div className="ml-4">{displayTon(data.sentNetQuantity)}</div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="font-bold mb-2">{'Tujuan'}</div>
          <div className="text-sm">
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
              <div className="ml-4">{data.toWarehouse?.name}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
              <div className="ml-4">{data.receivedTime ? displayDateTime(data.receivedTime) : '-'}</div>
            </div>
            <div className="flex items-center mb-1">
              <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
              <div className="ml-4">{displayTon(data.receivedTareQuantity)}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
              <div className="ml-4">{displayTon(data.receivedGrossQuantity)}</div>
            </div>
            <div className="flex items-center mb-1">
              <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
              <div className="ml-4">{displayTon(data.receivedNetQuantity)}</div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />
      <div className="flex justify-between text-xs">
        <div>
          <div className="uppercase">{data.vehicle?.plateNumber}</div>
          <div className="">{data.vehicle?.driverName}</div>
        </div>
        <div>
          <div className="text-right">{data.createName}</div>
          <div>{displayDateTime(data.createDt)}</div>
        </div>
      </div>
    </div>
  )
}
const Index: NextPage<Props> = () => {


  const [transferins, setTransferIns] = useState<StockmovementvehicleView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalSetComplete, setShowModalSetComplete] = useState<boolean>(false);
  const [showModalSetUnloading, setShowModalSetUnloading] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [completeId, setCompleteId] = useState<string>('');
  const [completeData, setCompleteData] = useState<StockmovementvehicleView>(null);
  const [unloadingId, setUnloadingId] = useState<string>('');
  const [unloadingData, setUnloadingData] = useState<StockmovementvehicleView>(null);
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalEditTransferIn, setShowModalEditTransferIn] = useState<boolean>(false);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);

  const [pageRequest] = useState<PageTransferin>({
    limit: -1,
    preloads: "FromWarehouse,ToWarehouse,Vehicle,Product",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', 'transfer-in', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle/transfer-in', queryKey[2] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-in', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/transfer-in/' + id)
  });

  const { mutate: mutateSetUnloading, isPending: isPendingSetUnloading } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-in', unloadingId, 'set-unloading'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/transfer-in/' + id + '/set-unloading')
  });

  const { mutate: mutateSetComplete, isPending: isPendingSetComplete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-in', completeId, 'set-complete'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/transfer-in/' + id + '/set-complete')
  });

  const { mutate: mutateDeliveryRecipt, isPending: isPendingDeliveryRecipt } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-in', 'generate-delivery-recipt'],
    mutationFn: (id: string) => Api.getpdf('/stockmovementvehicle/transfer-in/' + id + "/generate-delivery-recipt"),
  })

  const toggleModalDetail = (id = '') => {
    setDetailId(id);
    setShowModalDetail(!showModalDetail);
  };

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const toggleModalSetUnloading = (id = '') => {
    setUnloadingId(id);
    setUnloadingData(transferins.find(data => data.id === id));
    setShowModalSetUnloading(!showModalSetUnloading);
  };

  const toggleModalSetComplete = (id = '') => {
    setCompleteId(id);
    setCompleteData(transferins.find(data => data.id === id));
    setShowModalSetComplete(!showModalSetComplete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDelete();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  const handleSetUnloading = () => {
    mutateSetUnloading(unloadingId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          refetch();
        } else {
          notif.error(message);
        }
        toggleModalSetUnloading();
      },
      onError: () => {
        notif.error('Please cek you connection');
        toggleModalSetUnloading();
      },
    });
  }

  const handleSetComplete = () => {
    mutateSetComplete(completeId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          refetch();
        } else {
          notif.error(message);
        }
        toggleModalSetComplete();
      },
      onError: () => {
        notif.error('Please cek you connection');
        toggleModalSetComplete();
      },
    });
  }

  const handleGenerateDeliveryRecipt = async (id: string) => {
    mutateDeliveryRecipt(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const toggleModalEditTransferIn = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditTransferIn(!showModalEditTransferIn);
  };

  const toggleModalPhoto = (id = '', refresh = false, status = '') => {
    if (refresh) {
      refetch()
    }
    setAllowAdd(status === 'UNLOADING')
    setSelectedId(id)
    setShowModalPhoto(!showModalPhoto);
  };

  useEffect(() => {
    if (data?.status) {
      setTransferIns(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Pengiriman Masuk'}</title>
      </Head>
      <ModalEditTransferIn
        show={showModalEditTransferIn}
        onClickOverlay={toggleModalEditTransferIn}
        id={selectedId}
      />
      <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
        allowAdd={allowAdd}
      />
      <ModalDetailStockmovementvehicle
        show={showModalDetail}
        onClickOverlay={toggleModalDetail}
        id={detailId}
      />
      <ModalDeleteVerify
        show={showModalDelete}
        onClickOverlay={toggleModalDelete}
        onDelete={handleDelete}
        verify={deleteVerify}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Apakah anda yakin ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <ModalConfirm
        show={showModalSetComplete}
        onClickOverlay={toggleModalSetComplete}
        onConfirm={handleSetComplete}
        isLoading={isPendingSetComplete}
      >
        <div>
          <div className='mb-4'>Apakah anda yakin ?</div>
          {completeData && (
            <div className=''>
              <div>
                <div className="flex items-center mb-1">
                  <TbPackage size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4">{completeData.product?.name}</div>
                </div>
                <div className="flex items-start mb-1">
                  <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4 whitespace-pre-wrap">{completeData.notes || '-'}</div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="">
                  <div className="font-bold mb-2">{'Dikirim'}</div>
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
                      <div className="ml-4">{completeData.fromWarehouse?.name}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
                      <div className="ml-4">{completeData.sentTime ? displayDateTime(completeData.sentTime) : '-'}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
                      <div className="ml-4">{displayTon(completeData.sentTareQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
                      <div className="ml-4">{displayTon(completeData.sentGrossQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
                      <div className="ml-4">{displayTon(completeData.sentNetQuantity)}</div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="font-bold mb-2">{'Tujuan'}</div>
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
                      <div className="ml-4">{completeData.toWarehouse?.name}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
                      <div className="ml-4">{completeData.receivedTime ? displayDateTime(completeData.receivedTime) : '-'}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
                      <div className="ml-4">{displayTon(completeData.receivedTareQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
                      <div className="ml-4">{displayTon(completeData.receivedGrossQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
                      <div className="ml-4">{displayTon(completeData.receivedNetQuantity)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between text-xs">
                <div>
                  <div className="uppercase">{completeData.vehicle?.plateNumber}</div>
                  <div className="">{completeData.vehicle?.driverName}</div>
                </div>
                <div>
                  <div className="text-right">{completeData.createName}</div>
                  <div>{displayDateTime(completeData.createDt)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <ModalConfirm
        show={showModalSetUnloading}
        onClickOverlay={toggleModalSetUnloading}
        onConfirm={handleSetUnloading}
        isLoading={isPendingSetUnloading}
      >
        <div>
          <div className='mb-4'>Apakah anda yakin ?</div>
          {unloadingData && (
            <div className=''>
              <div>
                <div className="flex items-center mb-1">
                  <TbPackage size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4">{unloadingData.product?.name}</div>
                </div>
                <div className="flex items-start mb-1">
                  <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4 whitespace-pre-wrap">{unloadingData.notes || '-'}</div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="">
                  <div className="font-bold mb-2">{'Dikirim'}</div>
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
                      <div className="ml-4">{unloadingData.fromWarehouse?.name}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
                      <div className="ml-4">{unloadingData.sentTime ? displayDateTime(unloadingData.sentTime) : '-'}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
                      <div className="ml-4">{displayTon(unloadingData.sentTareQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
                      <div className="ml-4">{displayTon(unloadingData.sentGrossQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
                      <div className="ml-4">{displayTon(unloadingData.sentNetQuantity)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between text-xs">
                <div>
                  <div className="uppercase">{unloadingData.vehicle?.plateNumber}</div>
                  <div className="">{unloadingData.vehicle?.driverName}</div>
                </div>
                <div>
                  <div className="text-right">{unloadingData.createName}</div>
                  <div>{displayDateTime(unloadingData.createDt)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Pengiriman Masuk', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div>
              {isLoading ? (
                <div>Loading</div>
              ) : (
                <div>
                  {transferins.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {transferins.map((data) => (
                        <RenderCard
                          key={data.id}
                          data={data}
                          handleGenerateDeliveryRecipt={handleGenerateDeliveryRecipt}
                          toggleModalEditTransferIn={toggleModalEditTransferIn}
                          toggleModalPhoto={toggleModalPhoto}
                          toggleModalDetail={toggleModalDetail}
                          toggleModalSetComplete={toggleModalSetComplete}
                          toggleModalSetUnloading={toggleModalSetUnloading}
                          isPendingSetComplete={isPendingSetComplete}
                          isPendingSetUnloading={isPendingSetUnloading}
                          isPendingDeliveryRecipt={isPendingDeliveryRecipt}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className='w-full text-center my-16'>
                      <div className='flex justify-center items-center mb-4'>
                        <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                      </div>
                      <div className="text-xl">{'Data Tidak Ditemukan'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainOperator;

export default Index;