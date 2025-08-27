import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { WarehouseView } from "@/types/warehouse";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from 'react-icons/im';
import MainViewer from "@/components/layout/main-viewer";
import { StockView } from "@/types/stock";
import { displayDateTime, displayTon } from "@/utils/formater";
import { PageStocklog, StocklogView } from "@/types/stocklog";
import { PageInfo } from "@/types/pagination";
import { ColumnDef, Row } from "@tanstack/react-table";
import { removeEmptyValues } from "@/utils/helper";
import Table from "@/components/table/table";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { VehicleView } from "@/types/vehicle";
import { PageStockmovementvehicle, StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { Tooltip } from "react-tooltip";
import { StockmovementvehiclephotoView } from "@/types/stockmovementvehiclephoto";
import ModalPhoto from "@/components/modal/modal-photo";
import ModalAdjustmentStock from "@/components/modal/modal-adjusment-stock";
import { FaRightLeft } from "react-icons/fa6";
import { PiFolderOpenDuotone } from "react-icons/pi";



type Props = {
  id: string
}

type PropsStock = {
  stock: StockView
  refetch: () => void
}

type PropsTransferIn = {
  warehouse: WarehouseView
}

type PropsTransferOut = {
  warehouse: WarehouseView
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

const TransferIn: NextPage<PropsTransferIn> = ({ warehouse }) => {
  const [stockmovementvehicles, setStockmovementvehicles] = useState<StockmovementvehicleView[]>([]);
  // const [selectedId, setSelectedId] = useState<string>('')
  // const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);

  const [pageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    toWarehouseId: warehouse.id,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos,Vehicle",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  // const toggleModalPhoto = (id = '', refresh = false) => {
  //   if (refresh) {
  //     refetch()
  //   }
  //   setSelectedId(id)
  //   setShowModalPhoto(!showModalPhoto);
  // };

  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicles(data.payload.list);
    }
  }, [data]);

  return (
    <div className=''>
      {/* <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
      /> */}
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
  )
}

const TransferOut: NextPage<PropsTransferOut> = ({ warehouse }) => {
  const [stockmovementvehicles, setStockmovementvehicles] = useState<StockmovementvehicleView[]>([]);
  // const [selectedId, setSelectedId] = useState<string>('')
  // const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);


  const [pageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    fromWarehouseId: warehouse.id,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos,Vehicle",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  // const toggleModalPhoto = (id = '', refresh = false,) => {
  //   if (refresh) {
  //     refetch()
  //   }
  //   setSelectedId(id)
  //   setShowModalPhoto(!showModalPhoto);
  // };


  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicles(data.payload.list);
    }
  }, [data]);

  return (
    <div className=''>
      {/* <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
      /> */}
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
  )
}

const Stock: NextPage<PropsStock> = ({ stock }) => {

  const [stocklogs, setStocklogs] = useState<StocklogView[]>([]);

  const [filter] = useState<PageStocklog>({
    stockmovementId: '',
    stockmovementvehicleId: '',
    productId: '',
    vehicleId: '',
    type: '',
    startGrossQuantity: '',
    startTareQuantity: '',
    startNetQuantity: '',
    endGrossQuantity: '',
    endTareQuantity: '',
    endNetQuantity: '',
    createName: '',
    startCreateDt: '',
    endCreateDt: '',
  })

  const [pageRequest, setPageRequest] = useState<PageStocklog>({
    limit: 10,
    page: 1,
    preloads: "Stockmovementvehicle,Vehicle",
    warehouseId: stock.warehouseId,
    stockId: stock.id,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['stocklog', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stocklog', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setStocklogs(data.payload.list);
    }
  }, [data]);

  useEffect(() => {
    setPageRequest(removeEmptyValues({
      ...pageRequest,
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    }))
  }, [filter])

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="py-20">
            <ImSpinner2 className={'animate-spin'} size={'5rem'} />
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg text-gray-600 flex">
              <div className="mr-4">{stock.product?.name || stock.id}</div>
              <div className="font-bold mr-4">{displayTon(stock.quantity)}</div>
            </div>
          </div>
          {stocklogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4">
              {stocklogs.map((stocklog) => {
                return (
                  <div key={stocklog.id} className="p-2 border-l-4 border-gray-400 rounded text-sm">
                    <div className="mb-1">
                      {stocklog.stocklogType === "IN" && (
                        <div className='w-full capitalize text-right'>
                          <div className="flex items-center">
                            <ImArrowDown size={"0.8rem"} className="text-sky-500 mr-2" />
                            <RenderType type={stocklog.stockmovementvehicle?.stockmovementvehicleType} />
                          </div>
                        </div>
                      )}
                      {stocklog.stocklogType === "OUT" && (
                        <div className='w-full capitalize text-right'>
                          <div className="flex items-center">
                            <ImArrowUp size={"0.8rem"} className="text-rose-500 mr-2" />
                            <RenderType type={stocklog.stockmovementvehicle?.stockmovementvehicleType} />
                          </div>
                        </div>
                      )}
                      {stocklog.stocklogType === "ADJUSTMENT" && (
                        <div className='w-full capitalize text-right'>
                          <div className="flex items-center">
                            <FaRightLeft size={"0.8rem"} className="text-amber-500 mr-2" />
                            <div>{"ADJUSTMENT"}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <div>{displayDateTime(stocklog.createDt)}</div>
                      <div>{displayTon(stocklog.netQuantity)}</div>
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
  )
}

const Index: NextPage<Props> = ({ id }) => {

  const tabStock = "STOCKLOG"
  const tabTransferin = "TRANSFERIN"
  const tabTransferout = "TRANSFEROUT"


  const [warehouse, setWarehouse] = useState<WarehouseView>(null)
  const [tab, setTab] = useState(tabStock)

  const preloads = 'Stocks,Stocks.Product'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['warehouse', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/warehouse/' + id, { preloads }) : null
    },
  })

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setWarehouse(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Warehouse Detail'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Warehouse', path: '/viewer/warehouse' },
            { name: warehouse?.name || id, path: '' },
          ]}
        />
        <div className=''>
          {isLoading ? (
            <div className='bg-white mb-4 p-4 rounded shadow'>
              <div className="flex justify-center items-center">
                <div className="py-20">
                  <ImSpinner2 className={'animate-spin'} size={'5rem'} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              {warehouse && (
                <>
                  <div className="bg-white mb-4 p-2 rounded shadow">
                    <div className="flex max-w-lg ">
                      <button
                        type="button"
                        onClick={() => setTab(tabStock)}
                        className={`flex-1 px-4 py-2 text-center ${tab === tabStock
                          ? "border-gray-500 text-primary-600 font-semibold"
                          : "text-gray-600 hover:text-primary-500"
                          }`}
                      >
                        Stock Product
                      </button>

                      {true && (
                        <button
                          type="button"
                          onClick={() => setTab(tabTransferin)}
                          className={`flex-1 px-4 py-2 text-center ${tab === tabTransferin
                            ? "border-gray-500 text-primary-600 font-semibold"
                            : "text-gray-600 hover:text-primary-500"
                            }`}
                        >
                          Pengiriman Masuk
                        </button>
                      )}

                      {true && (
                        <button
                          type="button"
                          onClick={() => setTab(tabTransferout)}
                          className={`flex-1 px-4 py-2 text-center ${tab === tabTransferout
                            ? "border-gray-500 text-primary-600 font-semibold"
                            : "text-gray-600 hover:text-primary-500"
                            }`}
                        >
                          Pengiriman Keluar
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='bg-white mb-4 p-4 rounded shadow'>
                    {tab === tabStock && (
                      <div className='mb-4'>
                        {warehouse?.stocks.map((stock) => (
                          <Stock key={stock.id} stock={stock} refetch={refetch} />
                        ))}
                      </div>
                    )}
                    {tab === tabTransferin && (
                      <div className='mb-4'>
                        <TransferIn warehouse={warehouse} />
                      </div>
                    )}
                    {tab === tabTransferout && (
                      <div className='mb-4'>
                        <TransferOut warehouse={warehouse} />
                      </div>
                    )}
                  </div>

                  {/* {warehouse.isTransferIn && (
                    <div className='bg-white mb-4 p-4 rounded shadow'>
                      <div className="text-xl flex justify-between items-center mb-2">
                        <div>Pengiriman Masuk</div>
                      </div>
                      <div>
                        <TransferIn warehouse={warehouse} />
                      </div>
                    </div>
                  )}
                  {warehouse.isTransferOut && (
                    <div className='bg-white mb-4 p-4 rounded shadow'>
                      <div className="text-xl flex justify-between items-center mb-2">
                        <div>Pengiriman Keluar</div>
                      </div>
                      <div>
                        <TransferOut warehouse={warehouse} />
                      </div>
                    </div>
                  )}
                  <div className='bg-white mb-4 p-4 rounded shadow'>
                    {warehouse?.stocks.map((stock) => (
                      <Stock key={stock.id} stock={stock} refetch={refetch} />
                    ))}
                  </div> */}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



(Index as PageWithLayoutType).layout = MainViewer;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;
