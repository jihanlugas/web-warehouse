import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayTon } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import ModalConfirm from "@/components/modal/modal-confirm";
import { PiFolderOpenDuotone } from "react-icons/pi";
import ModalEditTransferout from "@/components/modal/modal-edit-transfer-out";
import ModalPhoto from "@/components/modal/modal-photo";
import { LoginUser } from "@/types/auth";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { PageTransferout } from "@/types/transferout";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";
import { ImSpinner2 } from 'react-icons/im';
import { HiDotsVertical } from "react-icons/hi";
import { RiTruckLine } from "react-icons/ri";
import { FaTruckLoading, FaBalanceScale, FaRegCalendarCheck, FaMapMarkerAlt } from "react-icons/fa";
import { TbPackage, TbNotes } from "react-icons/tb";

type Props = {
  loginUser: LoginUser
}

type PropsCard = {
  data: StockmovementvehicleView
  toggleModalSetInTransit: (id?: string) => void
  toggleModalDelete: (id?: string, verify?: string) => void
  toggleModalDetail: (id?: string) => void
  toggleModalPhoto: (id?: string, refresh?: boolean, status?: string) => void
  toggleModalEditTransferout: (id?: string, refresh?: boolean) => void
  handleGenerateDeliveryOrder: (id?: string) => void
  isPendingSetInTransit: boolean
  isPendingDelete: boolean
  isPendingDeliveryOrder: boolean
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

const RenderCard: NextPage<PropsCard> = ({ data, toggleModalDelete, toggleModalDetail, toggleModalSetInTransit, toggleModalPhoto, toggleModalEditTransferout, handleGenerateDeliveryOrder, isPendingSetInTransit, isPendingDelete, isPendingDeliveryOrder }) => {

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
                {data.stockmovementvehicleStatus === 'LOADING' ? (
                  <>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalSetInTransit(data.id)}
                      disabled={isPendingSetInTransit}
                    >
                      <div className="flex">
                        <div>Set In Transit</div>
                        {isPendingSetInTransit && <ImSpinner2 className={'ml-4 animate-spin'} size={'1.2rem'} />}
                      </div>
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalEditTransferout(data.id)}
                    >
                      <div>Loading</div>
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalDelete(data.id, data.number)}
                      disabled={isPendingDelete}
                    >
                      <div className="flex">
                        <div>Delete</div>
                        {isPendingDelete && <ImSpinner2 className={'ml-4 animate-spin'} size={'1.2rem'} />}
                      </div>
                    </button>
                  </>
                ) : (
                  <button
                    className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                    onClick={() => handleGenerateDeliveryOrder(data.id)}
                    disabled={isPendingDeliveryOrder}
                  >
                    <div className="flex">
                      <div>Surat Jalan</div>
                      {isPendingDeliveryOrder && <ImSpinner2 className={'ml-4 animate-spin'} size={'1.2rem'} />}
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
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-200" />
      <div className="flex justify-between text-xs">
        <div>
          <div className="uppercase">{data?.vehicle?.plateNumber}</div>
          <div className="">{data?.vehicle?.driverName}</div>
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


  const [transferouts, setTransferouts] = useState<StockmovementvehicleView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalSetInTransit, setShowModalSetInTransit] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [inTransitId, setInTransitId] = useState<string>('');
  const [inTransitData, setInTransitData] = useState<StockmovementvehicleView>(null);
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalEditTransferout, setShowModalEditTransferout] = useState<boolean>(false);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);

  const [pageRequest] = useState<PageTransferout>({
    limit: -1,
    preloads: "FromWarehouse,ToWarehouse,Vehicle,Product",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', 'transfer-out', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle/transfer-out', queryKey[2] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-out', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/transfer-out/' + id)
  });


  const { mutate: mutateSetInTransit, isPending: isPendingSetInTransit } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-out', inTransitId, 'set-in-transit'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/transfer-out/' + id + '/set-in-transit')
  });

  const { mutate: mutateDeliveryOrder, isPending: isPendingDeliveryOrder } = useMutation({
    mutationKey: ['stockmovementvehicle', 'transfer-out', 'generate-delivery-order'],
    mutationFn: (id: string) => Api.getpdf('/stockmovementvehicle/transfer-out/' + id + "/generate-delivery-order"),
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

  const toggleModalSetInTransit = (id = '') => {
    setInTransitId(id);
    setInTransitData(transferouts.find(data => data.id === id));
    setShowModalSetInTransit(!showModalSetInTransit);
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

  const handleSetInTransit = () => {
    mutateSetInTransit(inTransitId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          refetch();
        } else {
          notif.error(message);
        }
        toggleModalSetInTransit();
      },
      onError: () => {
        notif.error('Please cek you connection');
        toggleModalSetInTransit();
      },
    });
  }

  const handleGenerateDeliveryOrder = async (id: string) => {
    mutateDeliveryOrder(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const toggleModalEditTransferout = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditTransferout(!showModalEditTransferout);
  };

  const toggleModalPhoto = (id = '', refresh = false, status = '') => {
    if (refresh) {
      refetch()
    }
    setAllowAdd(status === 'LOADING')
    setSelectedId(id)
    setShowModalPhoto(!showModalPhoto);
  };

  useEffect(() => {
    if (data?.status) {
      setTransferouts(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Pengiriman Keluar'}</title>
      </Head>
      <ModalEditTransferout
        show={showModalEditTransferout}
        onClickOverlay={toggleModalEditTransferout}
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
        show={showModalSetInTransit}
        onClickOverlay={toggleModalSetInTransit}
        onConfirm={handleSetInTransit}
        isLoading={isPendingSetInTransit}
      >
        <div>
          <div className='mb-4'>Apakah anda yakin ?</div>
          {inTransitData && (
            <div>
              <div>
                <div className="flex items-center mb-1">
                  <TbPackage size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4">{inTransitData.product?.name}</div>
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
                      <div className="ml-4">{inTransitData.fromWarehouse?.name}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
                      <div className="ml-4">{inTransitData.sentTime ? displayDateTime(inTransitData.sentTime) : '-'}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <RiTruckLine size={"1.2rem"} className="text-gray-400 mr-1" />
                      <div className="ml-4">{displayTon(inTransitData.sentTareQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaTruckLoading size={"1.2rem"} className="text-blue-500 mr-1" />
                      <div className="ml-4">{displayTon(inTransitData.sentGrossQuantity)}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
                      <div className="ml-4">{displayTon(inTransitData.sentNetQuantity)}</div>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="font-bold mb-2">{'Tujuan'}</div>
                  <div className="text-sm">
                    <div className="flex items-center mb-1">
                      <FaMapMarkerAlt size={"1.2rem"} className="text-rose-500 mr-1" />
                      <div className="ml-4">{inTransitData.toWarehouse?.name}</div>
                    </div>
                    <div className="flex items-center mb-1">
                      <FaRegCalendarCheck size={"1.2rem"} className="text-amber-400 mr-1" />
                      <div className="ml-4">{inTransitData.receivedTime ? displayDateTime(inTransitData.receivedTime) : '-'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex justify-between text-xs">
                <div>
                  <div className="uppercase">{inTransitData.vehicle?.plateNumber}</div>
                  <div className="">{inTransitData.vehicle?.driverName}</div>
                </div>
                <div>
                  <div className="text-right">{inTransitData.createName}</div>
                  <div>{displayDateTime(inTransitData.createDt)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Pengiriman Keluar', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-4'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-4'>
                  <Link href={{ pathname: '/transfer-out/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>Buat Pengiriman Keluar</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div>Loading</div>
              ) : (
                <div>
                  {transferouts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {transferouts.map((data) => (
                        <RenderCard
                          key={data.id}
                          data={data}
                          handleGenerateDeliveryOrder={handleGenerateDeliveryOrder}
                          toggleModalEditTransferout={toggleModalEditTransferout}
                          toggleModalPhoto={toggleModalPhoto}
                          toggleModalDetail={toggleModalDetail}
                          toggleModalDelete={toggleModalDelete}
                          toggleModalSetInTransit={toggleModalSetInTransit}
                          isPendingDelete={isPendingDelete}
                          isPendingSetInTransit={isPendingSetInTransit}
                          isPendingDeliveryOrder={isPendingDeliveryOrder}
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