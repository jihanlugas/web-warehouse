import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import { OutboundView, PageOutbound } from "@/types/outbound";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalConfirm from "@/components/modal/modal-confirm";
import { PiFolderOpenDuotone } from "react-icons/pi";

type Props = object

const RenderStatus = ({ status }) => {
  switch (status) {
    case "LOADING":
      return (
        <div className='w-full'>
          <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${status}`}>{status}</span>
        </div>
      )
    case "IN TRANSIT":
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


  const [outbound, setOutbound] = useState<OutboundView[]>([]);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [confirmId, setConfirmId] = useState<string>('');


  const [pageRequest] = useState<PageOutbound>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "Stockmovement,Stockmovement.ToWarehouse,Vehicle",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['outbound', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/outbound', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['outbound', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/outbound/' + id)
  });

  const { mutate: mutateSent, isPending: isPendingSent } = useMutation({
    mutationKey: ['outbound', confirmId, 'set-sent'],
    mutationFn: (id: string) => Api.get('/outbound/' + id + '/set-sent')
  });

  const { mutate: mutateDeliveryOrder, isPending: isPendingDeliveryOrder } = useMutation({
    mutationKey: ['outbound', 'generate-delivery-order'],
    mutationFn: (id: string) => Api.getpdf('/outbound/' + id + "/generate-delivery-order"),
  })

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const toggleModalConfirm = (id = '') => {
    setConfirmId(id);
    setShowModalConfirm(!showModalConfirm);
  };


  useEffect(() => {
    if (data?.status) {
      setOutbound(data.payload.list);
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

  const handleSent = () => {
    mutateSent(confirmId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          refetch();
        } else {
          notif.error(message);
        }
        toggleModalConfirm();
      },
      onError: () => {
        notif.error('Please cek you connection');
        toggleModalConfirm();
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

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Transfer Out'}</title>
      </Head>
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
        show={showModalConfirm}
        onClickOverlay={toggleModalConfirm}
        onConfirm={handleSent}
        isLoading={isPendingSent}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Are you sure the preparation is done</div>
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
                  <Link href={{ pathname: '/outbound/new' }}>
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
                  {outbound.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {outbound.map((data) => (
                        <div key={data.id} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                          <div className="flex justify-between items-center">
                            <div className="text-base">
                              <div className="font-bold">{data.number}</div>
                              <div className="">
                                <div className="">{data?.stockmovement?.toWarehouse?.name}</div>
                              </div>
                            </div>
                            <div><RenderStatus status={data.status} /></div>
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
                            {data.sentTime ? (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => handleGenerateDeliveryOrder(data.id)}
                                disabled={isPendingDeliveryOrder}
                              >
                                {isPendingDeliveryOrder ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delivery Order</div>}
                              </button>
                            ) : (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => toggleModalConfirm(data.id)}
                                disabled={isPendingSent}
                              >
                                {isPendingSent ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Send</div>}
                              </button>
                            )}
                            <Link key={data.id} href={{ pathname: '/outbound/[id]', query: { id: data.id } }}>
                              <div className="ml-4 px-2 py-1">
                                Detail
                              </div>
                            </Link>
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