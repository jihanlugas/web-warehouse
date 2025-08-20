import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import { PageStockin } from "@/types/stockin";
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
import { PiFolderOpenDuotone } from "react-icons/pi";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { LoginUser } from "@/types/auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalConfirm from "@/components/modal/modal-confirm";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";
import { HiDotsVertical } from "react-icons/hi";
import { FaMapMarkerAlt, FaBalanceScale } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { TbNotes, TbPackage } from "react-icons/tb";

type Props = {
  loginUser: LoginUser
}

type PropsCard = {
  data: StockmovementvehicleView
  toggleModalSetComplete: (id?: string) => void
  toggleModalDelete: (id?: string, verify?: string) => void
  toggleModalDetail: (id?: string) => void
  isPendingSetComplete: boolean
  isPendingDelete: boolean
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
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-blue-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
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

const RenderCard: NextPage<PropsCard> = ({ data, toggleModalDelete, toggleModalDetail, toggleModalSetComplete, isPendingSetComplete, isPendingDelete }) => {

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
                {data.stockmovementvehicleStatus === 'UNLOADING' && (
                  <>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalSetComplete(data.id)}
                      disabled={isPendingSetComplete}
                    >
                      {isPendingSetComplete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set Complete</div>}
                    </button>
                    <button
                      className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}
                      onClick={() => toggleModalDelete(data.id, data.number)}
                      disabled={isPendingDelete}
                    >
                      {isPendingDelete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delete</div>}
                    </button>
                  </>
                )}
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
          <div className="font-bold mb-2">{'Diterima'}</div>
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
              <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
              <div className="ml-4">{displayTon(data.receivedNetQuantity)}</div>
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

  const [stockins, setStockins] = useState<StockmovementvehicleView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalSetComplete, setShowModalSetComplete] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [completeId, setCompleteId] = useState<string>('');
  const [completeData, setCompleteData] = useState<StockmovementvehicleView>(null);

  const [pageRequest] = useState<PageStockin>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "ToWarehouse,Product",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', 'stock-in', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle/stock-in', queryKey[2] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'stock-in', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/stock-in/' + id)
  });


  const { mutate: mutateSetComplete, isPending: isPendingSetComplete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'stock-in', completeId, 'set-complete'],
    mutationFn: (id: string) => Api.put('/stockmovementvehicle/stock-in/' + id + '/set-complete')
  });

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
    setCompleteData(stockins.find(data => data.id === id));
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

  useEffect(() => {
    if (data?.status) {
      setStockins(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Stockin'}</title>
      </Head>
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
            <div>
              <div className="flex items-center mb-1">
                <TbPackage size={"1.2rem"} className="text-gray-500 mr-1" />
                <div className="ml-4">{completeData.product?.name}</div>
              </div>
              <div className="flex items-center mb-1">
                <TbNotes size={"1.2rem"} className="text-gray-500 mr-1" />
                <div className="ml-4">{completeData.notes || '-'}</div>
              </div>
              <div className="flex items-center mb-1">
                <FaBalanceScale size={"1.2rem"} className="text-green-500 mr-1" />
                <div className="ml-4">{displayTon(completeData.receivedNetQuantity)}</div>
              </div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Stock Masuk', path: '' },
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
                  <Link href={{ pathname: '/stock-in/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>Buat Stock Masuk</div>
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
                  {stockins.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {stockins.map((data) => (
                        <RenderCard
                          key={data.id}
                          data={data}
                          toggleModalDetail={toggleModalDetail}
                          toggleModalDelete={toggleModalDelete}
                          toggleModalSetComplete={toggleModalSetComplete}
                          isPendingDelete={isPendingDelete}
                          isPendingSetComplete={isPendingSetComplete}
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