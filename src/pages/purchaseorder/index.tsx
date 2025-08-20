import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { PageStockmovementvehiclePurchaseorder } from "@/types/stockmovementvehiclepurchaseorder";
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
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalConfirm from "@/components/modal/modal-confirm";
import { LoginUser } from "@/types/auth";
import { PiFolderOpenDuotone } from "react-icons/pi";
import ModalEditStockmovementvehiclePurchasorder from "@/components/modal/modal-edit-stockmovementvehicle-purchaseorder";
import ModalPhoto from "@/components/modal/modal-photo";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";
import { HiDotsVertical } from "react-icons/hi";
import { RiTruckLine } from "react-icons/ri";
import { FaBalanceScale, FaMapMarkerAlt, FaRegCalendarCheck, FaTruckLoading } from "react-icons/fa";
import { TbPackage, TbNotes } from "react-icons/tb";

type Props = {
  loginUser: LoginUser
}

type PropsCard = {
  data: StockmovementvehicleView
  toggleModalSetComplete: (id?: string) => void
  toggleModalDelete: (id?: string, verify?: string) => void
  toggleModalDetail: (id?: string) => void
  toggleModalPhoto: (id?: string, refresh?: boolean, status?: string) => void
  toggleModalEditStockmovementvehiclePurchasorder: (id?: string, refresh?: boolean) => void
  handleGenerateDeliveryOrder: (id?: string) => void
  isPendingSetComplete: boolean
  isPendingDelete: boolean
  isPendingDeliveryOrder: boolean
}

const RenderStatus = ({ status }) => {
  switch (status) {
    case "LOADING":
      return (
        <div className="">
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} >{status}</span>
        </div>
      )
    case "COMPLETED":
      return (
        <div className="">
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} >{status}</span>
        </div>
      )
    default:
      break;
  }
}

const RenderCard: NextPage<PropsCard> = ({ data, toggleModalSetComplete, toggleModalDelete, toggleModalDetail, toggleModalPhoto, toggleModalEditStockmovementvehiclePurchasorder, handleGenerateDeliveryOrder, isPendingSetComplete, isPendingDelete, isPendingDeliveryOrder }) => {

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
                {data.stockmovementvehicleStatus === 'LOADING' && (
                  <>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalSetComplete(data.id)}
                      disabled={isPendingSetComplete}
                    >
                      <div className="flex">
                        <div>Set Complete</div>
                        {isPendingSetComplete && <AiOutlineLoading3Quarters className={'ml-4 animate-spin'} size={'1.2rem'} />}
                      </div>
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalDelete(data.id, data.number)}
                      disabled={isPendingDelete}
                    >
                      <div className="flex">
                        <div>Delete</div>
                        {isPendingDelete && <AiOutlineLoading3Quarters className={'ml-4 animate-spin'} size={'1.2rem'} />}
                      </div>
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalEditStockmovementvehiclePurchasorder(data.id)}
                      disabled={isPendingDeliveryOrder}
                    >
                      <div>Loading</div>
                    </button>
                  </>
                )}
                {data.stockmovementvehicleStatus === 'COMPLETED' && (
                  <button
                    className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                    onClick={() => handleGenerateDeliveryOrder(data.id)}
                    disabled={isPendingDeliveryOrder}
                  >
                    <div className="flex">
                      <div>Surat Jalan</div>
                      {isPendingDeliveryOrder && <AiOutlineLoading3Quarters className={'ml-4 animate-spin'} size={'1.2rem'} />}
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
        <div className="flex items-center mb-1">
          <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
          <div className="ml-4">{data.notes || '-'}</div>
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
              <div className="ml-4">{data.purchaseorder?.customer?.name}</div>
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

const Index: NextPage<Props> = ({ }) => {

  const [stockmovementvehicles, setStockmovementvehicles] = useState<StockmovementvehicleView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalSetComplete, setShowModalSetComplete] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [completeId, setCompleteId] = useState<string>('');
  const [completeData, setCompleteData] = useState<StockmovementvehicleView>(null);
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalEditStockmovementvehiclePurchasorder, setShowModalEditStockmovementvehiclePurchasorder] = useState<boolean>(false);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);


  const [pageRequest] = useState<PageStockmovementvehiclePurchaseorder>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "FromWarehouse,Product,Purchaseorder,Purchaseorder.Customer,Vehicle",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', 'purchase-order', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle/purchase-order', queryKey[2] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'purchase-order', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/purchase-order/' + id)
  });

  const { mutate: mutateSetComplete, isPending: isPendingSetComplete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'purchase-order', completeId, 'set-complete'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/purchase-order/' + id + '/set-complete')
  });

  const { mutate: mutateDeliveryOrder, isPending: isPendingDeliveryOrder } = useMutation({
    mutationKey: ['stockmovementvehicle', 'purchase-order', 'generate-delivery-order'],
    mutationFn: (id: string) => Api.getpdf('/stockmovementvehicle/purchase-order/' + id + "/generate-delivery-order"),
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

  const toggleModalSetComplete = (id = '') => {
    setCompleteId(id);
    setCompleteData(stockmovementvehicles.find(data => data.id === id));
    setShowModalSetComplete(!showModalSetComplete);
  };


  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicles(data.payload.list);
    }
  }, [data]);

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

  const handleGenerateDeliveryOrder = async (id: string) => {
    mutateDeliveryOrder(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const toggleModalEditStockmovementvehiclePurchasorder = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditStockmovementvehiclePurchasorder(!showModalEditStockmovementvehiclePurchasorder);
  };

  const toggleModalPhoto = (id = '', refresh = false, status = '') => {
    if (refresh) {
      refetch()
    }
    setAllowAdd(status === 'LOADING')
    setSelectedId(id)
    setShowModalPhoto(!showModalPhoto);
  };

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Purchase Order'}</title>
      </Head>
      <ModalEditStockmovementvehiclePurchasorder
        show={showModalEditStockmovementvehiclePurchasorder}
        onClickOverlay={toggleModalEditStockmovementvehiclePurchasorder}
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
                <div className="flex items-center mb-1">
                  <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
                  <div className="ml-4">{completeData.notes || '-'}</div>
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
                      <div className="ml-4">{completeData.purchaseorder?.customer?.name}</div>
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
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Purchase Order', path: '' },
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
                  <Link href={{ pathname: '/purchaseorder/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>New</div>
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
                  {stockmovementvehicles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {stockmovementvehicles.map((data) => (
                        <RenderCard
                          key={data.id}
                          data={data}
                          handleGenerateDeliveryOrder={handleGenerateDeliveryOrder}
                          toggleModalEditStockmovementvehiclePurchasorder={toggleModalEditStockmovementvehiclePurchasorder}
                          toggleModalPhoto={toggleModalPhoto}
                          toggleModalDetail={toggleModalDetail}
                          toggleModalDelete={toggleModalDelete}
                          toggleModalSetComplete={toggleModalSetComplete}
                          isPendingDelete={isPendingDelete}
                          isPendingSetComplete={isPendingSetComplete}
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