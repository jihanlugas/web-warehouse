import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { WarehouseView } from "@/types/warehouse";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainAdmin from "@/components/layout/main-admin";
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
import { MdRefresh } from "react-icons/md";
import ModalAdjustmentStock from "@/components/modal/modal-adjusment-stock";
import { FaRightLeft } from "react-icons/fa6";



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

const RenderStatus: NextPage<{ value: string, row: Row<StockmovementvehicleView> }> = ({ value, row }) => {

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

  switch (row.original.stockmovementvehicleType) {
    case "IN":
      switch (value) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipIn id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "UNLOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipIn id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        default:
          return null
      }
    case "TRANSFER":
      switch (value) {
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipTransfer id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "IN_TRANSIT":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-blue-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipTransfer id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "UNLOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-amber-600 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipTransfer id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipTransfer id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        default:
          return null
      }
    case "RETAIL":
      switch (value) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipRetail id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipRetail id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        default:
          return null
      }
    case "PURCHASE_ORDER":
      switch (value) {
        case "COMPLETED":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipPurchaseorder id={`tootltip-status-${row.original.id}`} />
            </div>
          )
        case "LOADING":
          return (
            <div className='w-full'>
              <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
              <TooltipPurchaseorder id={`tootltip-status-${row.original.id}`} />
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
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView[]>([]);
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    toWarehouseId: warehouse.id,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  const toggleModalPhoto = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalPhoto(!showModalPhoto);
  };

  const column: ColumnDef<StockmovementvehicleView>[] = [
    {
      id: 'number',
      accessorKey: 'number',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nomor Pengiriman"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{getValue() as string}</span>
          </div>
        )
      },
    },
    {
      id: 'stockmovementvehicleType',
      accessorKey: 'stockmovementvehicleType',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Type"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <RenderType type={getValue() as string} />
          </div>
        )
      },
    },
    {
      id: 'fromWarehouse',
      accessorKey: 'fromWarehouse',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Sumber"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const fromWarehouse: WarehouseView = getValue() as WarehouseView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{fromWarehouse?.name || '-'}</span>
          </div>
        )
      },
    },
    // {
    //   id: 'toWarehouse',
    //   accessorKey: 'toWarehouse',
    //   enableSorting: false,
    //   header: () => {
    //     return (
    //       <div className='whitespace-nowrap'>
    //         {"Tujuan"}
    //       </div>
    //     );
    //   },
    //   cell: ({ getValue, row }) => {
    //     const toWarehouse: WarehouseView = getValue() as WarehouseView
    //     return (
    //       <div className='w-full capitalize'>
    //         <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{toWarehouse?.name || '-'}</span>
    //       </div>
    //     )
    //   },
    // },
    {
      id: 'stockmovementvehicleStatus',
      accessorKey: 'stockmovementvehicleStatus',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Status"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <RenderStatus value={getValue() as string} row={row} />
        )
      },
    },
    {
      id: 'stockmovementvehiclephotos',
      accessorKey: 'stockmovementvehiclephotos',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Photo"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const data = getValue() as StockmovementvehiclephotoView[]
        return (
          <div className="text-left">
            <button className='w-full capitalize text-left cursor-pointer' onClick={() => toggleModalPhoto(row.original.id)} >
              <span className="text-primary-500 " data-tooltip-id={`tootltip-number-${row.original.id}`}>{data ? data?.length + ' Photos' : '0 Photos'}</span>
            </button>
          </div>
        )
      },
    },
    {
      id: 'sent_net_quantity',
      accessorKey: 'sentNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Dikirim"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-sent-${row.original.id}`}>{displayTon(getValue() as number) || '-'}</span>
            <Tooltip id={`tootltip-sent-${row.original.id}`} className="text-left">
              <div className="font-bold">{"Berat Dikirim"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex justify-between">
                <div className="w-20 font-bold">Tanggal Dikirim</div>
                <div>{row.original.sentTime ? displayDateTime(row.original.sentTime) : ' - '}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">GROSS</div>
                <div>{displayTon(row.original.sentGrossQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">TARE</div>
                <div>{displayTon(row.original.sentTareQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">NET</div>
                <div>{displayTon(row.original.sentNetQuantity)}</div>
              </div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'received_net_quantity',
      accessorKey: 'receivedNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Diterima"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-received-${row.original.id}`}>{row.original.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
            <Tooltip id={`tootltip-received-${row.original.id}`} className="text-left">
              <div className="font-bold">{"Berat Diterima"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex justify-between">
                <div className="w-20 font-bold">Tanggal Diterima</div>
                <div>{row.original.receivedTime ? displayDateTime(row.original.receivedTime) : ' - '}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">GROSS</div>
                <div>{displayTon(row.original.receivedGrossQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">TARE</div>
                <div>{displayTon(row.original.receivedTareQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">NET</div>
                <div>{displayTon(row.original.receivedNetQuantity)}</div>
              </div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'shrinkage',
      accessorKey: 'shrinkage',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Penyusutan"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {displayDateTime(getValue() as string)}
          </div>
        )
      },
    },
    // {
    //   id: 'id',
    //   header: 'Action',
    //   enableSorting: false,
    //   enableResizing: false,
    //   size: 50,
    //   maxSize: 50,
    //   cell: (props) => {
    //     return (
    //       <DropdownMore
    //         toggleModalDelete={toggleModalDelete}
    //         {...props}
    //       />
    //     );
    //   },
    // },
  ]

  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicle(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  return (
    <div className=''>
      <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
      />
      <Table
        columns={column}
        data={stockmovementvehicle}
        setPageRequest={setPageRequest}
        pageRequest={pageRequest}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </div>
  )
}

const TransferOut: NextPage<PropsTransferOut> = ({ warehouse }) => {
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView[]>([]);
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    fromWarehouseId: warehouse.id,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  const toggleModalPhoto = (id = '', refresh = false,) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalPhoto(!showModalPhoto);
  };

  const column: ColumnDef<StockmovementvehicleView>[] = [
    {
      id: 'number',
      accessorKey: 'number',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nomor Pengiriman"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{getValue() as string}</span>
          </div>
        )
      },
    },
    {
      id: 'stockmovementvehicleType',
      accessorKey: 'stockmovementvehicleType',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Type"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <RenderType type={getValue() as string} />
          </div>
        )
      },
    },
    // {
    //   id: 'fromWarehouse',
    //   accessorKey: 'fromWarehouse',
    //   enableSorting: false,
    //   header: () => {
    //     return (
    //       <div className='whitespace-nowrap'>
    //         {"Sumber"}
    //       </div>
    //     );
    //   },
    //   cell: ({ getValue, row }) => {
    //     const fromWarehouse: WarehouseView = getValue() as WarehouseView
    //     return (
    //       <div className='w-full capitalize'>
    //         <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{fromWarehouse?.name || '-'}</span>
    //       </div>
    //     )
    //   },
    // },
    {
      id: 'toWarehouse',
      accessorKey: 'toWarehouse',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tujuan"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const toWarehouse: WarehouseView = getValue() as WarehouseView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{toWarehouse?.name || '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'stockmovementvehicleStatus',
      accessorKey: 'stockmovementvehicleStatus',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Status"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <RenderStatus value={getValue() as string} row={row} />
        )
      },
    },
    {
      id: 'stockmovementvehiclephotos',
      accessorKey: 'stockmovementvehiclephotos',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Photo"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const data = getValue() as StockmovementvehiclephotoView[]
        return (
          <div className="text-left">
            <button className='w-full capitalize text-left cursor-pointer' onClick={() => toggleModalPhoto(row.original.id)} >
              <span className="text-primary-500 " data-tooltip-id={`tootltip-number-${row.original.id}`}>{data ? data?.length + ' Photos' : '0 Photos'}</span>
            </button>
          </div>
        )
      },
    },
    {
      id: 'sent_net_quantity',
      accessorKey: 'sentNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Dikirim"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-sent-${row.original.id}`}>{displayTon(getValue() as number) || '-'}</span>
            <Tooltip id={`tootltip-sent-${row.original.id}`} className="text-left">
              <div className="font-bold">{"Berat Dikirim"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex justify-between">
                <div className="w-20 font-bold">Tanggal Dikirim</div>
                <div>{row.original.sentTime ? displayDateTime(row.original.sentTime) : ' - '}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">GROSS</div>
                <div>{displayTon(row.original.sentGrossQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">TARE</div>
                <div>{displayTon(row.original.sentTareQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">NET</div>
                <div>{displayTon(row.original.sentNetQuantity)}</div>
              </div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'received_net_quantity',
      accessorKey: 'receivedNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Diterima"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-received-${row.original.id}`}>{row.original.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
            <Tooltip id={`tootltip-received-${row.original.id}`} className="text-left">
              <div className="font-bold">{"Berat Diterima"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex justify-between">
                <div className="w-20 font-bold">Tanggal Diterima</div>
                <div>{row.original.receivedTime ? displayDateTime(row.original.receivedTime) : ' - '}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">GROSS</div>
                <div>{displayTon(row.original.receivedGrossQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">TARE</div>
                <div>{displayTon(row.original.receivedTareQuantity)}</div>
              </div>
              <div className="flex justify-between">
                <div className="w-20 font-bold">NET</div>
                <div>{displayTon(row.original.receivedNetQuantity)}</div>
              </div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'shrinkage',
      accessorKey: 'shrinkage',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Penyusutan"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.stockmovementvehicleStatus === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {displayDateTime(getValue() as string)}
          </div>
        )
      },
    },
    // {
    //   id: 'id',
    //   header: 'Action',
    //   enableSorting: false,
    //   enableResizing: false,
    //   size: 50,
    //   maxSize: 50,
    //   cell: (props) => {
    //     return (
    //       <DropdownMore
    //         toggleModalDelete={toggleModalDelete}
    //         {...props}
    //       />
    //     );
    //   },
    // },
  ]

  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicle(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  return (
    <div className=''>
      <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
      />
      <Table
        columns={column}
        data={stockmovementvehicle}
        setPageRequest={setPageRequest}
        pageRequest={pageRequest}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </div>
  )
}

const Stock: NextPage<PropsStock> = ({ stock, refetch }) => {

  const [stocklogs, setStocklogs] = useState<StocklogView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('')

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

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageStocklog>({
    limit: 10,
    page: 1,
    preloads: "Stockmovementvehicle,Vehicle",
    warehouseId: stock.warehouseId,
    stockId: stock.id,
  });

  const { isLoading, data, refetch: refetchStocklog } = useQuery({
    queryKey: ['stocklog', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stocklog', queryKey[1] as object),
  });


  const column: ColumnDef<StocklogView>[] = [
    {
      id: 'stocklogType',
      accessorKey: 'stocklogType',
      enableSorting: false,
      enableResizing: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Type"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        switch (getValue()) {
          case "IN":
            return (
              <div className='w-full capitalize text-right'>
                <div className="flex items-center">
                  <ImArrowDown size={"1rem"} className="text-sky-500 mr-4" />
                  <RenderType type={row.original.stockmovementvehicle?.stockmovementvehicleType} />
                </div>
              </div>
            )
          case "OUT":
            return (
              <div className='w-full capitalize text-right'>
                <div className="flex items-center">
                  <ImArrowUp size={"1rem"} className="text-rose-500 mr-4" />
                  <RenderType type={row.original.stockmovementvehicle?.stockmovementvehicleType} />
                </div>
              </div>
            )
          case "ADJUSTMENT":
            return (
              <div className='w-full capitalize text-right'>
                <div className="flex items-center">
                  <FaRightLeft size={"1rem"} className="text-amber-500 mr-4" />
                  <div>{"ADJUSTMENT"}</div>
                </div>
              </div>
            )
          default:
            break;
        }
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Kendaraan"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        const vehicle: VehicleView = getValue() as VehicleView
        return (
          <div className='w-full capitalize'>
            <span>{vehicle ? vehicle.name + ' (' + vehicle.plateNumber + ')' : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'gross_quantity',
      accessorKey: 'grossQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Kotor"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'tare_quantity',
      accessorKey: 'tareQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Kosong"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'net_quantity',
      accessorKey: 'netQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Bersih"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {displayDateTime(getValue() as string)}
          </div>
        )
      },
    },
  ]

  const toggleModalAdjustment = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
      refetchStocklog()
    }
    setSelectedId(id)
    setShowModalDetail(!showModalDetail);
  }

  useEffect(() => {
    if (data?.status) {
      setStocklogs(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
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
      <ModalAdjustmentStock
        show={showModalDetail}
        onClickOverlay={toggleModalAdjustment}
        id={selectedId}
      />
      <div className="my-4">
        <div className="flex justify-between items-center">
          <div className="text-lg text-gray-600 flex">
            <div className="mr-4">{stock.product?.name || stock.id}</div>
            <div className="font-bold mr-4">{displayTon(stock.quantity)}</div>
          </div>
          <button type="button" onClick={() => toggleModalAdjustment(stock.id)} className='w-60 h-10 bg-amber-500 hover:bg-amber-600 rounded text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
            <MdRefresh className='mr-2' size={'1.5rem'} />
            <div>Adjustment Stock</div>
          </button>
        </div>
      </div>
      <div className=''>
        <Table
          columns={column}
          data={stocklogs}
          setPageRequest={setPageRequest}
          pageRequest={pageRequest}
          pageInfo={pageInfo}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

const Index: NextPage<Props> = ({ id }) => {


  const [warehouse, setWarehouse] = useState<WarehouseView>(null)

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
            { name: 'Warehouse', path: '/admin/warehouse' },
            { name: warehouse?.name || id, path: '' },
          ]}
        />
        <div className=''>
          {isLoading ? (
            <div className='bg-white mb-4 p-4 rounded shadow'>
              <div className="flex justify-center items-center">
                <div className="py-20">
                  <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
                </div>
              </div>
            </div>
          ) : (
            <div>
              {warehouse && (
                <>
                  {warehouse.isTransferIn && (
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
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Stock Product</div>
                    </div>
                    {warehouse?.stocks.map((stock) => (
                      <Stock key={stock.id} stock={stock} refetch={refetch} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



(Index as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;
