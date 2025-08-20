import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { StockmovementvehicleView, PageStockmovementvehicle } from "@/types/stockmovementvehicle";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDateTime, displayTon } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import ModalFilter from "@/components/modal/modal-filter-stockmovementvehicle";
import MainAdmin from "@/components/layout/main-admin";
import { Tooltip } from "react-tooltip";
import { StockmovementvehiclephotoView } from "@/types/stockmovementvehiclephoto";
import ModalPhoto from "@/components/modal/modal-photo";
import { WarehouseView } from "@/types/warehouse";
import ModalDetailStockmovementvehicle from "@/components/modal/modal-detail-stockmovementvehicle";

type Props = object

type PropsDropdownMore = {
  toggleModalDelete: (id: string, name: string) => void
  toggleModalDetail: (id: string) => void
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

const DropdownMore: NextPage<CellContext<StockmovementvehicleView, unknown> & PropsDropdownMore> = ({
  row,
  toggleModalDelete,
  toggleModalDetail,
}) => {
  const refMore = useRef<HTMLDivElement>(null);
  const [moreBar, setMoreBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (moreBar && refMore.current && !refMore.current.contains(e.target)) {
        setMoreBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [moreBar]);

  const handleClickDelete = (id, name) => {
    setMoreBar(false);
    toggleModalDelete(id, name)
  }

  return (
    <div className="relative inline-block py-2 text-right" ref={refMore}>
      <button className="flex justify-center items-center text-primary-500" type="button" onClick={() => setMoreBar(!moreBar)} >
        <div>Lainnya</div>
        <CgChevronDown size={'1.2rem'} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white border-2 border-gray-200 focus:outline-none duration-300 ease-in-out ${!moreBar && 'scale-0 shadow-none ring-0'}`}>
        <div className="" role="none">
          <button onClick={() => toggleModalDetail(row.original.id)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Detail'}
          </button>
          <button onClick={() => handleClickDelete(row.original.id, row.original.number)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
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


const Index: NextPage<Props> = () => {

  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView[]>([]);
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('')
  const [showModalPhoto, setShowModalPhoto] = useState<boolean>(false);

  const [filter, setFilter] = useState<PageStockmovementvehicle>({
    fromWarehouseId: '',
    toWarehouseId: '',
    productId: '',
    vehicleId: '',
    startSentGrossQuantity: '',
    startSentTareQuantity: '',
    startSentNetQuantity: '',
    startSentTime: '',
    startReceivedGrossQuantity: '',
    startReceivedTareQuantity: '',
    startReceivedNetQuantity: '',
    startReceivedTime: '',
    endSentGrossQuantity: '',
    endSentTareQuantity: '',
    endSentNetQuantity: '',
    endSentTime: '',
    endReceivedGrossQuantity: '',
    endReceivedTareQuantity: '',
    endReceivedNetQuantity: '',
    endReceivedTime: '',
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

  const [pageRequest, setPageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    preloads: "FromWarehouse,ToWarehouse,Stockmovementvehiclephotos",
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
    {
      id: 'id',
      header: 'Action',
      enableSorting: false,
      enableResizing: false,
      size: 50,
      maxSize: 50,
      cell: (props) => {
        return (
          <DropdownMore
            toggleModalDelete={toggleModalDelete}
            toggleModalDetail={toggleModalDetail}
            {...props}
          />
        );
      },
    },
  ]

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/' + id)
  });

  const toggleModalDetail = (id = '') => {
    setDetailId(id);
    setShowModalDetail(!showModalDetail);
  };

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
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

  useEffect(() => {
    setPageRequest(removeEmptyValues({
      ...pageRequest,
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    }))
  }, [filter])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Pengiriman'}</title>
      </Head>
      <ModalDetailStockmovementvehicle
        show={showModalDetail}
        onClickOverlay={toggleModalDetail}
        id={detailId}
      />
      <ModalFilter
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <ModalPhoto
        show={showModalPhoto}
        onClickOverlay={toggleModalPhoto}
        id={selectedId}
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
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Pengiriman', path: '' },
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
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 shadow hover:scale-105' onClick={() => toggleModalFilter()}>
                    {isEmptyObject(removeEmptyValues(filter)) ? <TbFilter className='text-primary-500' size={'1.2rem'} /> : <TbFilterFilled className='text-primary-500' size={'1.2rem'} />}
                  </button>
                </div>
                {/* <div className='ml-4'>
                  <Link href={{ pathname: '/admin/stockmovementvehicle/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>New Stockmovementvehicle</div>
                    </div>
                  </Link>
                </div> */}
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={stockmovementvehicle}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;



