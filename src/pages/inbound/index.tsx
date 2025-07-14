import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { InboundView, PageInbound } from "@/types/inbound";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ModalConfirm from "@/components/modal/modal-confirm";
import ModalEditInbound from "@/components/modal/modal-edit-inbound";
import { PiFolderOpenDuotone } from "react-icons/pi";

type Props = object

type PropsDeliveryState = {
  inbound: InboundView
}

const DeliveryState: NextPage<PropsDeliveryState> = ({ inbound }) => {
  if (inbound.sentTime === null) {
    return (
      <div className="bg-yellow-500 px-2 py-1 rounded-full font-bold text-gray-50 text-xs">{'LOADING'}</div>
    )
  } else if (inbound.sentTime !== null && inbound.recivedTime === null && inbound.recivedGrossQuantity === 0) {
    return (
      <div className="bg-blue-600 px-2 py-1 rounded-full font-bold text-gray-50 text-xs">{'IN TRANSIT'}</div>
    )
  } else if (inbound.sentTime !== null && inbound.recivedTime === null && inbound.recivedGrossQuantity !== 0) {
    return (
      <div className="bg-amber-600 px-2 py-1 rounded-full font-bold text-gray-50 text-xs">{'UNLOADING'}</div>
    )
  } else if (inbound.sentTime !== null && inbound.recivedTime !== null) {
    return (
      <div className="bg-green-600 px-2 py-1 rounded-full font-bold text-gray-50 text-xs">{'COMPLETED'}</div>
    )
  }

  return null
}



const Index: NextPage<Props> = () => {


  const [inbound, setInbound] = useState<InboundView[]>([]);
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
  const [confirmId, setConfirmId] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalEditInbound, setShowModalEditInbound] = useState<boolean>(false);

  const [pageRequest] = useState<PageInbound>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "Stockmovement,Stockmovement.FromWarehouse,Vehicle",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['inbound', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/inbound', queryKey[1] as object),
  });

  const { mutate: mutateRecived, isPending: isPendingRecived } = useMutation({
    mutationKey: ['inbound', confirmId, 'set-recived'],
    mutationFn: (id: string) => Api.get('/inbound/' + id + '/set-recived')
  });

  const { mutate: mutateDeliveryRecipt, isPending: isPendingDeliveryRecipt } = useMutation({
    mutationKey: ['inbound', 'generate-delivery-recipt'],
    mutationFn: (id: string) => Api.getpdf('/inbound/' + id + "/generate-delivery-recipt"),
  })

  const toggleModalConfirm = (id = '') => {
    setConfirmId(id);
    setShowModalConfirm(!showModalConfirm);
  };


  useEffect(() => {
    if (data?.status) {
      setInbound(data.payload.list);
    }
  }, [data]);

  const handleRecived = () => {
    mutateRecived(confirmId, {
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

  const toggleModalEditInbound = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditInbound(!showModalEditInbound);
  };

  const handleGenerateDeliveryRecipt = async (id: string) => {
    mutateDeliveryRecipt(id, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Transfer In'}</title>
      </Head>
      <ModalEditInbound
        show={showModalEditInbound}
        onClickOverlay={toggleModalEditInbound}
        id={selectedId}
      />
      <ModalConfirm
        show={showModalConfirm}
        onClickOverlay={toggleModalConfirm}
        onConfirm={handleRecived}
        isLoading={isPendingRecived}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Are you sure the preparation is done</div>
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
                  {inbound.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {inbound.map((data) => (
                        <div key={data.id} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                          <div className="flex justify-between items-center">
                            <div className="text-base">
                              <div className="font-bold">{data.number}</div>
                              <div className="">
                                <div className="">{data?.stockmovement?.fromWarehouse?.name}</div>
                              </div>
                            </div>
                            <div><DeliveryState inbound={data} /></div>
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
                              <div className="">{'Recived time : '}</div>
                              <div className="ml-4">{data.recivedTime ? displayDateTime(data.recivedTime) : '-'}</div>
                            </div>
                          </div>
                          <div className="text-right text-xs mb-2">
                            <div className="">{data.createName}</div>
                            <div>{displayDateTime(data.createDt)}</div>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div className="text-primary-400 flex justify-end">
                            {data.recivedTime ? (
                              <button
                                className="ml-4 px-2 py-1"
                                onClick={() => handleGenerateDeliveryRecipt(data.id)}
                                disabled={isPendingDeliveryRecipt}
                              >
                                {isPendingDeliveryRecipt ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Delivery Recipt</div>}
                              </button>
                            ) : (
                              <>
                                {data.recivedGrossQuantity !== 0 && (
                                  <button
                                    className="ml-4 px-2 py-1"
                                    onClick={() => toggleModalConfirm(data.id)}
                                    disabled={isPendingRecived}
                                  >
                                    {isPendingRecived ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Set Recived</div>}
                                  </button>
                                )}
                                <button
                                  className="ml-4 px-2 py-1"
                                  onClick={() => toggleModalEditInbound(data.id)}
                                  disabled={isPendingRecived}
                                >
                                  {isPendingRecived ? <AiOutlineLoading3Quarters className={'animate-spin'} size={'1.2rem'} /> : <div>Unloading</div>}
                                </button>
                              </>
                            )}
                            <Link key={data.id} href={{ pathname: '/inbound/[id]', query: { id: data.id } }}>
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