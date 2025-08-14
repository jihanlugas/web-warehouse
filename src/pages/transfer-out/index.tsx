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
import { useEffect, useState } from "react";
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
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "ToWarehouse,Vehicle,Product",
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
        <title>{process.env.APP_NAME + ' - Transfer Out'}</title>
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
          <div className='mb-4'>Are you sure ?</div>
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
          <div className='mb-4'>Are you sure ?</div>
          {inTransitData && (
            <div className='text-sm mb-4 text-gray-700'>
              <div>Product : {inTransitData.product.name}</div>
              <div>Berat Kotor : {displayTon(inTransitData.sentGrossQuantity)}</div>
              <div>Berat Kosong : {displayTon(inTransitData.sentTareQuantity)}</div>
              <div>Berat Bersih : {displayTon(inTransitData.sentNetQuantity)}</div>
            </div>
          )}
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Transfer Out', path: '' },
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
                      <div>New Transfer Out</div>
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
                        <div key={data.id} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                          <div className="flex justify-between items-center">
                            <div className="text-base">
                              <div className="font-bold">{data.number}</div>
                              <div className="">
                                <div className="">{data?.toWarehouse?.name}</div>
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
                          </div>
                          <div className="text-right text-xs mb-2">
                            <div className="">{data.createName}</div>
                            <div>{displayDateTime(data.createDt)}</div>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div className="text-primary-400 flex justify-end">
                            {data.stockmovementvehicleStatus === 'LOADING' ? (
                              <>
                                <button
                                  className="ml-4 px-2 py-1"
                                  onClick={() => toggleModalSetInTransit(data.id)}
                                  disabled={isPendingSetInTransit}
                                >
                                  {isPendingSetInTransit ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set In Transit</div>}
                                </button>
                                <button
                                  className="ml-4 px-2 py-1"
                                  onClick={() => toggleModalEditTransferout(data.id)}
                                >
                                  <div>Loading</div>
                                </button>
                                <button
                                  className="ml-4 px-2 py-1 cursor-pointer"
                                  onClick={() => toggleModalDelete(data.id, data.number)}
                                  disabled={isPendingDelete}
                                >
                                  {isPendingDelete ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delete</div>}
                                </button>
                              </>
                            ) : (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => handleGenerateDeliveryOrder(data.id)}
                                disabled={isPendingDeliveryOrder}
                              >
                                {isPendingDeliveryOrder ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delivery Order</div>}
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