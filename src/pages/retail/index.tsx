import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { PageStockmovementvehicleRetail } from "@/types/stockmovementvehicleretail";
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
import ModalEditStockmovementvehicleRetail from "@/components/modal/modal-edit-stockmovementvehicle-retail";
import ModalPhoto from "@/components/modal/modal-photo";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";
import { HiDotsVertical } from "react-icons/hi";

type Props = {
  loginUser: LoginUser
}

type PropsCard = {
  data: StockmovementvehicleView
  toggleModalSetComplete: (id?: string) => void
  toggleModalDelete: (id?: string, verify?: string) => void
  toggleModalDetail: (id?: string) => void
  toggleModalPhoto: (id?: string, refresh?: boolean, status?: string) => void
  toggleModalEditStockmovementvehicleRetail: (id?: string, refresh?: boolean) => void
  handleGenerateDeliveryOrder: (id?: string) => void
  isPendingSetComplete: boolean
  isPendingDelete: boolean
  isPendingDeliveryOrder: boolean
}

const RenderStatus = ({ status }) => {
  switch (status) {
    case "LOADING":
      return (
        <div className="p-2 ">
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} >{status}</span>
        </div>
      )
    case "COMPLETED":
      return (
        <div className="p-2 ">
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} >{status}</span>
        </div>
      )
    default:
      break;
  }
}

const RenderCard: NextPage<PropsCard> = ({ data, toggleModalSetComplete, toggleModalDelete, toggleModalDetail, toggleModalPhoto, toggleModalEditStockmovementvehicleRetail, handleGenerateDeliveryOrder, isPendingSetComplete, isPendingDelete, isPendingDeliveryOrder }) => {

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
    <div key={data.id} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
      <div className="flex justify-between items-center">
        <div className="text-base">
          <div className="font-bold">{data.number}</div>
        </div>
        <div className="flex items-center">
          <RenderStatus status={data.stockmovementvehicleStatus} />
          <div className="ml-2 relative" ref={refMenu}>
            <button className="duration-300 rounded-full text-primary-400 hover:text-primary-500 hover:bg-gray-200 cursor-pointer p-2" onClick={() => setMenuBar(!menuBar)}>
              <HiDotsVertical className="" size={"1.5rem"} />
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
                      onClick={() => toggleModalEditStockmovementvehicleRetail(data.id)}
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
      <div className="">
        <div className="">{data?.purchaseorder?.customer?.name}</div>
      </div>
      <hr className="my-2 border-gray-200" />
      <div className="mb-2">
        <div className="mb-2">
          <div className="text-sm uppercase">{data?.vehicle?.plateNumber}</div>
          <div className="text-sm">{data?.vehicle?.driverName}</div>
        </div>
        <div className="text-sm flex">
          <div className="">{'Tanggal Dikirim : '}</div>
          <div className="ml-4">{data.sentTime ? displayDateTime(data.sentTime) : '-'}</div>
        </div>
      </div>
      <div className="text-right text-xs mb-2">
        <div className="">{data.createName}</div>
        <div>{displayDateTime(data.createDt)}</div>
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
  const [showModalEditStockmovementvehicleRetail, setShowModalEditStockmovementvehicleRetail] = useState<boolean>(false);
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);
  const [allowAdd, setAllowAdd] = useState<boolean>(false);


  const [pageRequest] = useState<PageStockmovementvehicleRetail>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "Product,Retail,Retail.Customer,Vehicle",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', 'retail', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle/retail', queryKey[2] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'retail', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/retail/' + id)
  });

  const { mutate: mutateSetComplete, isPending: isPendingSetComplete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'retail', completeId, 'set-complete'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/retail/' + id + '/set-complete')
  });

  const { mutate: mutateDeliveryOrder, isPending: isPendingDeliveryOrder } = useMutation({
    mutationKey: ['stockmovementvehicle', 'retail', 'generate-delivery-order'],
    mutationFn: (id: string) => Api.getpdf('/stockmovementvehicle/retail/' + id + "/generate-delivery-order"),
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

  const toggleModalEditStockmovementvehicleRetail = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditStockmovementvehicleRetail(!showModalEditStockmovementvehicleRetail);
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
        <title>{process.env.APP_NAME + ' - Retail'}</title>
      </Head>
      <ModalEditStockmovementvehicleRetail
        show={showModalEditStockmovementvehicleRetail}
        onClickOverlay={toggleModalEditStockmovementvehicleRetail}
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
          <div className='mb-4'>Are you sure ?</div>
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
          <div className='mb-4'>Are you sure ?</div>
          {completeData && (
            <div className='text-sm mb-4 text-gray-700'>
              <div>Retail : {completeData.retail?.customer?.name}</div>
              <div>Product : {completeData.product.name}</div>
              <div>Berat Kotor : {displayTon(completeData.sentGrossQuantity)}</div>
              <div>Berat Kosong : {displayTon(completeData.sentTareQuantity)}</div>
              <div>Berat Bersih : {displayTon(completeData.sentNetQuantity)}</div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '' },
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
                  <Link href={{ pathname: '/retail/new' }}>
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
                          toggleModalEditStockmovementvehicleRetail={toggleModalEditStockmovementvehicleRetail}
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