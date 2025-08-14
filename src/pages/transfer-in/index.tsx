import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayTon } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
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
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "FromWarehouse,Vehicle,Product",
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
        <title>{process.env.APP_NAME + ' - Transfer In'}</title>
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
              <div>Source : {completeData.fromWarehouse?.name}</div>
              <div>Product : {completeData.product.name}</div>
              <div>Berat Kotor : {displayTon(completeData.receivedGrossQuantity)}</div>
              <div>Berat Kosong : {displayTon(completeData.receivedTareQuantity)}</div>
              <div>Berat Bersih : {displayTon(completeData.receivedNetQuantity)}</div>
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
          <div className='mb-4'>Are you sure ?</div>
          {unloadingData && (
            <div className='text-sm mb-4 text-gray-700'>
              <div>Number : {unloadingData.number}</div>
              <div>Source : {unloadingData.fromWarehouse?.name}</div>
              <div>Product : {unloadingData.product.name}</div>
              <div>Vehicle Name : {unloadingData.vehicle?.name}</div>
              <div>Plate Number : {unloadingData.vehicle?.plateNumber}</div>
              <div>Product : {unloadingData.product.name}</div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Transfer In', path: '' },
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
                        <div key={data.id} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                          <div className="flex justify-between items-center">
                            <div className="text-base">
                              <div className="font-bold">{data.number}</div>
                              <div className="">
                                <div className="">{data?.fromWarehouse?.name}</div>
                              </div>
                            </div>
                            <div><RenderStatus status={data.stockmovementvehicleStatus} /></div>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div className="mb-2">
                            <div className="mb-2">
                              <div className="text-sm uppercase">{data?.vehicle?.plateNumber}</div>
                              <div className="text-sm">{data?.vehicle?.driverName}</div>
                            </div>
                            <div className="text-sm flex">
                              <div className="">{'Sent time : '}</div>
                              <div className="ml-4">{data.sentTime ? displayDateTime(data.sentTime) : '-'}</div>
                            </div>
                            <div className="text-sm flex">
                              <div className="">{'Received time : '}</div>
                              <div className="ml-4">{data.receivedTime ? displayDateTime(data.receivedTime) : '-'}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs mb-2">
                            <div className="">{data.createName}</div>
                            <div>{displayDateTime(data.createDt)}</div>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div className="text-primary-400 flex justify-end">
                            {data.stockmovementvehicleStatus === 'IN_TRANSIT' && (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => toggleModalSetUnloading(data.id)}
                                disabled={isPendingSetUnloading}
                              >
                                {isPendingSetUnloading ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set Unloading</div>}
                              </button>
                            )}
                            {data.stockmovementvehicleStatus === 'UNLOADING' && (
                              <>
                                <button
                                  className="ml-4 px-2 py-1"
                                  onClick={() => toggleModalSetComplete(data.id)}
                                  disabled={isPendingSetComplete}
                                >
                                  {isPendingSetComplete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set Complete</div>}
                                </button>
                                <button
                                  className="ml-4 px-2 py-1"
                                  onClick={() => toggleModalEditTransferIn(data.id)}
                                >
                                  <div>Unloading</div>
                                </button>
                              </>
                            )}
                            {data.stockmovementvehicleStatus === 'COMPLETED' && (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => handleGenerateDeliveryRecipt(data.id)}
                                disabled={isPendingDeliveryRecipt}
                              >
                                {isPendingDeliveryRecipt ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delivery Recipt</div>}
                              </button>
                            )}
                            <button
                              className="ml-4 px-2 py-1"
                              onClick={() => toggleModalPhoto(data.id, false, data.stockmovementvehicleStatus)}
                            >
                              <div>Photo</div>
                            </button>
                            <button
                              className="ml-4 px-2 py-1 cursor-pointer"
                              onClick={() => toggleModalDetail(data.id)}
                            >
                              <div>Detail</div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='w-full text-center my-16'>
                      <div className='flex justify-center items-center mb-4'>
                        <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                      </div>
                      <div className="text-xl">{'No data found'}</div>
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