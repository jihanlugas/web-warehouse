import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { PurchaseorderView, PagePurchaseorder } from "@/types/purchaseorder";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayMoney } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainViewer from "@/components/layout/main-viewer";
import { Tooltip } from "react-tooltip";
import { ImSpinner2 } from 'react-icons/im';
import { PiFolderOpenDuotone } from "react-icons/pi";

type Props = object

const Index: NextPage<Props> = () => {

  const [purchaseorders, setPurchaseorders] = useState<PurchaseorderView[]>([]);

  const [pageRequest] = useState<PagePurchaseorder>({
    limit: 10,
    page: 1,
    preloads: "Customer",
  });

  const RenderStatus: NextPage<{ purchaseorder: PurchaseorderView }> = ({ purchaseorder }) => {
    switch (purchaseorder.purchaseorderStatus) {
      case "OPEN":
        return (
          <div className='w-full'>
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${purchaseorder.id}`}>{purchaseorder.purchaseorderStatus}</span>
            <Tooltip id={`tootltip-status-${purchaseorder.id}`}>
              <div className="font-bold">{"Status"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex">
                <div className="w-12 font-bold">OPEN</div>
                <div>Operator available to create new delivery</div>
              </div>
              <div className="flex">
                <div className="w-12 font-bold">CLOSE</div>
                <div>Operator unavailable to create new delivery</div>
              </div>
            </Tooltip>
          </div>
        )
      case "CLOSE":
        return (
          <div className='w-full'>
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-rose-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${purchaseorder.id}`}>{purchaseorder.purchaseorderStatus}</span>
            <Tooltip id={`tootltip-status-${purchaseorder.id}`}>
              <div className="font-bold">{"Status"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex">
                <div className="w-12 font-bold">OPEN</div>
                <div>Operator available to create new delivery</div>
              </div>
              <div className="flex">
                <div className="w-12 font-bold">CLOSE</div>
                <div>Operator unavailable to create new delivery</div>
              </div>
            </Tooltip>
          </div>
        )
      default:
        return null
    }
  }

  const { isLoading, data } = useQuery({
    queryKey: ['purchase-order', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/purchase-order', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setPurchaseorders(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Purchase Order'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Purchase Order', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <ImSpinner2 className={'animate-spin text-blue-500'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              {purchaseorders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4">
                  {purchaseorders.map((purchaseorder) => {
                    return (
                      <div key={purchaseorder.id} className="p-2 border-l-4 border-gray-400 rounded text-sm">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold">{purchaseorder.number}</div>
                          <div>
                            <RenderStatus purchaseorder={purchaseorder} />
                          </div>
                        </div>
                        <hr className="border mb-2 border-gray-200" />
                        <div className="flex justify-between items-center mb-2">
                          <div>Pelanggan</div>
                          <div>{purchaseorder.customer?.name || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Total Harga</div>
                          <div className="font-bold">{displayMoney(purchaseorder.totalPrice)}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Total Pembayaran</div>
                          <div className="font-bold text-green-500">{displayMoney(purchaseorder.totalPayment)}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Sisa Pembayaran</div>
                          <div className="font-bold text-rose-500">{displayMoney(purchaseorder.outstanding)}</div>
                        </div>
                        <div className="flex justify-end mt-2 text-sm">
                          <div>{displayDateTime(purchaseorder.createDt)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className='w-full text-center my-4'>
                  <div className='flex justify-center items-center mb-4'>
                    <PiFolderOpenDuotone size={'3rem'} className={'text-gray-500'} />
                  </div>
                  <div>
                    {'Data Tidak Ditemukan'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainViewer;

export default Index;