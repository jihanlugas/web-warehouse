import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { StockmovementvehicleView, PageStockmovementvehicle } from "@/types/stockmovementvehicle";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayTon } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainViewer from "@/components/layout/main-viewer";
import { Tooltip } from "react-tooltip";
import { PiFolderOpenDuotone } from "react-icons/pi";
import { ImSpinner2 } from "react-icons/im";

type Props = object


const RenderType = ({ type }) => {
  switch (type) {
    case "IN":
      return (
        <div className="">STOCK IN</div>
      )
    case "TRANSFER":
      return (
        <div className="">TRANSFER</div>
      )
    case "PURCHASE_ORDER":
      return (
        <div className="">PURCHASE ORDER</div>
      )
    case "RETAIL":
      return (
        <div className="">RETAIL</div>
      )
    default:
      return null
  }
}



const RenderStatus: NextPage<{ stockmovementvehicle: StockmovementvehicleView }> = ({ stockmovementvehicle }) => {

  const TooltipIn = ({ id }) => {
    return (
      <Tooltip id={id}>
        <div className="font-bold">{"Status Stock Masuk"}</div>
        <hr className='border-gray-500 border-1 my-2' />
        <div className="flex my-1">
          <div className="w-20 font-bold">UNLOADING</div>
          <div>Barang sedang di bongkar di lokasi tujuan</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">COMPLETED</div>
          <div>Barang sudah diterima</div>
        </div>
      </Tooltip>
    )
  }
  const TooltipTransfer = ({ id }) => {
    return (
      <Tooltip id={id}>
        <div className="font-bold">{"Status Transfer"}</div>
        <hr className='border-gray-500 border-1 my-2' />
        <div className="flex my-1">
          <div className="w-20 font-bold">LOADING</div>
          <div>Barang sedang di muat untuk dikirim</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">IN TRANSIT</div>
          <div>Barang dalam perjalanan ke lokasi tujuan</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">UNLOADING</div>
          <div>Barang sedang di bongkar di lokasi tujuan</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">COMPLETED</div>
          <div>Barang sudah diterima</div>
        </div>
      </Tooltip>
    )
  }
  const TooltipRetail = ({ id }) => {
    return (
      <Tooltip id={id}>
        <div className="font-bold">{"Status Retail"}</div>
        <hr className='border-gray-500 border-1 my-2' />
        <div className="flex my-1">
          <div className="w-20 font-bold">LOADING</div>
          <div>Barang sedang di muat untuk dikirim</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">COMPLETED</div>
          <div>Barang sudah dikirim</div>
        </div>
      </Tooltip>
    )
  }
  const TooltipPurchaseorder = ({ id }) => {
    return (
      <Tooltip id={id}>
        <div className="font-bold">{"Status Purchase Order"}</div>
        <hr className='border-gray-500 border-1 my-2' />
        <div className="flex my-1">
          <div className="w-20 font-bold">LOADING</div>
          <div>Barang sedang di muat untuk dikirim</div>
        </div>
        <div className="flex my-1">
          <div className="w-20 font-bold">COMPLETED</div>
          <div>Barang sudah dikirim</div>
        </div>
      </Tooltip>
    )
  }

  switch (stockmovementvehicle.stockmovementvehicleType) {
    case "IN":
      switch (stockmovementvehicle.stockmovementvehicleStatus) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipIn id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "UNLOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipIn id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        default:
          return null
      }
    case "TRANSFER":
      switch (stockmovementvehicle.stockmovementvehicleStatus) {
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipTransfer id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "IN_TRANSIT":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-blue-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipTransfer id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "UNLOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipTransfer id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipTransfer id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        default:
          return null
      }
    case "RETAIL":
      switch (stockmovementvehicle.stockmovementvehicleStatus) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipRetail id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipRetail id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        default:
          return null
      }
    case "PURCHASE_ORDER":
      switch (stockmovementvehicle.stockmovementvehicleStatus) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipPurchaseorder id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${stockmovementvehicle.id}`}>{stockmovementvehicle.stockmovementvehicleStatus}</span>
              <TooltipPurchaseorder id={`tootltip-status-${stockmovementvehicle.id}`} />
            </div>
          )
        default:
          return null
      }
    default:
      return null
  }
}


const Index: NextPage<Props> = () => {

  const [stockmovementvehicles, setStockmovementvehicles] = useState<StockmovementvehicleView[]>([]);

  const [pageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicles(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Pengiriman'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Pengiriman', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <ImSpinner2 className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              {stockmovementvehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4">
                  {stockmovementvehicles.map((stockmovementvehicle) => {
                    return (
                      <div key={stockmovementvehicle.id} className="p-2 border-l-4 border-gray-400 rounded text-sm">
                        <div className="mb-2 font-bold">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="">{stockmovementvehicle.number}</div>
                              <RenderType type={stockmovementvehicle.stockmovementvehicleType} />
                            </div>
                            <div>
                              <RenderStatus stockmovementvehicle={stockmovementvehicle} />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>{"Kendaran"}</div>
                          <div>{stockmovementvehicle.vehicle ? stockmovementvehicle.vehicle.driverName + ' | ' + stockmovementvehicle.vehicle.plateNumber : '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>{"Dari"}</div>
                          <div>{stockmovementvehicle.fromWarehouse?.name || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>{"Tujuan"}</div>
                          <div>{stockmovementvehicle.toWarehouse?.name || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Tanggal Dikirim</div>
                          <div>{displayDateTime(stockmovementvehicle.sentTime) || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Berat Dikirim</div>
                          <div>{displayTon(stockmovementvehicle.sentNetQuantity)}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Tanggal Diterima</div>
                          <div>{displayDateTime(stockmovementvehicle.receivedTime) || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Berat Diterima</div>
                          <div>{stockmovementvehicle.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(stockmovementvehicle.receivedNetQuantity) : '-'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>Penyusutan</div>
                          <div>{stockmovementvehicle.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(stockmovementvehicle.shrinkage) : '-'}</div>
                        </div>
                      </div>
                    )
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



