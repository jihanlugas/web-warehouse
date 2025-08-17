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
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { LoginUser } from "@/types/auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalConfirm from "@/components/modal/modal-confirm";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";

type Props = {
  loginUser: LoginUser
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
    preloads: "Product",
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
              <div>Product : {completeData.product.name}</div>
              <div>Quantity : {displayTon(completeData.receivedNetQuantity)}</div>
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
                      {stockins.map((data, key) => (
                        <div key={key} className="">
                          <div className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                            <div className="flex justify-between items-center">
                              <div className="text-lg">{data?.number}</div>
                              <div><RenderStatus status={data.stockmovementvehicleStatus} /></div>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div>
                              <div className="text-lg">{data?.product?.name}</div>
                              <div className="">{displayTon(data.receivedNetQuantity)}</div>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="text-sm">{data.notes}</div>
                            <div className="text-sm text-right mt-4">
                              <div className="">{displayDateTime(data.createDt)}</div>
                              <div className="">{data.createName}</div>
                            </div>
                            <hr className="my-2 border-gray-200" />
                            <div className="text-primary-400 flex justify-end">
                              {data.stockmovementvehicleStatus === 'UNLOADING' && (
                                <>
                                  <button
                                    className="ml-4 px-2 py-1 cursor-pointer"
                                    onClick={() => toggleModalSetComplete(data.id)}
                                    disabled={isPendingSetComplete}
                                  >
                                    {isPendingSetComplete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set Complete</div>}
                                  </button>
                                  <button
                                    className="ml-4 px-2 py-1 cursor-pointer"
                                    onClick={() => toggleModalDelete(data.id, data.number)}
                                    disabled={isPendingDelete}
                                  >
                                    {isPendingDelete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delete</div>}
                                  </button>
                                </>
                              )}
                              <button
                                className="ml-4 px-2 py-1 cursor-pointer"
                                onClick={() => toggleModalDetail(data.id)}
                              >
                                <div>Detail</div>
                              </button>
                            </div>
                          </div>
                        </div>
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